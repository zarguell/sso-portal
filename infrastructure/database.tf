resource "aws_dynamodb_table" "app_catalog" {
  name         = "${var.project_name}-app-catalog-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"

  attribute {
    name = "PK"
    type = "S"
  }

  tags = local.tags
}

resource "aws_dynamodb_table" "user_entitlements" {
  name         = "${var.project_name}-user-entitlements-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  # Enable TTL on the 'expiresAt' attribute for automatic cleanup
  ttl {
    attribute_name = "expiresAt"
    enabled        = true
  }

  tags = local.tags
}
