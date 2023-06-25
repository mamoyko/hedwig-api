resource "aws_iam_role" "task_role" {
  name = "hedwig-console-task-role-${var.environment}"

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy" "s3_policy" {
  name = "s3_bucket_policy"
  role = aws_iam_role.task_role.id

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        "Action": [
           "s3:ListAllMyBuckets",
           "s3:ListObjects"
        ],
        Effect   = "Allow"
        Resource = "*"
      },
      {
        "Action": [
          "s3:PutObject",
          "s3:GetObject"
        ],
        Effect   = "Allow"
        Resource = [
          aws_s3_bucket.s3_bucket.arn,
          "${aws_s3_bucket.s3_bucket.arn}/*"
        ]
      },      
      ]
  })
}
