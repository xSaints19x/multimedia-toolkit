import time
import cv2
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from io import BytesIO
import numpy as np
import json

# For NAFNet model
import replicate
import os
import requests

# AWS SDK for Python
import boto3
from botocore.exceptions import ClientError

# Dotenv
from dotenv import load_dotenv
load_dotenv()                    

api = Flask(__name__)
CORS(api)

# Connect to replicate website to access model generation and open sample file
os.environ["REPLICATE_API_TOKEN"] = os.getenv('SECRET_KEY') # Add SECRET_KEY variable in .env file, SECRET_KEY = "SAMPLE_KEY"

# Connect to AWS client to connect to s3
s3_client = boto3.client('s3')

# Connect to AWS client to connect to s3
s3_bucket = os.getenv('S3_BUCKET') # Add S3_BUCKET variable in .env file, e.g S3_BUCKET = "SAMPLE_BUCKET"
audio_bucket = boto3.resource('s3').Bucket(s3_bucket)

# Transcribe service & variables
transcribe_client = boto3.client('transcribe')
transcription_langCode = "en-US"
region = "ap-southeast-1"

# Connect to AWS client and connect to another s3 bucket
s3_video_bucket = os.getenv('S3_VIDEO_BUCKET') # Add S3_BUCKET variable in .env file, e.g S3_BUCKET = "SAMPLE_BUCKET"
video_bucket = boto3.resource('s3').Bucket(s3_video_bucket)
region_name = "ap-southeast-1"

# Generate random id for unique job id
import uuid

@api.route("/", methods=["GET", "POST"])
def root():
    if request.method == "GET":
        return {"GET": "Data sending.."}
    elif request.method == "POST":
        return {"POST": "Data received.. Processing"}
    
@api.route("/low-light-enhancer", methods=["POST"])
def low_light_enhance():

    # Check if image exists, otherwise throw error
    if "image" not in request.files:
        return jsonify({"error": "No image file found"}), 400

    # Get the uploaded file from the request which is of type FileStorage
    file = request.files["image"]

    # Read the file data and convert to OpenCV image format
    file_data = file.read()
    nparr = np.frombuffer(file_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Apply low light enhancement algorithm (histogram equalization)
    img = cv2.equalizeHist(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))

    # Convert the OpenCV image back to bytes and send it back to the client
    retval, buffer = cv2.imencode(".jpg", img)
    # return send_file(BytesIO(buffer), mimetype='image/jpeg')
    return send_file(BytesIO(buffer), mimetype="image/png")

@api.route("/deblurring", methods=["POST"])
def deblurring():

    if "image" not in request.files:
        return jsonify({"error": "No image file found"}), 400
    
    # Get the uploaded file from the request
    file = request.files["image"]
    # print(image)

    # Read the file data and convert to OpenCV image format
    image = BytesIO(file.read())

    output = replicate.run(
        "megvii-research/nafnet:018241a6c880319404eaa2714b764313e27e11f950a7ff0a7b5b37b27b74dcf7",
        input={"task_type": "Image Debluring (REDS)", "image": image},
    )

    # Download the image from the URL
    response = requests.get(output)
    img = BytesIO(response.content)

    # Send the image to the client
    return send_file(img, mimetype='image/png')

@api.route("/audio-to-text", methods=["PUT"])
def process_audio():
    if request.method == "PUT":
        # print("Request received!")

        # Add audio file into s3
        file = request.files['audio']
        put(audio_bucket, file)

        # Generate file's S3 URI for transcribe
        fileS3Uri = genS3Uri(audio_bucket, file)
        response = transcribeAudio(fileS3Uri)
        transcriptionJobName = response['TranscriptionJob']['TranscriptionJobName']

        # Sample transcript for demo to be removed when deployed
        # transcriptionJobName = "transcript-101d4be8-e0f0-4e79-9155-e6d5e66f0b57" # 4 seconds sample
        # transcriptionJobName = "testing-1" # 26 seconds sample
        # transcriptionJobName = "transcript-dbb578d5-be74-4d89-b2c8-04479cc81468" # With subtitle

        # Retrieve file's S3 URI to get transcript
        try:
            transcript_job = getTranscriptionJob(transcriptionJobName)
        except:
            return {"error": "Transcription job failed"}, 400
        transcript_subtitleFile_url = getSubtitleFile(transcript_job)
        transcript_textFile_url = getTranscriptText(transcript_job)

        # Download transcript file
        downloaded_file = requests.get(transcript_textFile_url)
        json_file_data = json.loads(downloaded_file.content)
        transcript = json_file_data['results']['transcripts'][0]['transcript']

        return {"transcript": f'{transcript}', "subtitleFileUri": f'{transcript_subtitleFile_url}'}, 200
    
