output "access_token_key_id" {
  value = aws_kms_key.access_token_kms_key.id
}

output "access_token_key_arn" {
  value = aws_kms_key.access_token_kms_key.arn
}
