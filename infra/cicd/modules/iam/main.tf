data "aws_caller_identity" "current" {}

resource "aws_iam_role" "codebuild_service_role" {
  name = "reviewpal-${var.env_name}-codebuild-service-role"

  assume_role_policy = file("${path.module}/policies/codebuild_assume_role_policy.json")

  tags = {
    Name = "reviewpal-${var.env_name}-codebuild-service-role"
  }
}

resource "aws_iam_role_policy" "codebuild_policy" {
  name = "reviewpal-${var.env_name}-codebuild-policy"
  role = aws_iam_role.codebuild_service_role.id
  policy = templatefile("${path.module}/policies/codebuild_policy.json", {
    pipeline_bucket_name                = var.pipeline_bucket_name
    region                              = var.region
    env_name                            = var.env_name
    cloudfront_web_distribution_id      = var.cloudfront_web_distribution_id
    account_id                          = data.aws_caller_identity.current.account_id
    backend_ecs_task_execution_role_arn = var.backend_ecs_task_execution_role_arn
    backend_ecs_task_role_arn           = var.backend_ecs_task_role_arn
  })
}

resource "aws_iam_role" "codepipeline_service_role" {
  name = "reviewpal-${var.env_name}-codepipeline-service-role"

  assume_role_policy = file("${path.module}/policies/codepipeline_assume_role_policy.json")

  tags = {
    Name = "reviewpal-${var.env_name}-codepipeline-service-role"
  }
}

resource "aws_iam_role_policy" "codepipeline_policy" {
  name = "reviewpal-${var.env_name}-codepipeline-policy"
  role = aws_iam_role.codepipeline_service_role.id

  policy = templatefile("${path.module}/policies/codepipeline_policy.json", {
    pipeline_bucket_name                = var.pipeline_bucket_name
    region                              = var.region
    env_name                            = var.env_name
    account_id                          = data.aws_caller_identity.current.account_id
    codestar_connection_arn             = var.codestar_connection_arn
    backend_ecs_cluster_arn             = var.backend_ecs_cluster_arn
    web_bucket_name                     = var.web_bucket_name
    cloudfront_web_distribution_id      = var.cloudfront_web_distribution_id
    backend_ecs_task_execution_role_arn = var.backend_ecs_task_execution_role_arn
    backend_ecs_task_role_arn           = var.backend_ecs_task_role_arn
  })
}
