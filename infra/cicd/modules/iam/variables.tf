variable "env_name" {
  type = string
}

variable "region" {
  type = string
}

variable "pipeline_bucket_name" {
  type = string
}

variable "codestar_connection_arn" {
  type = string
}

variable "backend_ecs_cluster_arn" {
  type = string
}

variable "web_bucket_name" {
  type = string
}

variable "cloudfront_web_distribution_id" {
  type = string
}

variable "backend_ecs_task_execution_role_arn" {
  type = string
}

variable "backend_ecs_task_role_arn" {
  type = string
}

