#!/usr/bin/env python3
"""
Comprehensive single-pass renumbering of ADRs and DES identifiers.

Stages:
  A. Scan DESIGN.md to assign DES numbers by document order
  B. Build COMPLETE mapping of ALL 144 old ADR numbers
  C. Process DECISIONS.md (reorder, renumber, remove tombstones)
  D. Process DESIGN.md (add DES headers, convert ADR headers, update TOC)
  E. Update cross-references in CONTEXT.md, ROADMAP.md, CLAUDE.md
  F. Verification report

The critical fix over renumber.py: ALL old ADR numbers are mapped in a
single pass—active ADRs to new ADR numbers, migrated ADRs to DES numbers,
removed ADRs to nothing—preventing the collision bug.
"""

import re
import os
import sys

BASE = '/home/rana/prj/srf-yogananda-teachings'

# ============================================================
# DATA: Active ADRs (99) — old number → new number
# ============================================================

ADR_MAP = {
    # Group 1: Foundational Constraints (001-007)
    3: 1, 14: 2, 17: 3, 33: 4, 49: 5, 61: 6, 140: 7,
    # Group 2: Architecture & Platform (008-028)
    4: 8, 1: 9, 2: 10, 24: 11, 25: 12, 109: 13, 110: 14,
    9: 15, 31: 16, 143: 17, 70: 18, 72: 19, 80: 20, 82: 21,
    66: 22, 67: 23, 71: 24, 83: 25, 85: 26, 91: 27, 51: 28,
    # Group 3: Content & Data Model (029-043)
    5: 29, 12: 30, 13: 31, 48: 32, 58: 33, 69: 34, 86: 35,
    92: 36, 142: 37, 93: 38, 103: 39, 105: 40, 108: 41, 16: 42,
    134: 43,
    # Group 4: Search & AI (044-053)
    6: 44, 7: 45, 32: 46, 120: 47, 115: 48, 121: 49, 34: 50,
    52: 51, 97: 52, 68: 53,
    # Group 5: Cross-Media (054-064)
    11: 54, 57: 55, 88: 56, 78: 57, 131: 58, 139: 59, 87: 60,
    98: 61, 137: 62, 106: 63, 107: 64,
    # Group 6: Seeker Experience (065-074)
    8: 65, 41: 66, 130: 67, 15: 68, 26: 69, 47: 70, 122: 71,
    127: 72, 129: 73, 124: 74,
    # Group 7: Internationalization (075-081)
    20: 75, 21: 76, 22: 77, 23: 78, 79: 79, 141: 80, 84: 81,
    # Group 8: Staff & Community (082-087)
    64: 82, 111: 83, 116: 84, 81: 85, 135: 86, 136: 87,
    # Group 9: Brand & Communications (088-092)
    45: 88, 112: 89, 113: 90, 18: 91, 19: 92,
    # Group 10: Operations & Engineering (093-097)
    27: 93, 28: 94, 29: 95, 30: 96, 90: 97,
    # Group 11: Governance (098-099)
    119: 98, 144: 99,
}

GROUPS = [
    ('Foundational Constraints', 1, 7),
    ('Architecture & Platform', 8, 28),
    ('Content & Data Model', 29, 43),
    ('Search & AI', 44, 53),
    ('Cross-Media', 54, 64),
    ('Seeker Experience', 65, 74),
    ('Internationalization', 75, 81),
    ('Staff & Community', 82, 87),
    ('Brand & Communications', 88, 92),
    ('Operations & Engineering', 93, 97),
    ('Governance', 98, 99),
]

# ============================================================
# DATA: Superseded ADRs with known successors
# These map to the successor's NEW number to preserve cross-refs.
# ============================================================

SUPERSEDED_TO_SUCCESSOR = {
    65: 17,  # old ADR-065 (Lambda batch) → new ADR-017 (old ADR-143, Terraform-Native Lambda)
    77: 83,  # old ADR-077 (Talk Workspace) → new ADR-083 (old ADR-111, Study Workspace)
}

# ============================================================
# DATA: Removed/withdrawn ADRs with NO successor (stripped)
# ============================================================

