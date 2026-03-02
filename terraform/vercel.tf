# Vercel Project — M1c-1, M1c-2

resource "vercel_project" "portal" {
  name      = "srf-teachings-portal"
  framework = "nextjs"

  git_repository = {
    type              = "github"
    repo              = var.github_repository
    production_branch = "main"
  }

  serverless_function_region = "iad1" # US East (Virginia)

  environment = [
    {
      key    = "NEON_DATABASE_URL"
      value  = "" # Set via Vercel UI or CLI — not in state
      target = ["production", "preview"]
    },
  ]
}

output "vercel_project_id" {
  description = "Vercel project ID"
  value       = vercel_project.portal.id
}
