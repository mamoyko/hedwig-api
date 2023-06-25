resource "aws_route53_record" "hedwig_console_priv" {
    provider = aws.voyagerph
    name    = "hedwig-console-${var.environment}.${var.voyagerapis_domain}"
    type    = "A"
    zone_id = "${var.voyagerapis_hosted_zone_id}"

    alias {
        evaluate_target_health = false
        name                   = "${var.ecs_private_alb_dns}"
        zone_id                = "${var.ecs_private_alb_hosted_zone_id}"
    }
}