REMOVED_ADRS = {10, 53}

# ============================================================
# DATA: Migrated ADRs with DEDICATED DESIGN.md section headers
# These will be mapped to DES numbers (assigned in Stage A).
# Key = old ADR number, Value = regex to match the header line.
# Some ADRs map to multiple sections (056, 138) — use first match.
# ============================================================

# Migrated ADRs that appear in section headers as (ADR-NNN)
MIGRATED_WITH_SECTIONS = {
    37, 38, 39, 40, 42, 43, 44, 54, 55, 56,
    99, 100, 126, 128, 132, 138,
}

# Migrated ADRs WITHOUT their own section headers in DESIGN.md
# References to these will be stripped (leaving descriptive text)
MIGRATED_INLINE = {
    35, 36, 46, 50, 59, 60, 62, 63, 73, 74, 75, 76,
    89, 94, 95, 96, 101, 102, 104, 114, 117, 118,
    123, 125, 133,
}


# ============================================================
# Stage A: Scan DESIGN.md, assign DES numbers by document order
# ============================================================

def scan_design_for_des(content):
    """
    Identify all sections that get DES identifiers.
    Returns:
      - des_assignments: list of (line_num, heading_level, title, old_adr_nums, des_num)
      - migrated_adr_to_des: {old_adr_num: des_num}
    """
    header_pat = re.compile(r'^(#{2,4}) (.+)$', re.MULTILINE)
    adr_ref_pat = re.compile(r'\(ADR-(\d{3})(?:,\s*ADR-(\d{3}))*(?:\s+(?:extension|ext))?\)')
    # More flexible pattern for multi-ADR
    multi_adr_pat = re.compile(r'ADR-(\d{3})')

    des_sections = []  # (line_offset, level, full_header, old_adr_nums_or_none)

    for match in header_pat.finditer(content):
        hashes = match.group(1)
        title_text = match.group(2)
        level = len(hashes)
        line_offset = content[:match.start()].count('\n') + 1

        # Skip "Open Questions" — not a design section
        if title_text.strip().startswith('Open Questions'):
            continue

        # Check for ADR references in parenthetical at end
        adr_match = adr_ref_pat.search(title_text)
        adr_nums_in_header = []
        if adr_match:
            adr_nums_in_header = [int(x) for x in multi_adr_pat.findall(title_text)
                                   if x.isdigit()]

        # Determine if this section gets a DES identifier
        gets_des = False

        if not adr_nums_in_header:
            # No ADR reference — top-level sections get DES
            if level == 2:
                gets_des = True
        else:
            # Has ADR reference(s) — check if ALL are migrated
            all_migrated = all(
                n not in ADR_MAP for n in adr_nums_in_header
            )
            any_migrated = any(
                n not in ADR_MAP for n in adr_nums_in_header
            )

            if all_migrated:
                gets_des = True
            elif any_migrated:
                # Mixed header (e.g., ADR-132, ADR-034): DES if primary is migrated
                # The first ADR number determines
                gets_des = adr_nums_in_header[0] not in ADR_MAP

        if gets_des:
            des_sections.append((line_offset, level, title_text, adr_nums_in_header))

    # Assign DES numbers in document order
    des_assignments = []
    migrated_adr_to_des = {}

    for i, (line_num, level, title, adr_nums) in enumerate(des_sections, start=1):
        des_assignments.append((line_num, level, title, adr_nums, i))
        # Map migrated ADR numbers to this DES number
        for n in adr_nums:
            if n not in ADR_MAP and n not in migrated_adr_to_des:
                migrated_adr_to_des[n] = i

    return des_assignments, migrated_adr_to_des


# ============================================================
# Stage B: Build the COMPLETE reference mapping
# ============================================================

