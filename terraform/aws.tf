# AWS Resources — M1c-1 (ADR-016, ADR-125, ADR-126)
#
# Core AWS resources formalized in Terraform.
# Bootstrap resources (S3, DynamoDB, OIDC, IAM) created by scripts/bootstrap.sh.
# This module references them as data sources.

# Reference existing S3 bucket (created by bootstrap.sh)
data "aws_s3_bucket" "tf_state" {
  bucket = "srf-portal-tf-state"
}

# Reference existing DynamoDB table (created by bootstrap.sh)
data "aws_dynamodb_table" "tf_locks" {
  name = "srf-portal-tf-locks"
}

# Reference existing CI IAM role (created by bootstrap.sh)
data "aws_iam_role" "ci" {
  name = "portal-ci"
}

# Budget alarm for cost monitoring
resource "aws_budgets_budget" "monthly" {
  name         = "srf-portal-monthly"
  budget_type  = "COST"
  limit_amount = "100"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [] # Configure via AWS console
  }
}
