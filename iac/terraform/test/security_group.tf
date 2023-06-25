resource "aws_security_group" "ecs_hedwig_console_sg" {
    description = "ecs-hedwig-console-${var.environment}-sg"
    egress      = [
        {
            cidr_blocks      = [
                "0.0.0.0/0",
            ]
            description      = ""
            from_port        = 0
            ipv6_cidr_blocks = []
            prefix_list_ids  = []
            protocol         = "-1"
            security_groups  = []
            self             = false
            to_port          = 0
        },
    ]
    ingress     = [
        {
            description      = ""
            from_port        = 1024
            prefix_list_ids  = []
            protocol         = "tcp"
            cidr_blocks      = []
            ipv6_cidr_blocks = []
            security_groups  = ["sg-02fecc5f98d3842f7"]
            self             = false
            to_port          = 61000
        },
    ]
    name        = "ecs-hedwig-console-${var.environment}-sg"
    vpc_id      = "${var.vpc_id}"
    tags        = local.common_tags

    timeouts {}
}