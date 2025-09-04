## Prerequisite

- Node version: >=20.17.0

## Environment Variables

NODE_ENV - status of the environment

ALLOWED_DOMAINS - list of only allowed domains on the production environment separated by comma

DB_HOST - database's host
DB_PORT - database's port
DB_NAME - database's name
DB_USER - database's authorized user account
DB_PASSWORD - user accounts password

RESEND_API_KEY - using resend.com generated key to send email
RESEND_EMAIL - using resend.com email address of the sender

TOKEN_SECRET_KEY - secret key of the jsonwebtoken for authentication

AWS_ACCESS_KEY_ID - AWS IAM user key ID
AWS_SECRET_ACCESS_KEY - AWS IAM user access key
AWS_REGION - AWS region of the S3
S3_BUCKET - name of the AWS S3 bucket
