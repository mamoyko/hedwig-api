provider "aws" {
  region = var.region
  version = "~> 4.0"
}

terraform {
  backend "s3" {
    bucket = "core-terraform-state-file"
    key = "staging/growth/hedwig-console-services.tfstate"
    dynamodb_table = "core-terraform-state-locking"
    region = "ap-southeast-1"
    role_arn = "arn:aws:iam::445417093929:role/TFBackendAccess"
  }
}

provider "aws" {
  region = var.region
  assume_role {
    role_arn = "arn:aws:iam::853765034474:role/TFCrossAccountAccess-MT"
    session_name = "gitlab_ci"
  }
  alias = "voyagerph"
}