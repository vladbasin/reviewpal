variable "env_name" {
  type = string
}

variable "region" {
  type = string
}

variable "kms_access_token_key_arn" {
  type = string
}

variable "secrets_manager_db_url_key_arn" {
  type = string
}

variable "secrets_manager_crypter_encryption_key_arn" {
  type = string
}
