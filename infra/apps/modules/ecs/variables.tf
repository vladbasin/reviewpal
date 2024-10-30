variable "env_name" {
  type = string
}

variable "task_role_arn" {
  type = string
}

variable "task_execution_role_arn" {
  type = string
}

variable "region" {
  type = string
}

variable "desired_service_count" {
  type = number
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "lb_target_group_arn" {
  type = string
}

variable "backend_container_name" {
  type = string
}

variable "log_level" {
  type = string
}

variable "db_url_secrets_manager_key_arn" {
  type = string
}

variable "rds_public_cert" {
  type = string
}

variable "kms_access_token_key_id" {
  type = string
}

variable "app_admin_initial_email" {
  type = string
}

variable "app_admin_initial_password" {
  type = string
}

variable "app_admin_initial_name" {
  type = string
}

variable "app_access_token_expiration_seconds" {
  type = string
}

variable "app_refresh_token_expiration_seconds" {
  type = string
}

variable "app_reset_password_token_expiration_seconds" {
  type = string
}

variable "app_use_secure_cookies" {
  type = string
}

variable "crypter_encryption_key_id" {
  type = string
}