def build_complete_mapping(migrated_adr_to_des):
    """
    Build mapping covering ALL old ADR numbers 1-144.
    Returns: {old_num: ('adr', new_num) | ('des', new_num) | ('marker', None)}

    'marker' entries get converted to «NNN» markers during replacement,
    then cleaned up in a post-processing pass to strip dead references
    without colliding with new ADR numbers.
    """
    mapping = {}

    for old_num in range(1, 145):
        if old_num in ADR_MAP:
            mapping[old_num] = ('adr', ADR_MAP[old_num])
        elif old_num in migrated_adr_to_des:
            mapping[old_num] = ('des', migrated_adr_to_des[old_num])
        elif old_num in SUPERSEDED_TO_SUCCESSOR:
            mapping[old_num] = ('adr', SUPERSEDED_TO_SUCCESSOR[old_num])
        elif old_num in REMOVED_ADRS:
            mapping[old_num] = ('marker', None)
        elif old_num in MIGRATED_INLINE:
            mapping[old_num] = ('marker', None)
        elif old_num in MIGRATED_WITH_SECTIONS:
            # Should have been caught by migrated_adr_to_des
            # If not, it means the header wasn't found — treat as marker
            print(f'  WARNING: ADR-{old_num:03d} expected in header but not found, treating as marker')
            mapping[old_num] = ('marker', None)
        else:
            # Unknown — flag it
            print(f'  WARNING: ADR-{old_num:03d} not in any category')
            mapping[old_num] = ('marker', None)

    return mapping


# ============================================================
# Stage C: Process DECISIONS.md
# ============================================================

def parse_adr_sections(content):
    """Parse DECISIONS.md into dict of {adr_num: section_text}."""
    pattern = re.compile(r'^## ADR-(\d{3}):', re.MULTILINE)
    matches = list(pattern.finditer(content))

    sections = {}
    for i, match in enumerate(matches):
        start = match.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(content)
        section_text = content[start:end].rstrip()
        section_text = re.sub(r'\n---\s*$', '', section_text).rstrip()
        old_num = int(match.group(1))
        sections[old_num] = section_text

    # Extract preamble
    preamble = content[:matches[0].start()].rstrip() if matches else content
    return preamble, sections


def extract_title(section_text):
    """Extract title from section header."""
    match = re.match(r'^## ADR-\d{3}: (.+)$', section_text, re.MULTILINE)
    return match.group(1) if match else 'Unknown'


def build_domain_index(sections_by_new_num):
    """Generate the domain index at top of DECISIONS.md."""
    lines = ['### Index by Concern', '']
    for group_name, start, end in GROUPS:
        lines.append(f'**{group_name}**')
        for num in range(start, end + 1):
            if num in sections_by_new_num:
                title = extract_title(sections_by_new_num[num])
                lines.append(f'- ADR-{num:03d}: {title}')
        lines.append('')
    return '\n'.join(lines)


def replace_adr_and_migrated_refs(text, complete_map):
    """
    Single-pass replacement of ALL ADR-NNN references:
      - Active ADRs → new ADR numbers
      - Migrated-with-sections → DES numbers
      - Superseded → successor's new ADR number
      - Inline-migrated/removed → «NNN» markers (cleaned up later)

    Markers prevent collision: old ADR-035 (inline-migrated) would otherwise
    be indistinguishable from new ADR-035 (old ADR-086).
    """
    def replacer(match):
        prefix = match.group(1)
        num = int(match.group(2))

        if num not in complete_map:
            return match.group(0)

        kind, new_num = complete_map[num]

        if kind == 'adr':
            return f'{prefix}-{new_num:03d}'
        elif kind == 'des':
            new_prefix = 'DES' if prefix == 'ADR' else 'des'
            return f'{new_prefix}-{new_num:03d}'
        elif kind == 'marker':
            return f'\u00ab{num:03d}\u00bb'
        else:
            return match.group(0)

    return re.sub(r'(ADR|adr)-(\d{3})', replacer, text)


