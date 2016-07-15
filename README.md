# AWS Lambda Null service
## About
This is a web service which does absolutely nothing other than display the variables that was given to this service OR redirects the user to a URL if a redirect URL was specified.

## Why?
I did this to do proof of concept landing pages or general pages to get the full UX feel to it while demonstrating the UI (because I'm a UX person, I need to make sure that the designs actually "appear to work" too).

This also acts as a testing playground for doing webservices too

## AWS IAM permissions
Currently no special permissions needed

## Deploying
### TODO here
Need to script this I think eventually.

### How to create
Replace the function name, role and profile name with your profile

```bash
rm ../nullservice.zip
zip -r ../nullservice.zip *
aws lambda create-function --function-name nullservice \
--runtime nodejs \
--handler index.handler \
--description "AWS Lambda Null Service" \
--role arn:aws:iam::859150883574:role/lambda_s3_exec_role \
--zip-file fileb://../nullservice.zip \
--profile=perceptionz
```

### How to update
Replace the function name and profile name with your profile

```bash
rm ../nullservice.zip ; zip -r ../nullservice.zip * ; aws lambda update-function-code --function-name nullservice   --zip-file fileb://../nullservice.zip --profile=perceptionz
```
