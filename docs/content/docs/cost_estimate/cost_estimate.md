---
title: "Cost Estimate"
group: "Internals"
type: "doc"
---

We estimate the LambStatus system takes just *$1 to handle 30,000 visitors*. This page explains how we calculated the cost.

### Assumptions

We assume that the details of the 30,000 visitors are like this:
* 30,000 unique users visit your status page for *5 minutes*. A status page usually gets very low traffic and occasionally huge traffic. 
* They visit only the top page. The top page usually gives them enough information to know the service status.
* 10,000 visitors from US, 10,000 visitors from Europe and 10,000 visitors from Asia.

Also, when 1 user visits the status page, its client sends these requests:
* 8 requests to load static assets like html and js. The data transfer size is 100KB in total.
* 10 API requests to load dynamic data like an incident status. The data transfer size is 5KB in total.

Finally, there are some assumptions about the infrastructure and AWS:
* The region of the system is us-west-2.
* Free tier offers that expire 12 months are *expired*. API Gateway, S3 and CloudFront fall under this category.
* For free tier offers that never expire, you haven’t consumed your free tier allotment. DynamoDB and Lambda fall under this category.

### Summary

|Service|Cost|
|---|---|
|Lambda|$0.000372|
|API Gateway|$0.00105|
|DynamoDB|$0.000|
|S3|$0.000855|
|CloudFront|$0.893|
|Total|*$0.895*|

Although other services like Amazon Cognito and Amazon SNS are used slightly, their costs are too small to consider.

### AWS Lambda

[Pricing page](https://aws.amazon.com/lambda/pricing/)

The cost of Lambda is based on the number of requests for functions and the time the code executes.

#### Requests

There are CloudFront and API Gateway in front of Lambda functions, and all requests to the public APIs are cached in the CloudFront for 10 seconds. So, the total number of requests is:

```
6 (requests/minute) * 5 (minutes) * 10 (APIs) = 300 (requests)
```

Since it takes $0.0000002 per request, the total cost is:

```
300 (requests) * 0.0000002 (USD/request) = 0.00006 (USD)
```

#### Duration

Assuming each API call takes 500ms, the total duration is:

```
300 (requests) * 500 (ms/request) = 150000 (ms)
```

Since the memory size for public APIs is 128MB, it takes $0.000000208 per 100ms. So:

```
150000 (ms) / 100 * 0.000000208 (USD/100ms) = 0.000312 (USD)
```

### Amazon API Gateway

[Pricing page](https://aws.amazon.com/api-gateway/pricing/)

The cost of API Gateway is based on the API calls you receive and the amount of data transferred out.

#### API Calls

As well as Lambda, there is CloudFront in front of API Gateway and all requests to the public APIs are cached in the CloudFront for 10 seconds. So, the total number of requests is:

```
6 (requests/1 minute) * 5 (minutes) * 10 (APIs) = 300 (requests)
```

Since it takes $3.50 per million API calls, the total cost is:

```
300 (requests) / 1000000 * 3.5 (USD/million req) = 0.00105 (USD)
```

#### Data Transfer Costs

You will be charged for *out-to-Internet* data transfer and the data from API gateway is transferred to CloudFront, so the cost is merely $0.

### Amazon DynamoDB

[Pricing page](https://aws.amazon.com/dynamodb/pricing/)

The cost of DynamoDB is based on the Provisioned Throughput and the Indexed Data Storage.

#### Provisioned Throughput (Read)

Each Lambda function for the public APIs typically accesses just one table and read several entities. Also, since all requests to the public APIs are cached in the CloudFront for 10 seconds, these Lambda functions are invoked in every 10 seconds at most. So we assume the 1 RCU per table is enough.

It takes $0.09 per RCU and there are 7 tables. Also, we assume you haven’t consumed your free tier allotment (25 RCUs). so the total cost is:

```
1 (RCU) * 0.09 (USD/RCU) * 7 (tables) = 0.63 (USD)
Thanks to the 25 RCUs free tier, the actual cost is $0.
```

#### Provisioned Throughput (Write)

Lambda functions for the public APIs do no write operations. So the 1 WCU per table is enough.

It takes $0.47 per WCU and there are 7 tables. Also, we assume you haven’t consumed your free tier allotment (25 WCUs). so the total cost is:

```
1 (WCU) * 0.47 (USD/WCU) * 7 (tables) = 3.29 (USD)
Thanks to the 25 WCUs free tier, the actual cost is $0.
```

#### Indexed Data Storage

The size of each item in the tables is at most 1KB and the number of items will not exceed 1000. Since it takes just $0.25 per GB, we assume the storage cost is merely $0.

### Amazon S3

[Pricing page](https://aws.amazon.com/s3/pricing/)

The cost of S3 is based on the stored data size, the number of requests and the amount of data transferred out.

#### Storage

The system stores static files like html and js and metrics data files in the S3 bucket. The static file size is too small to consider, but the metrics data size can be kind of large. We assume the metrics data size increases by 100KB a day and there are data for 1 year. Since it takes $0.023 per GB, the cost is:

```
100 (KB) * 365 (days/year) / (1024 * 1024) * 0.023 (USD/GB) = 0.0008 (USD)
```

#### Requests

There are CloudFront in front of S3 buckets, and js/css files are cached for 1 year and html and json data files are cached for 10 seconds. So, we consider only html and json data files here and there are 5 such files in total. So, the total number of requests is:

```
5 (files) * 6 (requests/1 minute) * 5 (minutes) = 150 (requests)
```

Since it takes $0.0037 per 10,000 requests, the total cost is:

```
150 (requests) / 10000 * 0.0037 (USD/request) = 0.000055 (USD)
```

#### Data Transfer Costs

Data transfer cost from S3 to CloudFront is free.

### Amazon CloudFront

[Pricing page](https://aws.amazon.com/cloudfront/pricing/)

The cost of CloudFront is based on the number of requests and the amount of data transferred out.

#### Data Transfer Costs

As we assumed, the 100 + 5 KB size data is transferred to each user. The data transfer cost differs depending on the regions: $0.085/GB in US, $0.085/GB in Europe and $0.140/GB in Asia. Since there are 10,000 visitors from US, 10,000 visitors from Europe and 10,000 visitors from Asia, the average cost is $0.103/GB. So the total cost is:

```
0.105 (MB/user) / 1024 * 30000 (users) * 0.103 (USD/GB) = 0.316 (USD)
```

#### Requests

As we assumed, each user sends 10 + 8 requests per visit. The request cost differs depending on the regions: $0.0100/10000 in US, $0.0120/10000 in Europe and $0.0120/10000 in Asia. Since there are 10,000 visitors from US, 10,000 visitors from Europe and 10,000 visitors from Asia, the average cost is $0.01133/10000. So the total cost is:

```
17 (requests / user) * 30000 (users) / 10000 * 0.01133 (USD/request) = 0.5778 (USD)
```