def cleanup_markers(text):
    """
    Strip «NNN» markers left by replace_adr_and_migrated_refs.
    Handles common patterns:
      - Pure parenthetical: (  «NNN»  ) → removed
      - Mixed parenthetical: (ADR-XXX, «NNN») → (ADR-XXX)
      - Marker with description: «NNN» (desc), → removed
      - Context line entries: «NNN» (desc), ADR-XXX → ADR-XXX
      - Inline references: text «NNN» text → text text
      - Empty Context lines → removed
    """
    M = '\u00ab\\d{3}\u00bb'  # marker pattern shorthand

    # 1. Marker with associated parenthetical description in comma-separated list:
    #    «NNN» (description), ... → strip entry entirely
    text = re.sub(rf'{M}\s*\([^)]*\),?\s*', '', text)
    #    ..., «NNN» (description) → strip entry
    text = re.sub(rf',\s*{M}\s*\([^)]*\)', '', text)

    # 2. Pure marker parenthetical: (  «NNN»  )
    text = re.sub(rf'\(\s*{M}\s*\)', '', text)

    # 3. Multiple markers in parenthetical: (  «NNN», «MMM»  )
    text = re.sub(rf'\(\s*(?:{M}\s*,?\s*)+\)', '', text)

    # 4. Marker at end of comma list before close paren: , «NNN»)
    text = re.sub(rf',\s*{M}\s*\)', ')', text)

    # 5. Marker at start of comma list after open paren: (  «NNN»,
    text = re.sub(rf'\(\s*{M}\s*,\s*', '(', text)

    # 6. Marker in middle of comma list: , «NNN»,
    text = re.sub(rf',\s*{M}\s*,', ',', text)

    # 7. Marker with trailing comma (general): «NNN»,  → strip
    text = re.sub(rf'{M},\s*', '', text)

    # 8. Marker with leading comma (general): , «NNN» → strip
    text = re.sub(rf',\s*{M}', '', text)

    # 9. Any remaining bare markers → strip
    text = re.sub(rf'{M}', '', text)

    # 10. Cleanup artifacts
    text = re.sub(r' {2,}', ' ', text)          # double spaces
    text = re.sub(r'\(\s*\)', '', text)          # empty parens ()
    text = re.sub(r',\s*\)', ')', text)          # trailing comma in parens
    text = re.sub(r'\(\s*,', '(', text)          # leading comma in parens
    text = re.sub(r'\( +', '(', text)            # space after opening paren
    text = re.sub(r' +\)', ')', text)            # space before closing paren
    text = re.sub(r' +,', ',', text)             # space before comma
    text = re.sub(r'^\*\*Context:\*\*\s*$', '', text, flags=re.MULTILINE)  # empty Context lines
    text = re.sub(r'^\*\*Relates to:\*\*\s*$', '', text, flags=re.MULTILINE)  # empty Relates lines
    text = re.sub(r'\(Relates to\s*\)', '', text)   # empty (Relates to) parens
    text = re.sub(r'\(See\s*\)', '', text)          # empty (See) parens
    text = re.sub(r'\(Extends\s*\)', '', text)      # empty (Extends) parens
    text = re.sub(r' +\n', '\n', text)           # trailing spaces
    text = re.sub(r'\n{3,}', '\n\n', text)       # excessive blank lines

    return text


def process_decisions(content, complete_map):
    """Reorder, renumber, remove tombstones from DECISIONS.md."""
    _preamble, old_sections = parse_adr_sections(content)

    active = {num: text for num, text in old_sections.items() if num in ADR_MAP}
    removed_count = len(old_sections) - len(active)

    print(f'  Parsed: {len(old_sections)} total ADR sections')
    print(f'  Active: {len(active)} (in ADR_MAP)')
    print(f'  Removing: {removed_count} tombstones/inactive')

    # Pre-renumbering cleanups for superseded ADR self-references.
    # ADR-143 supersedes ADR-065. Since both map to ADR-017 (143's new number),
    # all "ADR-065" refs WITHIN ADR-143's own text would become self-referential.
    # Replace with descriptive text before the single-pass replacement runs.
    if 143 in active:
        active[143] = active[143].replace(' — Supersedes ADR-065', '', 1)
        active[143] = re.sub(
            r'ADR-065',
            'the former Lambda batch decision',
            active[143]
        )

    # ADR-111 supersedes ADR-077. Same issue: both map to ADR-083.
    if 111 in active:
        active[111] = active[111].replace(' (supersedes ADR-077)', '', 1)
        active[111] = re.sub(
            r'ADR-077',
            'the former Talk Preparation Workspace decision',
            active[111]
        )

    # Renumber each section (single pass using complete_map), then cleanup markers
    new_sections = {}
    for old_num, text in active.items():
        new_num = ADR_MAP[old_num]
        renumbered = replace_adr_and_migrated_refs(text, complete_map)
        cleaned = cleanup_markers(renumbered)
        new_sections[new_num] = cleaned

    # Build output
    header = (
        '# SRF Online Teachings Portal — Architecture Decision Records\n\n'
        'Each decision is recorded with full context so future contributors '
        'understand not just *what* was decided but *why*, and what alternatives '
        'were considered.\n\n'
    )

    index = build_domain_index(new_sections)
    parts = [header, index, '---\n\n']

    for num in sorted(new_sections.keys()):
        parts.append(new_sections[num])
        parts.append('\n\n---\n\n')

    return ''.join(parts).rstrip() + '\n'


