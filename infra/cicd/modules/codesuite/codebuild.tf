resource "aws_codebuild_project" "build" {
  name         = "reviewpal-${var.env_name}-build"
  service_role = var.codebuild_service_role_arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:5.0"
    type                        = "LINUX_CONTAINER"
    privileged_mode             = true
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "ENV_NAME"
      value = var.env_name
    }

    environment_variable {
      name  = "AWS_REGION"
      value = var.region
    }

    environment_variable {
      name  = "BACKEND_ECR_REPO_URL"
      value = var.backend_ecr_repo_url
    }

    environment_variable {
      name  = "NX_PUBLIC_API_HOST"
      value = "https://${var.backend_api_host}"
    }

    environment_variable {
      name  = "NX_PUBLIC_DEFAULT_PAGE_SIZE"
      value = "50"
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = "buildspec.yml"
  }

  cache {
    type  = "LOCAL"
    modes = ["LOCAL_SOURCE_CACHE", "LOCAL_DOCKER_LAYER_CACHE"]
  }

  tags = {
    Name = "reviewpal-${var.env_name}-build"
  }
}

resource "aws_codebuild_project" "cloudfront_invalidation" {
  name          = "reviewpal-${var.env_name}-cloudfront-invalidation"
  build_timeout = "5"
  service_role  = var.codebuild_service_role_arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:5.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = <<-EOT
      version: 0.2
      phases:
        build:
          commands:
            - aws cloudfront create-invalidation --distribution-id ${var.cloudfront_web_distribution_id} --paths "/*"
    EOT
  }
}

resource "aws_codebuild_project" "save_backend_image" {
  name          = "reviewpal-${var.env_name}-save-backend-image"
  build_timeout = "5"
  service_role  = var.codebuild_service_role_arn

  artifacts {
    type = "CODEPIPELINE"
  }

  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/amazonlinux2-x86_64-standard:5.0"
    type                        = "LINUX_CONTAINER"
    image_pull_credentials_type = "CODEBUILD"

    environment_variable {
      name  = "ENV_NAME"
      value = var.env_name
    }
  }

  source {
    type      = "CODEPIPELINE"
    buildspec = <<-EOT
      version: 0.2
      phases:
        build:
          commands:
            - IMAGE=$(cat imagedefinitions.json | jq -r '.[0].imageUri')
            - aws ssm put-parameter --name "/reviewpal/$ENV_NAME/BACKEND_CONTAINER_IMAGE" --value "$IMAGE" --type String --overwrite
    EOT
  }

  tags = {
    Name = "reviewpal-${var.env_name}-save-backend-image"
  }
}
