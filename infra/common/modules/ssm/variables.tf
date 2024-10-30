variable "env_name" {
  type = string
}

variable "ssm_parameter_names" {
  type    = list(string)
  default = []
}
