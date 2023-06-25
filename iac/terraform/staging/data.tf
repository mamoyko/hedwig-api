data "terraform_remote_state" "hedwig_console_group" {
  backend = "s3"

  config = {
    bucket = "core-terraform-state-file"
    key    = "${lower(var.environment)}/growth/hedwig-services.tfstate"
    region = "ap-southeast-1"
    profile = "core"
  }
}
