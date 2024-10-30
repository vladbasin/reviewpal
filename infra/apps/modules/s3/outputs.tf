output "web_bucket_website_endpoint" {
  value = aws_s3_bucket_website_configuration.web_bucket.website_endpoint
}

output "web_bucket_id" {
  value = aws_s3_bucket.web_bucket.id
}
