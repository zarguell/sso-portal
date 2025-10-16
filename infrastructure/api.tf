# IAM Roles and Policies
resource "aws_iam_role" "lambda_exec_role" {
  name = "${var.project_name}-lambda-exec-role-${var.environment}"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Effect    = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
  tags = local.tags
}

resource "aws_iam_policy" "lambda_dynamodb_policy" {
  name        = "${var.project_name}-lambda-dynamodb-policy-${var.environment}"
  description = "Policy for Lambda to access DynamoDB tables"
  policy = jsonencode({
    Version   = "2012-10-17",
    Statement = [
      {
        Action = [
          "dynamodb:Query",
          "dynamodb:GetItem",
          "dynamodb:BatchWriteItem",
          "dynamodb:PutItem"
        ],
        Effect   = "Allow",
        Resource = [
          aws_dynamodb_table.app_catalog.arn,
          aws_dynamodb_table.user_entitlements.arn
        ]
      },
      {
        Action   = "logs:CreateLogGroup",
        Effect   = "Allow",
        Resource = "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:*"
      },
      {
        Action   = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect   = "Allow",
        Resource = "arn:aws:logs:${var.aws_region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_attachment" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb_policy.arn
}

data "aws_caller_identity" "current" {}

# API Gateway
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.project_name}-api-${var.environment}"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"] # In production, restrict this to the frontend domain
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
  }
  tags = local.tags
}

# Lambda Functions
module "get_apps_lambda" {
  source = "./modules/lambda"
  function_name = "${var.project_name}-get-apps-${var.environment}"
  handler = "index.handler"
  runtime = "nodejs20.x"
  zip_path = "../backend/get-apps.zip"
  role_arn = aws_iam_role.lambda_exec_role.arn
  environment_variables = {
    APP_CATALOG_TABLE = aws_dynamodb_table.app_catalog.name
    USER_ENTITLEMENTS_TABLE = aws_dynamodb_table.user_entitlements.name
  }
  tags = local.tags
}

# ... more lambda modules for authorizer, sso-initiate, sync-entitlements

# API Gateway Integrations and Routes
# ... to be added after lambda modules are defined
