/**
 * SRF Lotus mark — brand identity element.
 *
 * Inline SVG lotus flower inspired by SRF's iconic lotus symbol.
 * Uses currentColor for easy theming. Scales with className.
 */

interface Props {
  className?: string;
  /** Size shorthand — applies w-N h-N classes */
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

export function SrfLotus({ className, size = "md" }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      className={className ?? sizes[size]}
      aria-hidden="true"
    >
      {/* Center petal */}
      <ellipse cx="50" cy="45" rx="8" ry="28" opacity="0.9" />
      {/* Inner left */}
      <ellipse
        cx="50"
        cy="45"
        rx="7"
        ry="26"
        transform="rotate(-20 50 65)"
        opacity="0.8"
      />
      {/* Inner right */}
      <ellipse
        cx="50"
        cy="45"
        rx="7"
        ry="26"
        transform="rotate(20 50 65)"
        opacity="0.8"
      />
      {/* Mid left */}
      <ellipse
        cx="50"
        cy="48"
        rx="6"
        ry="22"
        transform="rotate(-40 50 65)"
        opacity="0.65"
      />
      {/* Mid right */}
      <ellipse
        cx="50"
        cy="48"
        rx="6"
        ry="22"
        transform="rotate(40 50 65)"
        opacity="0.65"
      />
      {/* Outer left */}
      <ellipse
        cx="50"
        cy="52"
        rx="5"
        ry="18"
        transform="rotate(-60 50 65)"
        opacity="0.45"
      />
      {/* Outer right */}
      <ellipse
        cx="50"
        cy="52"
        rx="5"
        ry="18"
        transform="rotate(60 50 65)"
        opacity="0.45"
      />
      {/* Base arc */}
      <path
        d="M 30 72 Q 50 78 70 72 Q 50 82 30 72"
        opacity="0.5"
      />
    </svg>
  );
}
