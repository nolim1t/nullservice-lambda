# AWS Lambda Null service
## About
This is a web service which does absolutely nothing other than display the variables that was given to this service OR redirects the user to a URL if a redirect URL was specified.

## Why?
I did this to do proof of concept landing pages or general pages to get the full UX feel to it while demonstrating the UI (because I'm a UX person, I need to make sure that the designs actually "appear to work" too).

This also acts as a testing playground for doing webservices too

## AWS IAM permissions
Currently no special permissions needed

## Setting up API Gsteway
### Handling redirects
* go to Integration responses
* Add 302 response status
* add http.* for regex
* Add "Location" for response header and "integration.response.body.errorMessage" for the mapping value
Refer to [This page](http://www.nolim1t.co/2016/05/11/conditional-redirects-using-aws-lambda-and-aws-api-gateway.html) for more details

### GET method
* Set up API action
* Set up API method
* Go to integration request and under  "Body Mapping Templates" enter in
```text
{
    "version": "$stageVariables.get('version')"
    "request_type": "GET",
    "action": "$input.params('action')"
}
```
### POST method
Refer to [this page](http://www.nolim1t.co/2016/05/03/reading-HTTP-POST-requests-to-an-AWS-Lambda-function.html) for a very detailed way of processing post requires

```text
#if ($context.httpMethod == "POST")
 ## Lets get both query strings and POST
 #set($rawAPIData = $input.params().querystring)
 #set($rawAPIData = $rawAPIData.toString())
 #set($rawAPIDataLength = $rawAPIData.length() - 1)
 #set($rawAPIData = $rawAPIData.substring(1, $rawAPIDataLength))
 #set($rawAPIData = $rawAPIData.replace(", ", "&"))

 #set($rawAPIData = $rawAPIData + '&' + $input.path('$'))
#elseif ($context.httpMethod == "GET")
 #set($rawAPIData = $input.params().querystring)
 #set($rawAPIData = $rawAPIData.toString())
 #set($rawAPIDataLength = $rawAPIData.length() - 1)
 #set($rawAPIData = $rawAPIData.substring(1, $rawAPIDataLength))
 #set($rawAPIData = $rawAPIData.replace(", ", "&"))
#else
 #set($rawAPIData = "")
#end

## first we get the number of "&" in the string, this tells us if there is more than one key value pair
#set($countAmpersands = $rawAPIData.length() - $rawAPIData.replace("&", "").length())

## if there are no "&" at all then we have only one key value pair.
## we append an ampersand to the string so that we can tokenise it the same way as multiple kv pairs.
## the "empty" kv pair to the right of the ampersand will be ignored anyway.
#if ($countAmpersands == 0)
 #set($rawPostData = $rawAPIData + "&")
#end

## now we tokenise using the ampersand(s)
#set($tokenisedAmpersand = $rawAPIData.split("&"))

## we set up a variable to hold the valid key value pairs
#set($tokenisedEquals = [])

## now we set up a loop to find the valid key value pairs, which must contain only one "="
#foreach( $kvPair in $tokenisedAmpersand )
 #set($countEquals = $kvPair.length() - $kvPair.replace("=", "").length())
 #if ($countEquals == 1)
  #set($kvTokenised = $kvPair.split("="))
  #if ($kvTokenised[0].length() > 0)
   ## we found a valid key value pair. add it to the list.
   #set($devNull = $tokenisedEquals.add($kvPair))
  #end
 #end
#end

## We now populate the key value stuff.
## Including any stage variables too because 'tis bad to check in configuration variables
{
 "version": "$stageVariables.get('version')",
  "request_type": "POST",
#foreach( $kvPair in $tokenisedEquals )
  ## finally we output the JSON for this pair and append a comma if this isn't the last pair
  #set($kvTokenised = $kvPair.split("="))
 "$util.urlDecode($kvTokenised[0])" : #if($kvTokenised[1].length() > 0)"$util.urlDecode($kvTokenised[1])"#{else}""#end#if( $foreach.hasNext ),#end
#end
}
```

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
