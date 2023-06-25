resource "aws_lb_target_group" "hedwig_console_priv_tg" {
  name        = "hedwig-console-priv-${var.environment}-tg"
  port        = 8081
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = "${var.vpc_id}"
  health_check {
    enabled             = true
    healthy_threshold   = 3
    interval            = 5
    matcher             = "200"
    path                = "/hedwigconsole/ruok"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 4
    unhealthy_threshold = 3
 }
}

resource "aws_lb_listener_rule" "hedwig_listener_priv" {
    listener_arn = "${var.ecs_private_alb_443}"
    priority     = 15

    action {
        order            = 1
        target_group_arn = aws_lb_target_group.hedwig_console_priv_tg.arn
        type             = "forward"
    }

    condition {
        #field  = "host-header"
        #values = [aws_route53_record.hedwig_console_priv.name]

        host_header {
            values = [aws_route53_record.hedwig_console_priv.name]
        }
    }
}
