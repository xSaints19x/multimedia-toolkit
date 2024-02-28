"use client";

import React, { useEffect, useState } from "react";
import {
  Canvas,
  CropOutput,
  CustomizedMenus,
  RedactionOutput,
} from "@/components/componentFile";
import { Button, Fade, CircularProgress } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DownloadIcon from "@mui/icons-material/Download";
import { JpgIcon, PngIcon, WebpIcon } from "@/icons/iconFile";
import { getFileNameWithoutExtension } from "@/utils/helperMethods";

function ImageOutput({
  inputFileName,
  outputImageUrl,
  isLoading,
  taskOption,
  previewCanvasRef,
  setOutputAsInput,
  currLogFile,
  // inputFile,
}) {
  const handleSave = (fileType) => {
    // Assign file name based on file type
    let filename = "output.";
    switch (fileType) {
      case "JPG":
        filename += "jpg";
        break;
      case "WEBP":
        filename += "webp";
        break;
      case "PNG":
      default:
        filename += "png";
    }

    downloadFile(outputImageUrl, filename);
  };

  // Disable the use output as input and save buttons when output image null
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    if (outputImageUrl) setIsDisabled(false);
    else setIsDisabled(true);
  }, [outputImageUrl]);

  // Disable download log file button when log file null
  const [isLogFileEmpty, setIsLogFileEmpty] = useState(true);
  useEffect(() => {
    if (currLogFile.length !== 0) setIsLogFileEmpty(false);
    else setIsLogFileEmpty(true);
  }, [currLogFile]);

  // Image formats
  const imageOptions = [
    { format: "JPG", icon: <JpgIcon /> },
    { format: "PNG", icon: <PngIcon /> },
    { format: "WEBP", icon: <WebpIcon /> },
  ];

  const handleDownloadLogFile = () => {
    console.log(inputFileName);
    if (inputFileName === null) {
      return;
    }
    const blob = new Blob([currLogFile.join("")], { type: "text/plain" });
    const logFileURL = URL.createObjectURL(blob);
    let inputFileNameWithoutExt = getFileNameWithoutExtension(inputFileName);
    downloadFile(logFileURL, `${inputFileNameWithoutExt}_image_log.txt`);
  };

  const downloadFile = (fileUri, filename) => {
    // Create a temporary <a> element and set the necessary attributes
    const link = document.createElement("a");
    link.href = fileUri;
    link.setAttribute("download", filename);

    // Programmatically click the link to trigger the file download
    document.body.appendChild(link);
    link.click();

    // Clean up the temporary <a> element
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex-1">
        <div className="flex flex-col p-4 gap-2 rounded-2xl bg-gray-100">
          <div className="font-medium mb-1.5">Output Image</div>
          <div className="w-full flex justify-center items-center max-h-80 mt-1">
            {outputImageUrl === null ? (
              <div className="flex h-80 w-full border-gray-300 border-8 border-dashed text-gray-400 justify-center items-center text-3xl text-center">
                {isLoading ? (
                  <Fade
                    in={isLoading}
                    style={{
                      transitionDelay: isLoading ? "800ms" : "0ms",
                    }}
                    unmountOnExit
                  >
                    <CircularProgress />
                  </Fade>
                ) : (
                  "Output Image Here"
                )}
              </div>
            ) : taskOption === 1 || taskOption === 2 ? (
              <div className="flex h-80 w-full justify-center items-center">
                <img
                  src={outputImageUrl}
                  className="max-h-80 w-full object-contain bg-gray-200"
                />
              </div>
            ) : taskOption === 3 ? (
              <CropOutput outputImageUrl={outputImageUrl} />
            ) : taskOption == 4 ? (
              <RedactionOutput outputImageUrl={outputImageUrl} />
            ) : (
              <></>
            )}
            <Canvas refVariable={previewCanvasRef} />
          </div>
        </div>
        <div className="flex gap-4 my-4 justify-end">
          <Button
            variant="contained"
            size="large"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={setOutputAsInput}
            disabled={isDisabled}
          >
            Use output as input
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadLogFile}
            disabled={isLogFileEmpty}
          >
            Download log file
          </Button>
          <CustomizedMenus
            options={imageOptions}
            output={outputImageUrl}
            handleSave={handleSave}
          />
        </div>
      </div>
    </>
  );
}

export default ImageOutput;
