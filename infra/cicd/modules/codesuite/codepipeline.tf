resource "aws_s3_bucket" "pipeline_bucket" {
  bucket = "reviewpal-${var.env_name}-pipeline-bucket"

  tags = {
    Name = "reviewpal-${var.env_name}-pipeline-bucket"
  }
}

resource "aws_s3_bucket_public_access_block" "pipeline_bucket" {
  bucket = aws_s3_bucket.pipeline_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_codepipeline" "main_pipeline" {
  name     = "reviewpal-${var.env_name}-pipeline"
  role_arn = var.codepipeline_service_role_arn

  artifact_store {
    type     = "S3"
    location = aws_s3_bucket.pipeline_bucket.id
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "AWS"
      provider         = "CodeStarSourceConnection"
      version          = "1"
      output_artifacts = ["SourceArtifact"]

      configuration = {
        ConnectionArn    = var.codestar_connection_arn
        FullRepositoryId = var.source_repository_id
        BranchName       = "main"
      }
    }
  }

  stage {
    name = "ApproveSource"

    action {
      name     = "ApproveSource"
      category = "Approval"
      owner    = "AWS"
      provider = "Manual"
      version  = "1"

      configuration = {
        CustomData = "Please approve the source to start building"
      }
    }
  }

  stage {
    name = "Build"

    action {
      name             = "Build"
      category         = "Build"
      owner            = "AWS"
      provider         = "CodeBuild"
      input_artifacts  = ["SourceArtifact"]
      output_artifacts = ["BackendBuildArtifact", "WebBuildArtifact"]
      version          = "1"

      configuration = {
        ProjectName = aws_codebuild_project.build.name
      }
    }
  }

  stage {
    name = "Approve"

    action {
      name     = "ApproveDeploy"
      category = "Approval"
      owner    = "AWS"
      provider = "Manual"
      version  = "1"

      configuration = {
        CustomData = "Please review and approve the deployment"
      }
    }
  }

  stage {
    name = "Deploy"

    action {
      name            = "DeployBackend"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "ECS"
      input_artifacts = ["BackendBuildArtifact"]
      version         = "1"

      configuration = {
        ClusterName = var.backend_ecs_cluster_name
        ServiceName = var.backend_ecs_service_name
        FileName    = "imagedefinitions.json"
      }
    }

    action {
      name            = "DeployWeb"
      category        = "Deploy"
      owner           = "AWS"
      provider        = "S3"
      input_artifacts = ["WebBuildArtifact"]
      version         = "1"
      run_order       = 1

      configuration = {
        BucketName = var.web_bucket_name
        Extract    = "true"
      }
    }

    action {
      name            = "InvalidateCache"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      input_artifacts = ["SourceArtifact"]
      version         = "1"
      run_order       = 2

      configuration = {
        ProjectName = aws_codebuild_project.cloudfront_invalidation.name
      }
    }

    action {
      name            = "SaveBackendImage"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      input_artifacts = ["BackendBuildArtifact"]
      version         = "1"
      run_order       = 2

      configuration = {
        ProjectName = aws_codebuild_project.save_backend_image.name
      }
    }
  }

  tags = {
    Name = "reviewpal-${var.env_name}-pipeline"
  }
}


