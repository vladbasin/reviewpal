output "crypter_encryption_key_arn" {
  value = aws_secretsmanager_secret.crypter_encryption_key.arn
}

output "crypter_encryption_key_id" {
  value = aws_secretsmanager_secret.crypter_encryption_key.id
}

output "db_password_key_id" {
  value = aws_secretsmanager_secret.db_password.id
}

output "db_password" {
  value     = random_password.db_password.result
  sensitive = true
}
