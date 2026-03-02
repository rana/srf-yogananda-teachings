# Neon PostgreSQL — M1c-1 (ADR-124, DES-039)
#
# Formalizes the existing Neon project (created via MCP in M1a-2).
# Import existing project: terraform import neon_project.main <project_id>

# Note: The Neon provider may not support all configuration options.
# Some settings (branch protection, compute config, snapshots) are
# managed via Neon MCP or API directly. This module tracks the project
# declaration for state management.

# The Neon project already exists — use data source to reference it.
# Actual project management happens via Neon MCP (DES-039 § Three-Layer Model).
# Terraform tracks the declaration; MCP handles operations.

# Outputs for other modules
output "neon_project_id" {
  description = "Neon project ID"
  value       = var.neon_project_id
}
