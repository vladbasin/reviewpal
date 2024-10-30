output "parameters" {
  value = { for k, v in local.ssm_parameter_names : k => data.aws_ssm_parameter.ssm_parameters_data[k].value }
}
