# SRF Teachings Portal — Terraform Root Module (M1c-1)
#
# Formalizes existing Neon project and creates Sentry + Vercel projects.
# State stored in S3 + DynamoDB (created by scripts/bootstrap.sh).
#
# Usage:
#   terraform init
#   terraform plan
#   terraform apply
#
# Governing refs: ADR-016, ADR-020, DES-039

terraform {
  required_version = ">= 1.7"

  required_providers {
    neon = {
      source  = "kislerdm/neon"
      version = "~> 0.6"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
    sentry = {
      source  = "jianyuan/sentry"
      version = "~> 0.14"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "srf-portal-tf-state"
    key            = "terraform.tfstate"
    region         = "us-west-2"
    dynamodb_table = "srf-portal-tf-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

provider "neon" {
  api_key = var.neon_api_key
}

provider "vercel" {
  api_token = var.vercel_token
  team      = var.vercel_team_id
}

provider "sentry" {
  token = var.sentry_token
}