# ============================================================
# Stage D: Process DESIGN.md
# ============================================================

def make_gfm_anchor(text):
    """Generate GitHub Flavored Markdown anchor from heading text."""
    # Lowercase
    anchor = text.lower()
    # Remove everything except alphanumerics, spaces, and hyphens
    anchor = re.sub(r'[^a-z0-9 \-]', '', anchor)
    # Replace spaces with hyphens
    anchor = anchor.replace(' ', '-')
    # Strip leading/trailing hyphens
    anchor = anchor.strip('-')
    return anchor


def process_design(content, des_assignments, complete_map):
    """Add DES identifiers, convert ADR headers to prefix, update TOC."""

    lines = content.split('\n')

    # Build lookup: line_number → des_assignment
    des_by_line = {}
    for (line_num, level, title, adr_nums, des_num) in des_assignments:
        des_by_line[line_num] = (level, title, adr_nums, des_num)

    # Also build lookup for ADR-governed headers (active ADRs in headers)
    # that need prefix conversion
    adr_header_pat = re.compile(r'^(#{2,4}) (.+?)(?:\s+—\s+ADR-(\d{3}))?\s*$')
    adr_paren_pat = re.compile(r'\(ADR-(\d{3})(?:,\s*ADR-(\d{3}))*(?:\s+(?:extension|ext))?\)')
    multi_adr_in_paren = re.compile(r'ADR-(\d{3})')

    # First pass: identify all header lines and their transformations
    header_transforms = {}  # line_index → new_header_text

    for idx, line in enumerate(lines):
        line_num = idx + 1  # 1-indexed

        header_match = re.match(r'^(#{2,4}) (.+)$', line)
        if not header_match:
            continue

        hashes = header_match.group(1)
        title = header_match.group(2)

        # Check if this line gets a DES identifier
        if line_num in des_by_line:
            level, orig_title, adr_nums, des_num = des_by_line[line_num]
            # Strip ADR parenthetical from title
            clean_title = adr_paren_pat.sub('', orig_title).rstrip(' —').rstrip()
            # Handle "— ADR-NNN" suffix style too
            clean_title = re.sub(r'\s*—\s*ADR-\d{3}\s*$', '', clean_title).rstrip()
            header_transforms[idx] = f'{hashes} DES-{des_num:03d}: {clean_title}'
            continue

        # Check if this has active ADR reference(s) → prefix conversion
        paren_match = adr_paren_pat.search(title)
        if paren_match:
            adr_nums_in_header = [int(x) for x in multi_adr_in_paren.findall(title)]
            # Check if ALL are active (in ADR_MAP)
            all_active = all(n in ADR_MAP for n in adr_nums_in_header)
            any_active = any(n in ADR_MAP for n in adr_nums_in_header)

            if any_active:
                # Strip parenthetical from title
                clean_title = adr_paren_pat.sub('', title).rstrip(' —').rstrip()

                # Check for "extension" or "ext"
                is_ext = 'extension' in paren_match.group(0) or 'ext' in paren_match.group(0)

                # Build new ADR prefix
                new_adr_nums = []
                for n in adr_nums_in_header:
                    if n in ADR_MAP:
                        new_adr_nums.append(ADR_MAP[n])
                    elif n in complete_map and complete_map[n][0] == 'des':
                        # Mixed: migrated ADR in same header as active
                        # Keep only active ADRs in the prefix
                        pass
                    else:
                        pass

                if new_adr_nums:
                    adr_prefix = ', '.join(f'ADR-{n:03d}' for n in sorted(new_adr_nums))
                    if is_ext:
                        adr_prefix += ' ext'
                    header_transforms[idx] = f'{hashes} {adr_prefix}: {clean_title}'
                continue

        # Check for "— ADR-NNN" suffix style (not in parens)
        suffix_match = re.search(r'\s*—\s*ADR-(\d{3})\s*$', title)
        if suffix_match:
            adr_num = int(suffix_match.group(1))
            if adr_num in ADR_MAP:
                clean_title = re.sub(r'\s*—\s*ADR-\d{3}\s*$', '', title).rstrip()
                new_num = ADR_MAP[adr_num]
                header_transforms[idx] = f'{hashes} ADR-{new_num:03d}: {clean_title}'

    # CRITICAL: Apply body text replacement FIRST on original content,
    # THEN override header lines with pre-computed transforms.
    # This prevents double-replacement: header transforms produce NEW numbers
    # (e.g., ADR-055), and if body text replacement runs after, it would
    # treat ADR-055 as OLD ADR-055 (Reverse Bibliography) and re-map it.
    content = '\n'.join(lines)
    content = replace_adr_and_migrated_refs(content, complete_map)
    content = cleanup_markers(content)
    lines = content.split('\n')

    # Now override header lines with correct pre-computed transforms
    for idx, new_header in header_transforms.items():
        lines[idx] = new_header

    content = '\n'.join(lines)

    # Now rebuild the TOC
    content = rebuild_design_toc(content, des_assignments, complete_map)

    return content


