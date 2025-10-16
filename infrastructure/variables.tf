variable "project_name" {
  description = "The name of the project"
  type        = string
  default     = "sso-portal"
}

variable "environment" {
  description = "The deployment environment"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "us-east-1"
}

variable "custom_domain" {
  description = "The custom domain for the frontend"
  type        = string
  default     = ""
}

variable "api_custom_domain" {
  description = "The custom domain for the API"
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "The ARN of the ACM certificate for the custom domains"
  type        = string
  default     = ""
}

variable "entra_tenant_id" {
  description = "The Entra External ID tenant ID"
  type        = string
}

variable "entra_issuer" {
  description = "The Entra External ID issuer URL"
  type        = string
}
