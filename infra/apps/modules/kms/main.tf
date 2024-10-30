resource "aws_kms_key" "access_token_kms_key" {
  key_usage                = "SIGN_VERIFY"
  customer_master_key_spec = "RSA_2048"
}

resource "aws_kms_alias" "access_token_kms_alias" {
  name          = "alias/reviewpal-${var.env_name}-access-token-kms-key"
  target_key_id = aws_kms_key.access_token_kms_key.id
}
