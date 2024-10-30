output "db_endpoint" {
  value = aws_db_instance.db_instance.endpoint
}

output "db_url_secrets_manager_key_arn" {
  value = aws_secretsmanager_secret.db_url.arn
}

output "rds_public_cert" {
  value = base64encode(data.http.rds_cert.response_body)
}
