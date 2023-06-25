
resource "aws_elasticache_subnet_group" "ott_nonprod" {
  name       = "ott-backend-group-hedwig-${var.environment}"
  subnet_ids = "${var.backend_subnet_ids}"
}

resource "aws_elasticache_replication_group" "hedwig_console_group" {
  replication_group_id = "hedwig-console-${var.environment}"
  node_type            = "cache.t3.micro"
  parameter_group_name = "default.redis7"
  #engine_version       = "7.0"
  subnet_group_name    = aws_elasticache_subnet_group.ott_nonprod.name
  security_group_ids   = [aws_security_group.redis_hedwig_console_sg.id]
  automatic_failover_enabled  = false
  replication_group_description = "hedwig console staging"
  at_rest_encryption_enabled  = true
  number_cache_clusters       = "1"
  port                        = 6379
  tags                        = local.common_tags
}

resource "aws_elasticache_cluster" "hedwig_console" {
  count = 0
  cluster_id           = "hedwig-console-${var.environment}-${count.index}"
  replication_group_id = aws_elasticache_replication_group.hedwig_console_group.id
}

