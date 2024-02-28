"use client";

import React, { useState } from "react";
import { VideoOutput, VideoUploader } from "@/components/componentFile";
import { getFileExtensionType } from "@/utils/helperMethods";
import { video_conversion_url } from "@/utils/constants";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

// Edit when more features added
const videoEnhancementOptions = ["Convert Format", "Summarization"];

export default function VideoProcessingUnit() {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [output, setOutput] = useState(null);
  const [taskOption, setTaskOption] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currFormat, setCurrFormat] = useState("");
  const [targetFormat, setTargetFormat] = useState("");
  const [outputFileFormat, setOutputFileFormat] = useState("");

  const handleChangeTargetFormat = (event) => {
    setTargetFormat(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // console.log(file);

    // Check if the selected file is an image
    if (file) {
      // Set the selected file and display a preview
      setVideoFile(file);
      setCurrFormat(getFileExtensionType(file.name));
      const reader = new FileReader();
      reader.onload = () => {
        setVideoPreview(reader.result);
        // console.log(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setVideoFile(null);
      setVideoPreview(null);
    }
  };

  const handleClear = () => {
    // console.log("Cleared");
    setVideoFile(null);
    setVideoPreview(null);
    clearOutput();
    clearVideoFormats();
    clearLogFile();
    clearVideoProgress();
    // setIsLoading(false);
  };

  const clearVideoProgress = () => {
    setVideoConversionProgress(-1);
  };

  const clearVideoFormats = () => {
    setCurrFormat("");
    setTargetFormat("");
  };

  const handleChangeOption = (event, newValue) => {
    const taskNum = parseInt(event.target.value);
    setTaskOption(taskNum);
    clearOutput();
  };

  const clearOutput = () => {
    setOutput(null);
  };

  const handleSubmit = async () => {
    // console.log("Submitted!");
    clearOutput();
    setIsLoading(true);
    await handleTaskSubmission(taskOption);
    createLogFile(taskOption);
  };

  const handleTaskSubmission = async (taskOption) => {
    if (taskOption === 1) {
      if (targetFormat === "") {
        setIsLoading(false);
        return;
      }
      setProgressMessage("Uploading video file to server...");
      const videoS3Url = await sendToApi();
      console.log(videoS3Url);
      // setIsLoading(false);
      setProgressMessage("Conversion in progress...");
      console.log("Conversion in progress...");
      let url = await handleConvert(videoS3Url);
      setIsLoading(false);
      setOutput(url);
      setOutputFileFormat(targetFormat);
      clearVideoProgress();
      // console.log(url);
    } else { // Replace this with future features
      // console.log("Summarization");
      setIsLoading(false);
    }
  };

  const [apiEndpoint, setApiEndpoint] = useState(video_conversion_url);
  const sendToApi = async () => {
    const data = new FormData();
    data.append("video", videoFile);
    let videoS3Url;

    await fetch(apiEndpoint, {
      method: "PUT",
      mode: "cors",
      body: data,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something went wrong...");
        }
        return res.json();
      })
      .then((jsonRes) => {
        // console.log(jsonRes.video_url);
        // setOutput(jsonRes.video_url);
        videoS3Url = jsonRes.video_url;
        // setIsLoading(false);
      })
      .catch((err) => async () => {
        let jsonErr = await err.json();
        setIsLoading(false);
        console.log(jsonErr.error);
      });

    return videoS3Url;
  };

  // Log file variables
  const [currLogFile, setCurrLogFile] = useState([]);

  const createLogFile = (taskOption) => {
    // setSameImage(true);
    let audioName = addVideoNameToLogFile();
    // Need time & date, plus enhancement option done
    const date = new Date();
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();
    const enhancementLogStr = addDetailsForEnhancementDone(taskOption);
    const logStr = `${audioName}${dateStr} ${timeStr} - ${enhancementLogStr}\n`;
    // console.log(logStr);
    setCurrLogFile([...currLogFile, logStr]);
  };

  const addDetailsForEnhancementDone = (taskOption) => {
    const enhancementDone = videoEnhancementOptions[taskOption - 1];
    if (taskOption === 1) {
      return `${enhancementDone} from ${currFormat} to ${targetFormat}`;
    } else {
      return `${enhancementDone}`;
    }
  }

  const addVideoNameToLogFile = () => {
    // Check if logfile empty, else add newline before appending video name
    let logStr;

    // Empty log file or same initial image processed
    if (currLogFile.length === 0) {
      logStr = `${videoFile.name}\n`;
    } else {
      // Video not changed and has existing log file
      logStr = "";
    }
    return logStr;
  };

  const clearLogFile = () => {
    setCurrLogFile([]);
  };

  // Conversion of video
  const handleConvert = async (videoS3Url) => {
    const url = await convertVideo(videoFile, targetFormat, videoS3Url);
    return url;
  };

  // Could convert this into a general progress tracker for video
  const [videoConversionProgress, setVideoConversionProgress] = useState(-1);
  const [progressMessage, setProgressMessage] = useState("");

  const convertVideo = async (videoFile, targetFormat, videoS3Url) => {
    // return;

    let name = videoFile.name;
    // let fileUrl = output;

    const ffmpeg = createFFmpeg({
      log: true,
      progress: (e) => setVideoConversionProgress(e.ratio * 100),
      corePath:
        "https://cdnjs.cloudflare.com/ajax/libs/ffmpeg-core/0.11.0/ffmpeg-core.js",
    });

    // console.log("Loading ffmpeg.wasm...");
    await ffmpeg.load();

    // write file to  memory filesystem
    console.log("Writing file to memory filesystem...");
    ffmpeg.FS("writeFile", name, await fetchFile(videoS3Url));
    // convert video into mp4
    // console.log("Converting video...");
    await ffmpeg.run("-i", name, `output.${targetFormat}`); // Edit the variables here based specifications for desired output
    // read file from Memory filesystem
    // console.log("Finish conversion");
    const data = ffmpeg.FS("readFile", `output.${targetFormat}`);
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: `video/${targetFormat}` })
    );
    console.log(url);

    return url;
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 flex-col sm:flex-row">
      <VideoUploader
        videoFile={videoFile}
        videoPreview={videoPreview}
        handleFileChange={handleFileChange}
        handleClear={handleClear}
        handleSubmit={handleSubmit}
        taskOption={taskOption}
        handleChangeOption={handleChangeOption}
        currFormat={currFormat}
        targetFormat={targetFormat}
        handleChangeTargetFormat={handleChangeTargetFormat}
      />
      <VideoOutput
        taskOption={taskOption}
        currLogFile={currLogFile}
        inputFile={videoFile}
        output={output}
        outputFileFormat={outputFileFormat}
        isLoading={isLoading}
        progressMessage={progressMessage}
        videoConversionProgress={videoConversionProgress}
      />
    </div>
  );
}
