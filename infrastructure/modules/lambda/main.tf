variable "function_name" { type = string }
variable "handler" { type = string }
variable "runtime" { type = string }
variable "zip_path" { type = string }
variable "role_arn" { type = string }
variable "environment_variables" { type = map(string) }
variable "tags" { type = map(string) }

resource "aws_lambda_function" "this" {
  function_name = var.function_name
  handler       = var.handler
  runtime       = var.runtime
  role          = var.role_arn

  filename         = var.zip_path
  source_code_hash = filebase64sha256(var.zip_path)

  environment {
    variables = var.environment_variables
  }

  tags = var.tags
}
