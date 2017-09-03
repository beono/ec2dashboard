# ec2dashboard
Dashboard that shows healthcheck status of your ec2 instances.

This is how it can look in you browser:

![dashboard](./screenshot.png)

## Features

* Using AWS javascript SDK it fetches your EC2 instances every n seconds.
* Every instances can be clicked it you'll be redirected to the healthcheck page of the specified instance

## Requirements

* Browser. Tested with `Chrome Version 60.0.3112.101 (Official Build) (64-bit)`.
* Configure CORS headers in your apis (for example `Access-Control-Allow-Origin: http://localhost`)
* Healthcheck endpoint must be located at `/_healthcheck_`

## Installation

* Clone this repository.
* Open index.html in your browser and specify your aws credentials, region, healthcheck endpoint and list of instances.

```
For example:
/index.html?accessKeyId=***&secretAccessKey=***&region=eu-east-1&hcpath=healthcheck&q=users_api,news_api,search_api
```
