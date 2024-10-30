resource "aws_cloudfront_distribution" "cdn" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CDN for ReviewPal"
  default_root_object = "index.html"

  origin {
    domain_name = var.web_bucket_website_endpoint
    origin_id   = "reviewpal-web-bucket"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  origin {
    domain_name = var.backend_alb_dns_name
    origin_id   = "reviewpal-backend-alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]
    target_origin_id       = "reviewpal-web-bucket"
    viewer_protocol_policy = "redirect-to-https"

    cache_policy_id          = aws_cloudfront_cache_policy.web.id
    origin_request_policy_id = aws_cloudfront_origin_request_policy.web.id
  }

  ordered_cache_behavior {
    path_pattern           = "/api/*"
    target_origin_id       = "reviewpal-backend-alb"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD", "OPTIONS"]

    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled policy
    origin_request_policy_id = "216adef6-5c7f-47e4-b989-5492eafa07d3" # AllViewer policy

    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name = "reviewpal-${var.env_name}-frontend-cdn"
  }
}

resource "aws_ssm_parameter" "cdn_url" {
  name  = "/reviewpal/${var.env_name}/CDN_URL"
  type  = "String"
  value = aws_cloudfront_distribution.cdn.domain_name
}

resource "aws_ssm_parameter" "cloudfront_web_distribution_id" {
  name  = "/reviewpal/${var.env_name}/CLOUDFRONT_WEB_DISTRIBUTION_ID"
  type  = "String"
  value = aws_cloudfront_distribution.cdn.id
}

resource "aws_cloudfront_origin_request_policy" "web" {
  name = "reviewpal-${var.env_name}-web-origin-request-policy"

  cookies_config {
    cookie_behavior = "all"
  }

  headers_config {
    header_behavior = "none"
  }

  query_strings_config {
    query_string_behavior = "all"
  }
}

resource "aws_cloudfront_cache_policy" "web" {
  name = "reviewpal-${var.env_name}-web-cache-policy"

  default_ttl = 86400    # 1 day
  max_ttl     = 31536000 # 1 year
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }

    headers_config {
      header_behavior = "none"
    }

    query_strings_config {
      query_string_behavior = "all"
    }
  }
}
