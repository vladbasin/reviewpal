locals {
  ssm_parameter_names = {
    for name in var.ssm_parameter_names : name => "/reviewpal/${var.env_name}/${name}"
  }
}

data "aws_ssm_parameter" "ssm_parameters_data" {
  for_each = local.ssm_parameter_names
  name     = each.value
}
