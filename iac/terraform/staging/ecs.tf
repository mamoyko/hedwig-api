resource "aws_ecs_service" "hedwig_console_service" {
  name            = "hedwig-console-api-${lower(var.environment)}"
  cluster         = "arn:aws:ecs:ap-southeast-1:652842025583:cluster/${lower(var.environment)}"
  task_definition = aws_ecs_task_definition.hedwig_console.arn
  desired_count   = "1"
  deployment_maximum_percent = 100
  deployment_minimum_healthy_percent = 0
  health_check_grace_period_seconds = 300
  
  capacity_provider_strategy {
    base = 1
    capacity_provider = "FARGATE_SPOT"
    weight = 100
  }
  
  network_configuration {
    subnets = var.app_subnet_ids
    security_groups = [aws_security_group.ecs_hedwig_console_sg.id]
  }

  load_balancer {
   target_group_arn = aws_lb_target_group.hedwig_console_priv_tg.id
   container_name   = "hedwig-console-${lower(var.environment)}"
   container_port   = 3001
  }

  tags = local.common_tags
}

resource "aws_ecs_task_definition" "hedwig_console" {
  container_definitions    = templatefile(
                                       "task_definitions/hedwig_console_fargate.json",
                                       {
                                           name = "hedwig-console-${lower(var.environment)}"
                                           environment = var.environment,
                                           image = var.hedwig_console_image,
                                           jwt_secret = aws_ssm_parameter.jwt_secret.arn,
                                           database_password = aws_ssm_parameter.hedwig_console_db_password.arn,
                                           database_name = "HedwigConsole",
                                           database_username = "hedwig_console",
                                           database_host="hedwig-staging.cqtkdkbdf9yu.ap-southeast-1.rds.amazonaws.com",
                                           admin_password = aws_ssm_parameter.admin_password.arn,
                                           endpoint_whitelist = var.endpoint_whitelist,
                                           ldap_url = var.ldap_url,
                                           ldap_bind = var.ldap_bind,
                                           ldap_bind_credentials = var.ldap_bind_credentials,
                                           redis_endpoint = "hedwig-console-staging.0emopj.ng.0001.apse1.cache.amazonaws.com",
                                           vcm_client_id = aws_ssm_parameter.vcm_client_id.arn,
                                           vcm_client_secret = aws_ssm_parameter.vcm_client_secret.arn,
                                           vcm_appname = var.vcm_appname,
                                           vcm_url = var.vcm_url,
                                           region_aws = var.region,
                                           s3_bucket_name = aws_s3_bucket.s3_bucket.bucket
                                       })
  execution_role_arn       = "arn:aws:iam::652842025583:role/ecsTaskExecutionRole"
  #task_role_arn            = aws_iam_role.task_role.arn
  family                   = "hedwig-console-${lower(var.environment)}"
  network_mode             = "awsvpc"
  cpu                      = 1024
  memory                   = 2048
  requires_compatibilities = ["FARGATE"]

  tags = local.common_tags
}