# Review Pal

`Review Pal` is an open-source extensible tool that leverages Gen AI models to improve and automate review processes. Whether you're reviewing code, documents, or any other content, `Review Pal` manages the entire workflow - from source system connections to LLM interactions and result publishing.

## Features

- 🤖 Powered by Gen AI models for intelligent reviews
- 🔌 Extensible architecture for custom integrations
- 🔄 Automated workflow management
- 📊 Review results publishing

## Prerequisites

- AWS Account with appropriate permissions
- Terraform installed
- AWS CLI configured
- CodeStar connection to this repository

## Deployment

### 1. Initial Setup

1. Create an S3 bucket for Terraform state:
  
```bash
aws s3 mb s3://reviewpal-tf-state
```

2. Configure required SSM parameters:
   
```bash
# Replace [ENV_NAME] with your environment (e.g., dev, prod)
aws ssm put-parameter --name "/reviewpal/[ENV_NAME]/CODESTAR_CONNECTION_ARN" --value "your-connection-arn" --type "String"
aws ssm put-parameter --name "/reviewpal/[ENV_NAME]/SOURCE_REPOSITORY_ID" --value "account_name/repo_name" --type "String"
aws ssm put-parameter --name "/reviewpal/[ENV_NAME]/BACKEND_CONTAINER_IMAGE" --value "" --type "String"
```

### 2. Deploy Infrastructure

#### Applications Infrastructure
```bash
cd infra/apps

# Initialize Terraform
terraform init \
  -backend-config="bucket=reviewpal-tf-state" \
  -backend-config="key=dev/apps/terraform-apps.tfstate" \
  -backend-config="region=us-east-2"

# Validate and apply
terraform validate
terraform plan -var-file=./environments/dev.tfvars -out=tfplan
terraform apply tfplan
```

#### CI/CD Infrastructure
```bash
cd infra/cicd

# Initialize Terraform
terraform init \
  -backend-config="bucket=reviewpal-tf-state" \
  -backend-config="key=dev/cicd/terraform-apps.tfstate" \
  -backend-config="region=us-east-2"

# Validate and apply
terraform validate
terraform plan -var-file=./environments/dev.tfvars -out=tfplan
terraform apply tfplan
```

### 3. Ongoing Deployments

After initial setup, use AWS PipeLine for subsequent deployments.

### 4. Cleanup

To remove all created infrastructure (needs to be executed from both `/apps` and `/cicd` folders):

```bash
terraform destroy -var-file=./environments/dev.tfvars
```

## Local Development

### Security Setup

#### 1. Generate Access Token Certificates
```bash
# Generate private key
openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048

# Generate public key
openssl rsa -pubout -in private_key.pem -out public_key.pem

# Convert to base64 (for configuration)
cat private_key.pem | base64 | tr '+/' '-_' | tr -d '=' | tr -d '\n'
cat public_key.pem | base64 | tr '+/' '-_' | tr -d '=' | tr -d '\n'
```

#### 2. Generate Encryption Key
For secure storage of sensitive data in DB:
```bash
openssl rand -hex 32
```

## Contributing

Contributions are welcome!

## License

This project is licensed under the [Apache License 2.0](LICENSE).

