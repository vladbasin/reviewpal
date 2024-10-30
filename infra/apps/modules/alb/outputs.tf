output "backend_alb_dns_name" {
  value = aws_lb.backend_alb.dns_name
}

output "backend_sg_id" {
  value = aws_security_group.backend_sg.id
}

output "backend_tg_arn" {
  value = aws_lb_target_group.backend_tg.arn
}
