data "aws_caller_identity" "current" {}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "reviewpal-${var.env_name}-ecs-task-execution-role"

  assume_role_policy = file("${path.module}/policies/ecs_tasks_assume_role_policy.json")

  tags = {
    Name = "reviewpal-${var.env_name}-ecs-task-execution-role"
  }
}

resource "aws_iam_policy_attachment" "ecs_task_execution_policy" {
  name       = "reviewpal-${var.env_name}-ecs-task-execution-policy-attachment"
  roles      = [aws_iam_role.ecs_task_execution_role.name]
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task_role" {
  name = "reviewpal-${var.env_name}-ecs-task-role"

  assume_role_policy = file("${path.module}/policies/ecs_tasks_assume_role_policy.json")

  tags = {
    Name = "reviewpal-${var.env_name}-ecs-task-role"
  }
}

resource "aws_iam_policy" "kms_policy" {
  name = "reviewpal-${var.env_name}-kms-policy"
  policy = templatefile("${path.module}/policies/kms_policy.json", {
    kms_access_token_key_arn = var.kms_access_token_key_arn
  })
}

resource "aws_iam_role_policy_attachment" "kms_policy_attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.kms_policy.arn
}

resource "aws_iam_policy" "secrets_policy" {
  name = "reviewpal-${var.env_name}-secrets-policy"
  policy = templatefile("${path.module}/policies/secretsmanager_policy.json", {
    secrets_manager_crypter_encryption_key_arn = var.secrets_manager_crypter_encryption_key_arn
    secrets_manager_db_url_key_arn             = var.secrets_manager_db_url_key_arn
  })
}

resource "aws_iam_role_policy_attachment" "secrets_policy_attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.secrets_policy.arn
}

resource "aws_iam_policy" "ssm_policy" {
  name = "reviewpal-${var.env_name}-ssm-policy"
  policy = templatefile("${path.module}/policies/ssm_policy.json", {
    region     = var.region
    account_id = data.aws_caller_identity.current.account_id
    env_name   = var.env_name
  })
}

resource "aws_iam_role_policy_attachment" "ssm_policy_attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.ssm_policy.arn
}

resource "aws_iam_policy" "ecr_policy" {
  name = "reviewpal-${var.env_name}-ecr-policy"
  policy = templatefile("${path.module}/policies/ecr_policy.json", {
    region     = var.region
    account_id = data.aws_caller_identity.current.account_id
    env_name   = var.env_name
  })
}

resource "aws_iam_role_policy_attachment" "ecr_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.ecr_policy.arn
}

resource "aws_iam_policy" "cloudwatch_policy" {
  name = "reviewpal-${var.env_name}-cloudwatch-policy"
  policy = templatefile("${path.module}/policies/cloudwatch_policy.json", {
    region     = var.region
    account_id = data.aws_caller_identity.current.account_id
    env_name   = var.env_name
  })
}

resource "aws_iam_role_policy_attachment" "cloudwatch_policy_attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = aws_iam_policy.cloudwatch_policy.arn
}

resource "aws_iam_policy" "bedrock_policy" {
  name   = "reviewpal-${var.env_name}-bedrock-policy"
  policy = file("${path.module}/policies/bedrock_policy.json")
}

resource "aws_iam_role_policy_attachment" "bedrock_policy_attachment" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = aws_iam_policy.bedrock_policy.arn
}

resource "aws_ssm_parameter" "backend_ecs_task_execution_role_arn" {
  name  = "/reviewpal/${var.env_name}/BACKEND_ECS_TASK_EXECUTION_ROLE_ARN"
  type  = "String"
  value = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_ssm_parameter" "backend_ecs_task_role_arn" {
  name  = "/reviewpal/${var.env_name}/BACKEND_ECS_TASK_ROLE_ARN"
  type  = "String"
  value = aws_iam_role.ecs_task_role.arn
}
