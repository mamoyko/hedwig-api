variable "environment" {
}

variable "region" {
  description = "AWS Region"
}

variable "voyagerph" {
  type = string
}

variable "voyagerapis_hosted_zone_id" {
}

variable "voyagerapis_domain" {
  type = string
}

variable "tasks_desired_count" {
  type = number
}

variable "hedwig_console_image" {
  type = string
}

variable "app_subnet_ids" {
}

variable "backend_subnet_ids" {
}

variable "vpc_id" {
}

variable "db_password" {
}

variable "app_db_password" {
}

variable "admin_password" {
}

variable "jwt_secret" {
}

variable "ecs_internal_alb_443" {
}

variable "ecs_private_alb_443" {
}

variable "ecs_private_alb_dns" {
}

variable "ecs_private_alb_hosted_zone_id" {
}

variable "endpoint_whitelist" {
}

variable "ldap_url" {
}

variable "ldap_bind" {
}

variable "ldap_bind_credentials" {
}

variable "vcm_url" {
  
}

variable "vcm_client_id" {
  
}

variable "vcm_client_secret" {
  
}

variable "vcm_appname" {
  
}