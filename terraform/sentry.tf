# Sentry Error Tracking — M1c-1, M1c-2 (ADR-095)

resource "sentry_project" "portal" {
  organization = var.sentry_organization
  teams        = [] # Will be configured via Sentry UI
  name         = "srf-teachings-portal"
  slug         = "srf-teachings-portal"
  platform     = "javascript-nextjs"
}

output "sentry_project_slug" {
  description = "Sentry project slug"
  value       = sentry_project.portal.slug
}