def rebuild_design_toc(content, des_assignments, complete_map):
    """Rebuild the Table of Contents at the top of DESIGN.md."""
    lines = content.split('\n')

    # Find TOC boundaries: starts with "| Section | Phase |" and ends with "---"
    toc_start = None
    toc_end = None
    for i, line in enumerate(lines):
        if '| Section | Phase |' in line:
            toc_start = i
        if toc_start is not None and i > toc_start + 1 and line.strip() == '---':
            toc_end = i
            break

    if toc_start is None or toc_end is None:
        print('  WARNING: Could not find TOC boundaries in DESIGN.md')
        return content

    # Scan for all ## level sections to build new TOC
    toc_entries = []
    header_pat = re.compile(r'^(#{2,4}) (.+)$', re.MULTILINE)

    # We need to scan the transformed content (after header changes)
    for match in header_pat.finditer(content):
        level = len(match.group(1))
        title = match.group(2)
        line_num = content[:match.start()].count('\n') + 1

        # Skip if before TOC
        if line_num <= toc_end + 1:
            continue

        # Skip Open Questions
        if 'Open Questions' in title:
            continue

        # Only include ## level sections + a few notable sub-sections
        if level == 2:
            anchor = make_gfm_anchor(title)
            # Extract display name (strip DES/ADR prefix for cleaner TOC)
            display = title
            toc_entries.append((display, anchor, level, False))
        elif level == 3:
            # Include select ### sections that were in original TOC
            # Check if this is a notable sub-section
            notable_subsections = [
                'Search Suggestions', 'Semantic Density', 'Corpus Stylometric',
                '/browse', '/guide',
            ]
            if any(ns in title for ns in notable_subsections):
                anchor = make_gfm_anchor(title)
                toc_entries.append((title, anchor, level, True))

    # Build new TOC
    new_toc_lines = []
    # Preserve the preamble before TOC table
    preamble_end = toc_start
    # Find the "> **Navigation guide" line
    nav_guide_line = None
    for i in range(max(0, toc_start - 3), toc_start):
        if lines[i].startswith('> **Navigation guide'):
            nav_guide_line = i
            break

    # Build TOC entries
    new_toc_lines.append(f'> **Navigation guide.** {len([e for e in toc_entries if not e[3]])} sections organized by concern. The **Phase** column indicates when each section becomes relevant to implementation. Sections marked "—" are cross-cutting principles.')
    new_toc_lines.append('')
    new_toc_lines.append('| Section | Phase |')
    new_toc_lines.append('|---------|-------|')

    # Phase mapping for known sections (simplified — use original phases)
    # We'll use a heuristic: scan original TOC for phase info
    original_toc = '\n'.join(lines[toc_start:toc_end])
    phase_map = {}
    for toc_match in re.finditer(r'\[([^\]]+)\]\([^)]+\)\s*\|\s*([^|]+)\|', original_toc):
        section_name = toc_match.group(1).strip()
        phase = toc_match.group(2).strip()
        # Normalize section name for matching
        phase_map[section_name.lower().strip()] = phase

    for display, anchor, level, is_sub in toc_entries:
        # Find phase from original TOC (fuzzy match)
        phase = '—'
        display_lower = display.lower().strip()
        # Try direct match
        for key, val in phase_map.items():
            # Extract just the meaningful part of the display name
            clean_display = re.sub(r'^(?:DES|ADR)-\d{3}(?:,\s*(?:DES|ADR)-\d{3})*(?:\s+ext)?:\s*', '', display)
            if clean_display.lower().strip() in key or key in clean_display.lower().strip():
                phase = val
                break

        indent = '&emsp;' if is_sub else ''
        new_toc_lines.append(f'| {indent}[{display}](#{anchor}) | {phase} |')

    new_toc_lines.append('')

    # Replace TOC region
    if nav_guide_line is not None:
        start_replace = nav_guide_line
    else:
        start_replace = toc_start

    new_lines = lines[:start_replace] + new_toc_lines + lines[toc_end:]
    return '\n'.join(new_lines)


