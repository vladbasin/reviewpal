variable "env_name" {
  type = string
}

variable "region" {
  type = string
}

variable "codestar_connection_arn" {
  type = string
}

variable "codebuild_service_role_arn" {
  type = string
}

variable "codepipeline_service_role_arn" {
  type = string
}

variable "backend_ecs_cluster_name" {
  type = string
}

variable "backend_ecs_service_name" {
  type = string
}

variable "backend_ecr_repo_url" {
  type = string
}

variable "web_bucket_name" {
  type = string
}

variable "source_repository_id" {
  type = string
}

variable "backend_api_host" {
  type = string
}

variable "cloudfront_web_distribution_id" {
  type = string
}
