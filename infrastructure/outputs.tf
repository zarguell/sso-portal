output "frontend_bucket_name" {
  description = "The name of the S3 bucket for the frontend assets"
  value       = aws_s3_bucket.frontend_bucket.id
}

output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution.id
}

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "api_gateway_endpoint" {
  description = "The invoke URL for the API Gateway"
  value       = aws_apigatewayv2_api.http_api.api_endpoint
}
