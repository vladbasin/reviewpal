resource "random_id" "crypter_encryption_key" {
  byte_length = 32
}

resource "aws_secretsmanager_secret" "crypter_encryption_key" {
  name = "reviewpal-${var.env_name}-crypter-encrypt-key"
}

resource "aws_secretsmanager_secret_version" "crypter_encryption_key_version" {
  secret_id     = aws_secretsmanager_secret.crypter_encryption_key.id
  secret_string = random_id.crypter_encryption_key.hex
}

resource "random_password" "db_password" {
  length  = 16
  special = true
}

resource "aws_secretsmanager_secret" "db_password" {
  name = "reviewpal-${var.env_name}-database-password"
}

resource "aws_secretsmanager_secret_version" "db_password_version" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = random_password.db_password.result
}
