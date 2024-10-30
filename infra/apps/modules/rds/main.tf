resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "reviewpal-${var.env_name}-rds-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name = "reviewpal-${var.env_name}-rds-subnet-group"
  }
}

locals {
  rds_ca_cert_identifier = "rds-ca-rsa2048-g1"
}

resource "aws_db_instance" "db_instance" {
  identifier             = "reviewpal-${var.env_name}-postgresql"
  allocated_storage      = 20
  engine                 = "postgres"
  instance_class         = var.db_instance_class
  db_name                = var.db_name
  username               = var.db_user
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot    = true
  publicly_accessible    = false
  ca_cert_identifier     = local.rds_ca_cert_identifier

  tags = {
    Name = "reviewpal-${var.env_name}-postgresql"
  }
}

resource "aws_security_group" "rds_sg" {
  name   = "reviewpal-${var.env_name}-rds-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [var.backend_sg_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "reviewpal-${var.env_name}-rds-sg"
  }
}

resource "aws_secretsmanager_secret" "db_url" {
  name = "reviewpal-${var.env_name}-database-url"
}

resource "aws_secretsmanager_secret_version" "db_url_version" {
  secret_id     = aws_secretsmanager_secret.db_url.id
  secret_string = "postgres://${var.db_user}:${urlencode(var.db_password)}@${aws_db_instance.db_instance.endpoint}/${aws_db_instance.db_instance.db_name}"
}

data "http" "rds_cert" {
  url = "https://truststore.pki.rds.amazonaws.com/${var.region}/${var.region}-bundle.pem"
}
