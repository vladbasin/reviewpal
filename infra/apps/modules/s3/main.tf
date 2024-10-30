resource "aws_s3_bucket" "web_bucket" {
  bucket = "reviewpal-${var.env_name}-web-bucket"

  tags = {
    Name = "reviewpal-${var.env_name}-web-bucket"
  }
}

resource "aws_s3_bucket_public_access_block" "web_bucket" {
  bucket = aws_s3_bucket.web_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "web_bucket" {
  bucket = aws_s3_bucket.web_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_policy" "web_bucket" {
  bucket = aws_s3_bucket.web_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.web_bucket.arn}/*"
      },
    ]
  })
  depends_on = [aws_s3_bucket_public_access_block.web_bucket]
}

resource "aws_s3_bucket_website_configuration" "web_bucket" {
  bucket = aws_s3_bucket.web_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_ssm_parameter" "web_bucket_name" {
  name  = "/reviewpal/${var.env_name}/WEB_BUCKET_NAME"
  type  = "String"
  value = aws_s3_bucket.web_bucket.bucket
}
