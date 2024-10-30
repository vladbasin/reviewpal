provider "aws" {
  region = var.region
}

provider "http" {}

terraform {
  backend "s3" {}
}

module "kms" {
  source   = "./modules/kms"
  env_name = var.env_name
}

module "secrets" {
  source   = "./modules/secrets"
  env_name = var.env_name
}

module "vpc" {
  source   = "./modules/vpc"
  env_name = var.env_name
  az_count = var.vpc_az_count
}

module "ecr" {
  source   = "./modules/ecr"
  env_name = var.env_name
}

module "rds" {
  source             = "./modules/rds"
  env_name           = var.env_name
  region             = var.region
  db_instance_class  = var.db_instance_class
  db_name            = var.db_name
  db_user            = var.db_user
  db_password        = module.secrets.db_password
  private_subnet_ids = module.vpc.private_subnets_ids
  vpc_id             = module.vpc.id
  backend_sg_id      = module.alb.backend_sg_id
}

module "alb" {
  source            = "./modules/alb"
  env_name          = var.env_name
  public_subnet_ids = module.vpc.public_subnets_ids
  vpc_id            = module.vpc.id
}

module "ecs" {
  source                                      = "./modules/ecs"
  env_name                                    = var.env_name
  region                                      = var.region
  desired_service_count                       = var.desired_service_count
  backend_container_name                      = var.backend_container_name
  private_subnet_ids                          = module.vpc.private_subnets_ids
  security_group_id                           = module.alb.backend_sg_id
  lb_target_group_arn                         = module.alb.backend_tg_arn
  task_role_arn                               = module.iam.ecs_task_role_arn
  task_execution_role_arn                     = module.iam.ecs_task_execution_role_arn
  log_level                                   = var.log_level
  db_url_secrets_manager_key_arn              = module.rds.db_url_secrets_manager_key_arn
  rds_public_cert                             = module.rds.rds_public_cert
  kms_access_token_key_id                     = module.kms.access_token_key_id
  crypter_encryption_key_id                   = module.secrets.crypter_encryption_key_id
  app_access_token_expiration_seconds         = var.app_access_token_expiration_seconds
  app_refresh_token_expiration_seconds        = var.app_refresh_token_expiration_seconds
  app_reset_password_token_expiration_seconds = var.app_reset_password_token_expiration_seconds
  app_use_secure_cookies                      = var.app_use_secure_cookies
  app_admin_initial_email                     = var.app_admin_initial_email
  app_admin_initial_password                  = var.app_admin_initial_password
  app_admin_initial_name                      = var.app_admin_initial_name
}

module "iam" {
  source                                     = "./modules/iam"
  env_name                                   = var.env_name
  region                                     = var.region
  kms_access_token_key_arn                   = module.kms.access_token_key_arn
  secrets_manager_crypter_encryption_key_arn = module.secrets.crypter_encryption_key_arn
  secrets_manager_db_url_key_arn             = module.rds.db_url_secrets_manager_key_arn
}

module "s3" {
  source   = "./modules/s3"
  env_name = var.env_name
}

module "cloudfront" {
  source                      = "./modules/cloudfront"
  env_name                    = var.env_name
  web_bucket_website_endpoint = module.s3.web_bucket_website_endpoint
  web_bucket_id               = module.s3.web_bucket_id
  backend_alb_dns_name        = module.alb.backend_alb_dns_name

  depends_on = [
    module.s3.web_bucket,
    module.alb.backend_alb
  ]
}
