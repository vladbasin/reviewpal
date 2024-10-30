variable "env_name" {
  type = string
}

variable "region" {
  type = string
}

variable "log_level" {
  type = string
}

variable "vpc_az_count" {
  type = number
}

variable "db_name" {
  type    = string
  default = "reviewpal"
}

variable "db_user" {
  type    = string
  default = "reviewpal"
}

variable "db_instance_class" {
  type = string
}

variable "desired_service_count" {
  type = number
}

variable "backend_container_name" {
  type    = string
  default = "backend-container"
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
  type = bool
}
