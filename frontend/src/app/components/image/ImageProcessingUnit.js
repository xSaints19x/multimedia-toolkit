"use client";

import React, { useState, useRef } from "react";
import { deblurring_url, lowLight_url } from "@/utils/constants";
import { CropInputContext, RedactionInputContext } from "@/utils/context";
import {
  ImageOutput,
  ImageUploader,
  canvasPreview,
} from "@/components/componentFile";
// import { getFileNameWithoutExtension } from "@/utils/helperMethods";

// Edit when more features added
const imageEnhancementOptions = [
  "Deblurring",
  "Low light",
  "Crop",
  "Redaction",
];

function ImageProcessingUnit() {
  // Output image of type string containing URL created using URL.createObjectURL(blob)
  const [outputImageUrl, setOutputImageUrl] = useState(null);
  const [inputFile, setInputFile] = useState(null);
  const [inputFileName, setInputFileName] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [apiEndpoint, setApiEndpoint] = useState(deblurring_url);
  const [taskOption, setTaskOption] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Crop variables
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [completedCrop, setCompletedCrop] = useState(null);

  // Redact variables
  const redactCanvasRef = useRef(null);
  // Disable clear redaction button if no areas redacted yet
  const [hasNoRedactedArea, setHasNoRedactedArea] = useState(true);

  const handleChangeLinks = (taskNum) => {
    // console.log(typeof taskNum);
    // console.log(taskNum);
    if (taskNum === 1) {
      setApiEndpoint(deblurring_url);
    } else if (taskNum === 2) {
      setApiEndpoint(lowLight_url);
    }
  };

  // Changing tasks will clear output
  const handleChangeOption = (event) => {
    const taskNum = parseInt(event.target.value);
    setTaskOption(taskNum);
    handleChangeLinks(taskNum);
    clearOutput();
    clearCrop();
  };

  const handleClear = () => {
    // console.log("Remove image..");
    setOutputImageUrl(null);
    setInputFile(null);
    setPreviewImage(null);
    clearCrop();
    clearLogFiles();
  };

  const clearCrop = () => {
    if (completedCrop) setCompletedCrop(null);
  };

  const clearLogFiles = () => {
    setCurrLogFile([]);
    setPrevLogFile([]);
  };

  const clearOutput = () => {
    setOutputImageUrl(null);
  };

  const handleSubmit = async () => {
    // Only submit to server if image uploaded
    if (!inputFile) {
      return;
    }

    setIsLoading(true);
    // console.log("Submit image for processing..");
    if (taskOption === 1 || taskOption === 2) {
      await sendToApi();
    } else if (taskOption === 3) {
      await handleCrop();
      // console.log("In progress...");
      setIsLoading(false);
    } else if (taskOption === 4) {
      if (hasNoRedactedArea) {
        setIsLoading(false);
        return;
      }
      handleRedaction();
      setIsLoading(false);
    } else {
      console.log("Invalid Option");
      setIsLoading(false);
    }
    createLogFile(taskOption);
  };

  // Log file variables
  const [currLogFile, setCurrLogFile] = useState([]);
  const [prevLogFile, setPrevLogFile] = useState([]);
  const [sameImage, setSameImage] = useState(true);

  const createLogFile = (taskOption) => {
    // console.log("Creating log file...");
    setSameImage(true);
    let imageName = addImageNameToLogFile();
    // Need time & date, plus enhancement option done
    const date = new Date();
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();
    const enhancementDone = imageEnhancementOptions[taskOption - 1];
    const logStr = `${imageName}${dateStr} ${timeStr} - ${enhancementDone}\n`;
    if (sameImage) {
      // console.log(prevLogFile);
      setCurrLogFile([...prevLogFile, logStr]);
    } else {
      setCurrLogFile([...currLogFile, logStr]);
    }
  };

  const addImageNameToLogFile = () => {
    // Check if logfile empty, else add newline before appending image name
    let logStr;
    // if (currLogFile.length === 0) {
    //   logStr = `${inputFile.name}`;
    // } else if (imageChanged) { // For batch image processing log files
    //   logStr = `\n${inputFile.name}`;
    // } else { // Image not changed and has exisiting log file
    //   logStr = "";
    // }

    // Empty log file or same initial image processed
    if (currLogFile.length === 0 || prevLogFile.length === 0) {
      logStr = `${inputFile.name}\n`;
    } else {
      // Image not changed and has existing log file
      logStr = "";
    }
    return logStr;
  };

  const sendToApi = async () => {
    const data = new FormData();
    data.append("image", inputFile);
    // console.log(data.get("image"));

    await fetch(apiEndpoint, {
      method: "POST",
      mode: "cors",
      body: data,
    })
      .then((res) => res.blob())
      .then((imageBlob) => {
        // console.log("Image received..");
        setIsLoading(false);
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setOutputImageUrl(imageObjectURL);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCrop = async () => {
    if (!completedCrop) return;

    if (
      completedCrop.width &&
      completedCrop.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      // console.log("Preview in progress...");
      await canvasPreview(
        imgRef.current,
        previewCanvasRef.current,
        completedCrop
      );

      await previewCanvasRef.current.toBlob((blob) => {
        const imageObjectURL = URL.createObjectURL(blob);
        setOutputImageUrl(imageObjectURL);
        // console.log("Output image set...");
      });
    }
  };

  const handleRedaction = () => {
    // console.log("Redact...");
    redactCanvasRef.current.toBlob((blob) => {
      const imageObjectURL = URL.createObjectURL(blob);
      setOutputImageUrl(imageObjectURL);
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // if (inputFile !== null) setImageChanged(true); // For batch image processing log files

    // Check if the selected file is an image
    if (file && file.type.startsWith("image/")) {
      // Set the selected file and display a preview
      setInputFile(file);
      setInputFileName(file.name);
      // console.log(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setInputFile(null);
      setPreviewImage(null);
    }
  };

  const setOutputAsInput = () => {
    setInputFile(outputImageUrl);
    setPreviewImage(outputImageUrl);
    setPrevLogFile(currLogFile);
    setSameImage(false);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 lg:flex-row md:flex-col">
      <CropInputContext.Provider value={{ setCompletedCrop, imgRef }}>
        <RedactionInputContext.Provider value={{ redactCanvasRef }}>
          <ImageUploader
            taskOption={taskOption}
            handleClear={handleClear}
            handleChangeOption={handleChangeOption}
            handleSubmit={handleSubmit}
            handleFileChange={handleFileChange}
            previewImage={previewImage}
            hasNoRedactedArea={hasNoRedactedArea}
            setHasNoRedactedArea={setHasNoRedactedArea}
          />
        </RedactionInputContext.Provider>
      </CropInputContext.Provider>
      <ImageOutput
        inputFileName={inputFileName}
        outputImageUrl={outputImageUrl}
        isLoading={isLoading}
        taskOption={taskOption}
        previewCanvasRef={previewCanvasRef}
        setOutputAsInput={setOutputAsInput}
        currLogFile={currLogFile}
        // inputFile={inputFile}
      />
    </div>
  );
}

export default ImageProcessingUnit;
