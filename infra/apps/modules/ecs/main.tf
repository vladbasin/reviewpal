resource "aws_ecs_cluster" "backend_cluster" {
  name = "reviewpal-${var.env_name}-backend-cluster"
}

resource "aws_ecs_service" "backend_service" {
  name          = "reviewpal-${var.env_name}-backend-service"
  cluster       = aws_ecs_cluster.backend_cluster.id
  launch_type   = "FARGATE"
  desired_count = var.desired_service_count

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.security_group_id]
    assign_public_ip = false
  }

  deployment_controller {
    type = "ECS"
  }

  task_definition = aws_ecs_task_definition.backend_task.arn

  load_balancer {
    target_group_arn = var.lb_target_group_arn
    container_name   = var.backend_container_name
    container_port   = 3000
  }

  tags = {
    Name = "reviewpal-${var.env_name}-backend-service"
  }
}

data "aws_ssm_parameter" "backend_container_image" {
  name = "/reviewpal/${var.env_name}/BACKEND_CONTAINER_IMAGE"
}

resource "aws_ecs_task_definition" "backend_task" {
  family                   = "reviewpal-${var.env_name}-backend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  execution_role_arn = var.task_execution_role_arn
  task_role_arn      = var.task_role_arn

  container_definitions = jsonencode([
    {
      name      = var.backend_container_name
      image     = data.aws_ssm_parameter.backend_container_image.value
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "API_HOST"
          value = "0.0.0.0"
        },
        {
          name  = "API_PORT"
          value = "3000"
        },
        {
          name  = "DATABASE_URL_SECRETS_MANAGER_KEY_ID"
          value = var.db_url_secrets_manager_key_arn
        },
        {
          name  = "DATABASE_PUBLIC_CERT"
          value = var.rds_public_cert
        },
        {
          name  = "CRYPTER_KEY_AWS_SECRET_MANAGER_KEY_ID"
          value = var.crypter_encryption_key_id
        },
        {
          name  = "ADMIN_INITIAL_EMAIL"
          value = var.app_admin_initial_email
        },
        {
          name  = "ADMIN_INITIAL_PASSWORD"
          value = var.app_admin_initial_password
        },
        {
          name  = "ADMIN_INITIAL_NAME"
          value = var.app_admin_initial_name
        },
        {
          name  = "LOG_LEVEL"
          value = var.log_level
        },
        {
          name  = "ACCESS_TOKEN_AWS_KMS_KEY_ID"
          value = var.kms_access_token_key_id
        },
        {
          name  = "ACCESS_TOKEN_EXPIRATION_SECONDS"
          value = var.app_access_token_expiration_seconds
        },
        {
          name  = "REFRESH_TOKEN_EXPIRATION_SECONDS"
          value = var.app_refresh_token_expiration_seconds
        },
        {
          name  = "RESET_PASSWORD_TOKEN_EXPIRATION_SECONDS"
          value = var.app_reset_password_token_expiration_seconds
        },
        {
          name  = "USE_SECURE_COOKIES"
          value = var.app_use_secure_cookies
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/reviewpal-${var.env_name}-backend"
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Name = "reviewpal-${var.env_name}-backend-task"
  }
}

resource "aws_cloudwatch_log_group" "backend_logs" {
  name              = "/ecs/reviewpal-${var.env_name}-backend"
  retention_in_days = 7
}

resource "aws_ssm_parameter" "backend_ecs_cluster_arn" {
  name  = "/reviewpal/${var.env_name}/BACKEND_ECS_CLUSTER_ARN"
  type  = "String"
  value = aws_ecs_cluster.backend_cluster.arn
}

resource "aws_ssm_parameter" "backend_ecs_service_name" {
  name  = "/reviewpal/${var.env_name}/BACKEND_ECS_SERVICE_NAME"
  type  = "String"
  value = aws_ecs_service.backend_service.name
}

resource "aws_ssm_parameter" "backend_ecs_cluster_name" {
  name  = "/reviewpal/${var.env_name}/BACKEND_ECS_CLUSTER_NAME"
  type  = "String"
  value = aws_ecs_cluster.backend_cluster.name
}
