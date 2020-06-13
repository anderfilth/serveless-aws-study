# create policy and role
aws iam create-role \
  --role-name lambda-exemple \
  --assume-role-policy-document file://policy.json \
  | tee logs/role.log

# create function
aws lambda create-function \
  --function-name hello-cli \
  --zip-file fileb://function.zip \
  --handler index.handler \
  --runtime nodejs12.x \
  --role arn:aws:iam::601213446473:role/lambda-exemple \
  | tee logs/lambda-create.log

# invoke lambda
aws lambda invoke \
  --function-name hello-cli \
  --log-type Tail \
  logs/lambda-exec.log

# update lambda
aws lambda update-function-code \
  --zip-file fileb://function.zip \
  --function-name hello-cli \
  --publish \
  | tee logs/lambda-update.log

# invoke lambda again!
aws lambda invoke \
  --function-name hello-cli \
  --log-type Tail \
  logs/lambda-exec-update.log

# remove all
aws lambda delete-function \
  --function-name hello-cli

aws iam delete-role \
  --role-name lambda-exemple