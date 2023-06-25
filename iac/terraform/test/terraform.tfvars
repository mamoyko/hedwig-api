environment = "test"
region = "ap-southeast-1"
voyagerapis_hosted_zone_id = "Z308MQJ9DMKZE1"
voyagerapis_domain = "voyagerapis.com"
voyagerph = "voyagerph"
hedwig_console_image = "registry.gitlab.corp.paymaya.com/core/growth/messaging-platform/communications-mesh-team/hedwig-console-api:v0.00.21"
tasks_desired_count = 1
app_subnet_ids = ["subnet-60897104","subnet-f7b44081"]
backend_subnet_ids = ["subnet-0a7da66e","subnet-d6df0ba0"]
vpc_id = "vpc-60fdf105"
ecs_internal_alb_443 = "arn:aws:elasticloadbalancing:ap-southeast-1:652842025583:listener/app/ecs-internal-sandbox-alb/5700ea72fdc4bbf1/d2d039e0b99ca3c0"
ecs_private_alb_443 = "arn:aws:elasticloadbalancing:ap-southeast-1:652842025583:listener/app/ecs-non-prod-private-alb/94ab1aa621c157e8/35fdc8b148bcbd51"
ecs_private_alb_dns = "ecs-non-prod-private-alb-1564745291.ap-southeast-1.elb.amazonaws.com"
ecs_private_alb_hosted_zone_id = "Z1LMS91P8CMLE5"
endpoint_whitelist = "['https://hedwig-fe-test.voyagerapis.com']"
ldap_url = "vgrawseoads1801.launchpad.corp.voyagerinnovation.com"
ldap_bind = "svc.adc-hedwig"
ldap_bind_credentials = "M@ya@2023!"
ldap_ip = "192.168.32.119"
vcm_url = "https://staging-vcm.voyagerinnovation.com"
vcm_appname = "hedwig-console-test"
