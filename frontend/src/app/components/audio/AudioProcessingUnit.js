"use client";

import React, { useState } from "react";
import { AudioOutput, AudioUploader } from "@/components/componentFile";
import { audio_to_text_url } from "@/utils/constants";

// Edit when more features added
const audioEnhancementOptions = ["Transcribe audio", "De-noise"];

export default function AudioProcessingUnit() {
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [transcriptText, setTranscriptText] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [subtitleUri, setSubtitleUri] = useState(null);
  const [taskOption, setTaskOption] = useState(1);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // console.log(file);

    // Check if the selected file is an image
    if (file) {
      // Set the selected file and display a preview
      setAudioFile(file);
      // setIsLoading(true);
      const reader = new FileReader();
      reader.onload = () => {
        setAudioPreview(reader.result);
        // console.log(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAudioFile(null);
      setAudioPreview(null);
    }
  };

  const handleClear = () => {
    // console.log("Cleared");
    setAudioFile(null);
    setAudioPreview(null);
    setTranscriptText(null);
    clearLogFile();
    // setIsLoading(false);
  };

  const handleChangeOption = (event, newValue) => {
    const taskNum = parseInt(event.target.value);
    setTaskOption(taskNum);
    clearOutput();
  };

  const clearOutput = () => {
    setTranscriptText(null);
  };

  const clearLogFile = () => {
    setCurrLogFile([]);
  };

  const handleSubmit = async () => {
    // console.log("Submitted!");
    setIsLoading(true);
    if (taskOption === 1) {
      await sendToApi();
    } else {
      // Other features
      setIsLoading(false);
      return;
    }

    // For testing purpose
    // setTranscriptText("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis risus sed vulputate odio ut enim blandit. In mollis nunc sed id semper risus in hendrerit. Nisl pretium fusce id velit ut tortor pretium viverra suspendisse. Euismod elementum nisi quis eleifend quam. Felis eget nunc lobortis mattis aliquam faucibus.");
    // setTranscriptText("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquet nibh praesent tristique magna sit amet purus gravida. Et tortor consequat id porta nibh venenatis cras. Tempus urna et pharetra pharetra massa massa. Non quam lacus suspendisse faucibus interdum posuere. Sit amet consectetur adipiscing elit duis tristique. At imperdiet dui accumsan sit amet nulla facilisi morbi. Orci a scelerisque purus semper eget duis at tellus. Eu mi bibendum neque egestas congue quisque egestas diam. Lobortis scelerisque fermentum dui faucibus in ornare quam viverra. Libero enim sed faucibus turpis in. Magna etiam tempor orci eu. At tellus at urna condimentum mattis pellentesque id nibh. Purus non enim praesent elementum. In tellus integer feugiat scelerisque varius morbi enim. Semper feugiat nibh sed pulvinar proin gravida hendrerit. Leo integer malesuada nunc vel risus commodo. Diam phasellus vestibulum lorem sed risus ultricies tristique nulla aliquet. Sed enim ut sem viverra aliquet eget sit amet. Eros donec ac odio tempor orci dapibus. Est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Placerat orci nulla pellentesque dignissim enim sit amet venenatis urna. Lacus suspendisse faucibus interdum posuere. Nibh venenatis cras sed felis eget velit aliquet sagittis id. Viverra maecenas accumsan lacus vel facilisis volutpat.");
    // setIsLoading(false);

    createLogFile(taskOption);
  };

  const sendToApi = async () => {
    const data = new FormData();
    data.append("audio", audioFile);

    await fetch(audio_to_text_url, {
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
        setTranscriptText(jsonRes.transcript);
        setSubtitleUri(jsonRes.subtitleFileUri);
        setIsLoading(false);
      })
      .catch((err) => async () => {
        let jsonErr = await err.json();
        setIsLoading(false);
        console.log(jsonErr.error);
      });
  };

  // Log file variables
  const [currLogFile, setCurrLogFile] = useState([]);

  const createLogFile = (taskOption) => {
    // setSameImage(true);
    let audioName = addAudioNameToLogFile();
    // Need time & date, plus enhancement option done
    const date = new Date();
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();
    const enhancementDone = audioEnhancementOptions[taskOption - 1];
    const logStr = `${audioName}${dateStr} ${timeStr} - ${enhancementDone}\n`;
    // console.log(logStr);
    setCurrLogFile([...currLogFile, logStr]);
  };

  const addAudioNameToLogFile = () => {
    // Check if logfile empty, else add newline before appending image name
    let logStr;

    // Empty log file or same initial image processed
    if (currLogFile.length === 0) {
      logStr = `${audioFile.name}\n`;
    } else {
      // Audio not changed and has existing log file
      logStr = "";
    }
    return logStr;
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 flex-col sm:flex-row">
      <AudioUploader
        audioPreview={audioPreview}
        handleFileChange={handleFileChange}
        handleClear={handleClear}
        handleSubmit={handleSubmit}
        taskOption={taskOption}
        handleChangeOption={handleChangeOption}
        // isLoading={isLoading}
        // setIsLoading={setIsLoading}
      />
      <AudioOutput
        isLoading={isLoading}
        transcriptText={transcriptText}
        subtitleUri={subtitleUri}
        currLogFile={currLogFile}
        inputFile={audioFile}
      />
    </div>
  );
}
