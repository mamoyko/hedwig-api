locals {
  # Define the common tags for all resources
  common_tags = {
    CostCodeCategory = "Core"
    CostCodePerBU    = "hedwig_${lower(var.environment)}"
    Environment      = title(var.environment)
    MeshTeam         = "MessagingPlatform"
  }
  rds_acm_key_id     = "arn:aws:kms:ap-southeast-1:652842025583:key/a8d845f2-adda-46ed-8024-da78ebdb5768"
  ssm_acm_key_id     = "arn:aws:kms:ap-southeast-1:652842025583:key/92712f06-7282-41fd-ad8d-4f6f07b00bf1"
}
