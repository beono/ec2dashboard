# ec2dashboard
Dashboard that shows healthcheck status of your ec2 instances.

## Features

* Using AWS javascript SDK it fetches your EC2 instances every n seconds.
* Every instances can be clicked it you'll be redirected to the healthcheck page of the specified instance

## Requirements

* Browser. Tested with `Chrome Version 60.0.3112.101 (Official Build) (64-bit)`.
* You need to set CORS headers in your apis (`Access-Control-Allow-Origin:*`)
* Healthcheck endpoint must be located at `/_healthcheck_`

## Installation

* Clone this repository.
* Open index.html in your browser and specify your aws credentials and list of instances:

```
/index.html?accessKeyId=***&secretAccessKey=***&region=eu-west-1&q=users_api,news_api,search_api
```
