output "cdn_url" {
  value = module.cloudfront.cdn_url
}

output "rds_endpoint" {
  value = module.rds.db_endpoint
}

output "alb_dns_name" {
  value = module.alb.backend_alb_dns_name
}