# ============================================================
# Stage E: Update other files
# ============================================================

def process_other_file(filepath, complete_map):
    """Update cross-references in CONTEXT.md, ROADMAP.md, CLAUDE.md."""
    with open(filepath) as f:
        content = f.read()

    updated = replace_adr_and_migrated_refs(content, complete_map)
    updated = cleanup_markers(updated)

    if content != updated:
        with open(filepath, 'w') as f:
            f.write(updated)
        return True
    return False


# ============================================================
# Stage F: Verification
# ============================================================

def verify_all_files(complete_map):
    """Report remaining unmapped references and leftover markers."""
    print('\n=== Verification Report ===\n')

    files = ['DECISIONS.md', 'DESIGN.md', 'CONTEXT.md', 'CLAUDE.md', 'ROADMAP.md']
    total_warnings = 0

    for filename in files:
        filepath = os.path.join(BASE, filename)
        if not os.path.exists(filepath):
            continue

        with open(filepath) as f:
            content = f.read()

        file_warnings = 0

        # Check for leftover markers (should all be cleaned up)
        for match in re.finditer(r'\u00ab(\d{3})\u00bb', content):
            num = int(match.group(1))
            line_num = content[:match.start()].count('\n') + 1
            print(f'  MARKER: {filename}:{line_num} — «{num:03d}» (leftover marker, needs manual cleanup)')
            file_warnings += 1
            total_warnings += 1

        # Check for old ADR numbers still present (>99 range)
        for match in re.finditer(r'(ADR|adr)-(\d{3})', content):
            num = int(match.group(2))
            line_num = content[:match.start()].count('\n') + 1

            # New ADR numbers (1-99) are fine
            if 1 <= num <= 99:
                continue

            # Anything > 99 is suspicious (should have been converted)
            print(f'  WARNING: {filename}:{line_num} — {match.group(0)} (unconverted >99 reference)')
            file_warnings += 1
            total_warnings += 1

        if file_warnings == 0:
            print(f'  {filename}: OK')

    # Summary counts
    print('\n--- Reference counts ---')
    for filename in files:
        filepath = os.path.join(BASE, filename)
        if not os.path.exists(filepath):
            continue
        with open(filepath) as f:
            content = f.read()
        adr_count = len(re.findall(r'(?:ADR|adr)-\d{3}', content))
        des_count = len(re.findall(r'(?:DES|des)-\d{3}', content))
        marker_count = len(re.findall(r'\u00ab\d{3}\u00bb', content))
        parts = []
        if adr_count: parts.append(f'{adr_count} ADR')
        if des_count: parts.append(f'{des_count} DES')
        if marker_count: parts.append(f'{marker_count} markers')
        if parts:
            print(f'  {filename}: {", ".join(parts)}')

    return total_warnings


