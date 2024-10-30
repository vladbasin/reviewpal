resource "aws_ecr_repository" "backend_repo" {
  name                 = "reviewpal-${var.env_name}-be"
  image_tag_mutability = "MUTABLE"

  tags = {
    Name = "reviewpal-${var.env_name}-be"
  }
}

resource "aws_ssm_parameter" "backend_repo_url" {
  name  = "/reviewpal/${var.env_name}/BACKEND_ECR_REPO_URL"
  type  = "String"
  value = aws_ecr_repository.backend_repo.repository_url
}