def getSubtitleFile(transcript_job):
    return transcript_job['TranscriptionJob']['Subtitles']['SubtitleFileUris'][0]

def getTranscriptText(transcript_job):
    return transcript_job['TranscriptionJob']['Transcript']['TranscriptFileUri']
    
def put(bucket, file):
    """
    Put the object in a bucket
    
    :param bucket: The bucket to query. This is a Boto3 Bucket resource
    :param file: The file to be uploaded
    """
    bucket.put_object(Key=file.filename, Body=file)
    # print(f"Uploaded {file.filename} successfully")

def genS3Uri(bucket, file):
    """
    Generate S3 URI of object in a bucket
    
    :param bucket: The bucket to query. This is a Boto3 Bucket resource
    :param file: The file that has been uploaded
    :return: URI string
    """
    return f"s3://{bucket.name}/{file.filename}"

def transcribeAudio(fileS3Uri):
    """
    Transcribe audio of object in a bucket
    
    :param bucket: S3 URI of object in a bucket
    :return: TranscriptionJob object of dict type
    """
    jobId = uuid.uuid4()
    response = transcribe_client.start_transcription_job(
        TranscriptionJobName=f"transcript-{jobId}",
        LanguageCode=transcription_langCode,
        Media={
            'MediaFileUri': fileS3Uri,
        },
        Subtitles={ # Can add VTT format if required in future
        'Formats': [
            'srt',
        ],
        'OutputStartIndex': 1
    },
    )

    return response

def getTranscriptionJob(transcriptionJobName):
    """
    Retrieve transcription job
    
    :param transcriptionJobName: Unique transcription job name
    :return: TranscriptionJob object of dict type
    """
    transcriptJobComplete = False

    # Retry till TranscriptionJobStatus is complete
    while (not transcriptJobComplete):
        response = transcribe_client.get_transcription_job(
            TranscriptionJobName = transcriptionJobName
        )

        TranscriptionJobStatus = response['TranscriptionJob']['TranscriptionJobStatus']
        # print(TranscriptionJobStatus)

        if (TranscriptionJobStatus == "IN_PROGRESS"):
            time.sleep(1)
        elif (TranscriptionJobStatus == "COMPLETED"):
            transcriptJobComplete = True
        elif (TranscriptionJobStatus == "FAILED"):
            raise Exception("Transcription job failed")
        else: # "QUEUED"
            time.sleep(5)

    return response

@api.route("/video-conversion", methods=["PUT"])
def process_video():
    if (request.method == "PUT"):
        file = request.files['video']
        put(video_bucket, file)
        # time.sleep(5)
        # checkFileUploadSuccess(video_bucket, file)
        checkFileUploadSuccess(s3_video_bucket, file)
        # Get S3 URL of Object
        video_url = genS3Url(video_bucket, file)

        # Return video_url as response
        return {"video_url": f'{video_url}'}, 200
    
def genS3Url(bucket, file):

    # Sample link: https://mmfvideobucket.s3.ap-southeast-1.amazonaws.com/video+(2160p).mp4
    return f"https://{bucket.name}.s3.{region_name}.amazonaws.com/{file.filename}"

def checkFileUploadSuccess(bucket, file):
    """
    Check if file has been uploaded successfully to bucket
    
    :param bucket: Destination bucket
    :param file: Uploaded file
    """
    # print(f"Checking if {file.filename} has been uploaded successfully to {bucket}...")
    fileUploadComplete = False

    # Retry till TranscriptionJobStatus is complete
    while (not fileUploadComplete):
        response = s3_client.head_object(Bucket=bucket, Key=file.filename)
        # print(response)

        # The file has not been uploaded successfully
        if response['ContentLength'] == 0:
            # Wait to try again
            time.sleep(2)
        else:
            fileUploadComplete = True

if __name__ == "__main__":
    api.run()
