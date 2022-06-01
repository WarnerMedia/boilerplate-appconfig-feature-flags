# AppConfig Feature Flag Boilerplate

This repository uses an AWS CodePipelines and CloudFormation templates to deploy AppConfig Feature Flags to multiple environments.

The AppConfig Feature Flags are deployed in up to three different regions using a single CodePipeline.

Most of the files in this repository are CloudFormation templates, Markdown files, JSON configurations, and Node.js files.

**NOTE:** Better documentation is coming for this repository.

## Table of Contents

- [Initial Setup](#initial-setup)
- [Test AWS CLI Commands](#test-aws-cli-commands)
- [Reference Websites](#reference-websites)
- [License](#license)

# Initial Setup

The general setup of this repository works the same as it does in [this repository](https://github.com/WarnerMedia/aws-summit-atlanta-2022-demo/blob/main/v1/README.md).

# Test AWS CLI Commands

```
$ aws --profile="aws-profile-nonprod" --region="us-east-2" appconfig get-configuration-profile --application-id abcdefg --configuration-profile-id a1qwert
{
    "ApplicationId": "abcdefg",
    "Id": "a1qwert",
    "Name": "test",
    "Description": "Test feature flag.",
    "LocationUri": "hosted",
    "Type": "AWS.AppConfig.FeatureFlags"
}
```

```
$ aws --profile="aws-profile-nonprod" --region="us-east-2" appconfig get-hosted-configuration-version --application-id abcdefg --configuration-profile-id a1qwert --version-number 2 hosted-configuration-version-output
{
    "ApplicationId": "abcdefg",
    "ConfigurationProfileId": "a1qwert",
    "VersionNumber": "2",
    "ContentType": "application/json"
}
```

```
$ aws --profile="aws-profile-nonprod" --region="us-east-2" appconfig get-hosted-configuration-version --application-id abcdefg --configuration-profile-id a1qwert --version-number 2 test.json
{
    "ApplicationId": "abcdefg",
    "ConfigurationProfileId": "a1qwert",
    "VersionNumber": "2",
    "ContentType": "application/json"
}
```

```
cat test.json
{"flags":{"foo":{"_createdAt":"2022-04-26T00:16:41.082Z","_updatedAt":"2022-04-26T00:16:41.082Z","attributes":{"what":{"constraints":{"type":"string"}}},"description":"Confused.","name":"blarg"},"test":{"_createdAt":"2022-04-25T23:54:20.144Z","_updatedAt":"2022-04-26T00:16:41.082Z","description":"Testing feature flag.","name":"foo"}},"values":{"foo":{"_createdAt":"2022-04-26T00:16:41.083Z","_updatedAt":"2022-04-26T00:16:41.083Z","enabled":false,"what":"now"},"test":{"_createdAt":"2022-04-25T23:54:20.144Z","_updatedAt":"2022-04-25T23:54:20.144Z","enabled":false}},"version":"1"}
```

# Reference Websites

https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-retrieving-the-configuration.html

# License

This repository is released under [the MIT license](https://en.wikipedia.org/wiki/MIT_License).  View the [local license file](./LICENSE).