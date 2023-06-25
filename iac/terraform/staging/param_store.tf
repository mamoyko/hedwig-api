resource "aws_ssm_parameter" "hedwig_console_db_password" {
  name        = "/${title(var.environment)}/HedwigConsole/DB_Password"
  description = "Hedwig Console DB Password"
  type        = "SecureString"
  value       = var.app_db_password
  key_id      = local.ssm_acm_key_id
  tags        = local.common_tags
}

resource "aws_ssm_parameter" "admin_password" {
  name        = "/${title(var.environment)}/HedwigConsole/Admin_Password"
  description = "Hedwig Console Admin"
  type        = "SecureString"
  value       = var.admin_password
  key_id      = local.ssm_acm_key_id
  tags        = local.common_tags
}

resource "aws_ssm_parameter" "jwt_secret" {
  name        = "/${title(var.environment)}/HedwigConsole/JWT_Secret"
  description = "Hedwig Console JWT Secret"
  type        = "SecureString"
  value       = var.jwt_secret
  key_id      = local.ssm_acm_key_id
  tags        = local.common_tags
}

resource "aws_ssm_parameter" "vcm_client_id" {
  name        = "/${title(var.environment)}/HedwigConsole/vcm_client_id"
  description = "VCM CLIENT ID"
  type        = "SecureString"
  value       = var.vcm_client_id
  key_id      = local.ssm_acm_key_id
  tags        = local.common_tags
}

resource "aws_ssm_parameter" "vcm_client_secret" {
  name        = "/${title(var.environment)}/HedwigConsole/vcm_client_secret"
  description = "VCM CLIENT SECRET"
  type        = "SecureString"
  value       = var.vcm_client_secret
  key_id      = local.ssm_acm_key_id
  tags        = local.common_tags
}
