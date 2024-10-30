provider "aws" {
  region = var.region
}

terraform {
  backend "s3" {}
}

module "ssm" {
  source   = "../common/modules/ssm"
  env_name = var.env_name
  ssm_parameter_names = [
    "CODESTAR_CONNECTION_ARN",
    "CDN_URL",
    "BACKEND_ECS_SERVICE_NAME",
    "BACKEND_ECS_CLUSTER_NAME",
    "BACKEND_ECS_CLUSTER_ARN",
    "BACKEND_ECR_REPO_URL",
    "WEB_BUCKET_NAME",
    "SOURCE_REPOSITORY_ID",
    "CLOUDFRONT_WEB_DISTRIBUTION_ID",
    "BACKEND_ECS_TASK_EXECUTION_ROLE_ARN",
    "BACKEND_ECS_TASK_ROLE_ARN"
  ]
}

module "iam" {
  source                              = "./modules/iam"
  env_name                            = var.env_name
  region                              = var.region
  pipeline_bucket_name                = module.codesuite.pipeline_bucket_name
  codestar_connection_arn             = module.ssm.parameters.CODESTAR_CONNECTION_ARN
  backend_ecs_cluster_arn             = module.ssm.parameters.BACKEND_ECS_CLUSTER_ARN
  web_bucket_name                     = module.ssm.parameters.WEB_BUCKET_NAME
  cloudfront_web_distribution_id      = module.ssm.parameters.CLOUDFRONT_WEB_DISTRIBUTION_ID
  backend_ecs_task_execution_role_arn = module.ssm.parameters.BACKEND_ECS_TASK_EXECUTION_ROLE_ARN
  backend_ecs_task_role_arn           = module.ssm.parameters.BACKEND_ECS_TASK_ROLE_ARN
}


module "codesuite" {
  source                         = "./modules/codesuite"
  env_name                       = var.env_name
  region                         = var.region
  codebuild_service_role_arn     = module.iam.codebuild_service_role_arn
  codepipeline_service_role_arn  = module.iam.codepipeline_service_role_arn
  codestar_connection_arn        = module.ssm.parameters.CODESTAR_CONNECTION_ARN
  source_repository_id           = module.ssm.parameters.SOURCE_REPOSITORY_ID
  backend_api_host               = module.ssm.parameters.CDN_URL
  backend_ecs_service_name       = module.ssm.parameters.BACKEND_ECS_SERVICE_NAME
  backend_ecs_cluster_name       = module.ssm.parameters.BACKEND_ECS_CLUSTER_NAME
  web_bucket_name                = module.ssm.parameters.WEB_BUCKET_NAME
  backend_ecr_repo_url           = module.ssm.parameters.BACKEND_ECR_REPO_URL
  cloudfront_web_distribution_id = module.ssm.parameters.CLOUDFRONT_WEB_DISTRIBUTION_ID
}