# ============================================================
# Main
# ============================================================

def main():
    print('=== Comprehensive ADR + DES Renumbering ===\n')

    # Read all files
    files = {}
    for name in ['DECISIONS.md', 'DESIGN.md', 'CONTEXT.md', 'CLAUDE.md', 'ROADMAP.md']:
        filepath = os.path.join(BASE, name)
        if os.path.exists(filepath):
            with open(filepath) as f:
                files[name] = f.read()
            print(f'  Read {name}: {len(files[name])} chars')

    # Stage A: Scan DESIGN.md for DES assignments
    print('\n--- Stage A: DES Assignment ---')
    des_assignments, migrated_adr_to_des = scan_design_for_des(files['DESIGN.md'])
    print(f'  {len(des_assignments)} DES sections identified (DES-001 through DES-{len(des_assignments):03d})')
    print(f'  {len(migrated_adr_to_des)} migrated ADRs mapped to DES numbers:')
    for old_adr, des_num in sorted(migrated_adr_to_des.items()):
        print(f'    ADR-{old_adr:03d} → DES-{des_num:03d}')

    # Stage B: Build complete mapping
    print('\n--- Stage B: Complete Mapping ---')
    complete_map = build_complete_mapping(migrated_adr_to_des)
    adr_count = sum(1 for v in complete_map.values() if v[0] == 'adr')
    des_count = sum(1 for v in complete_map.values() if v[0] == 'des')
    marker_count = sum(1 for v in complete_map.values() if v[0] == 'marker')
    print(f'  Active ADR → new ADR: {adr_count} (includes {len(SUPERSEDED_TO_SUCCESSOR)} superseded→successor)')
    print(f'  Migrated ADR → DES: {des_count}')
    print(f'  Inline/removed → marker (stripped): {marker_count}')
    print(f'  Total mapped: {adr_count + des_count + marker_count}')

    # Stage C: Process DECISIONS.md
    print('\n--- Stage C: DECISIONS.md ---')
    decisions_output = process_decisions(files['DECISIONS.md'], complete_map)
    with open(os.path.join(BASE, 'DECISIONS.md'), 'w') as f:
        f.write(decisions_output)
    new_adr_count = len(re.findall(r'^## ADR-\d{3}:', decisions_output, re.MULTILINE))
    print(f'  Written: {new_adr_count} ADRs, {len(decisions_output)} chars')

    # Stage D: Process DESIGN.md
    print('\n--- Stage D: DESIGN.md ---')
    design_output = process_design(files['DESIGN.md'], des_assignments, complete_map)
    with open(os.path.join(BASE, 'DESIGN.md'), 'w') as f:
        f.write(design_output)
    des_header_count = len(re.findall(r'^#{2,4} DES-\d{3}:', design_output, re.MULTILINE))
    adr_header_count = len(re.findall(r'^#{2,4} ADR-\d{3}', design_output, re.MULTILINE))
    print(f'  Written: {des_header_count} DES headers, {adr_header_count} ADR headers')

    # Stage E: Other files
    print('\n--- Stage E: Other Files ---')
    for name in ['CONTEXT.md', 'ROADMAP.md', 'CLAUDE.md']:
        if name in files:
            filepath = os.path.join(BASE, name)
            changed = process_other_file(filepath, complete_map)
            print(f'  {name}: {"updated" if changed else "no changes"}')

    # Stage F: Verification
    warnings = verify_all_files(complete_map)
    print(f'\n  Total warnings: {warnings}')
    if warnings > 0:
        print('  Run: grep -n "ADR-[0-9]\\{3\\}" DESIGN.md CONTEXT.md ROADMAP.md | grep -v "ADR-0[0-9][0-9]"')
        print('  to find remaining old references.')

    print('\n=== Done ===')


if __name__ == '__main__':
    main()
