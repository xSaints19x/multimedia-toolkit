# Multimedia API documentation
## Description
This is the documentation for API endpoints with the required body parameters and status code for the various multimedia processing functions.

## Prerequisites
- AWS CLI

Install the AWS CLI on your machine if it isn't already installed. You can follow the guide on the [link](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) to download it.

### Configuring the AWS CLI

You may refer to the guide on the [link](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) for help to configure your AWS CLI.

Run the command below to configure your credentials, region, and output format. 
```bash
aws configure
```

Next, you will see the prompt for the following details and fill in the details accordingly. You may find these details in your AWS IAM Identity Center.
```
AWS Access Key ID [None]: <your_access_key_id>
AWS Secret Access Key [None]: <your_secret_access_key>
Default region name [None]: <your_region_name>
Default output format [None]: <your_output_format>
```

## API Paths

### POST `/deblurring`
#### Body Parameters:
- `image`: Image to be processed
#### Status Codes:
- `200`: Image successfully processed
- `400`: Image not found in parameters

### POST `/low-light-enhancer`
#### Body Parameters:
- `image`: Image to be processed
#### Status Codes:
- `200`: Image successfully processed
- `400`: Image not found in parameters

### PUT `/audio-to-text`
#### Body Parameters:
- `audio`: Audio file to be processed
#### Status Codes:
- `200`: Audio file successfully transcribed
- `400`: Transcription job failed

### PUT `/video-conversion`
#### Body Parameters:
- `video`: Video file to be processed
#### Status Codes:
- `200`: Video file successfully uploaded into S3 bucket

## How to start
To start the API locally:

1. Install the required python libraries to run the API by running the command below in the terminal:
```
pip install -r requirements.txt
```

2. Create an `.env` file and set the required environment variables:
```bash
# Secret key to access replicate website
SECRET_KEY = <your_secret_key> 
S3_BUCKET = <your_aws_s3_audio_bucket>
S3_VIDEO_BUCKET = <your_aws_s3_video_bucket>
```

3. Start the server, it will be running on port `5000` by default
```
flask --app flaskapi.py run
```