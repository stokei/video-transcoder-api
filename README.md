## Video Transcoder API


### Run in DEVELOPMENT mode

1) Run docker-compose:

```bash
yarn docker:up
```

2) Install [AwsLocal CLI](https://docs.localstack.cloud/user-guide/integrations/aws-cli/#localstack-aws-cli-awslocal)

3) Create a sample bucket

```bash
awslocal s3api create-bucket --bucket sample-bucket
```

4) Set enviroment variables

5) Run Application in Watch Mode

```bash
yarn start:dev
```
