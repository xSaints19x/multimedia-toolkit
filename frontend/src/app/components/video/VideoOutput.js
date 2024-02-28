import React, { useEffect, useState } from "react";
import { Button, Fade, CircularProgress, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  CustomizedMenus,
  CircularWithValueLabel,
} from "@/components/componentFile";
import { getFileNameWithoutExtension } from "@/utils/helperMethods";

export default function VideoOutput({
  taskOption,
  currLogFile,
  inputFile,
  output,
  outputFileFormat,
  isLoading,
  progressMessage,
  videoConversionProgress,
}) {
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

  const videoOptions = [
    { format: `${outputFileFormat.toUpperCase()}`, icon: <InsertDriveFileIcon /> },
  ];

  // Disable download log file button when log file null
  const [isLogFileEmpty, setIsLogFileEmpty] = useState(true);
  useEffect(() => {
    if (currLogFile.length !== 0) setIsLogFileEmpty(false);
    else setIsLogFileEmpty(true);
  }, [currLogFile]);

  const handleDownloadLogFile = () => {
    const blob = new Blob([currLogFile.join("")], { type: "text/plain" });
    const logFileURL = URL.createObjectURL(blob);
    let inputFileName = getFileNameWithoutExtension(inputFile.name);
    downloadFile(logFileURL, `${inputFileName}_video_log.txt`);
  };

  // Disable download log file button when log file null
  const [isOutputEmpty, setIsOutputEmpty] = useState(true);
  useEffect(() => {
    if (output !== null) setIsOutputEmpty(false);
    else setIsOutputEmpty(true);
  }, [output]);

  const [inputFileNameWithoutExt, setInputFileNameWithoutExt] = useState("");

  useEffect(() => {
    if (inputFile === null) return;
    setInputFileNameWithoutExt(getFileNameWithoutExtension(inputFile.name));
  }, [inputFile]);

  const handleDownloadOutput = () => {
    console.log(output);
    if (!output) return;
    downloadFile(output, `${inputFileNameWithoutExt}.${outputFileFormat}`);
  };

  useEffect(() => {
    if (videoConversionProgress === 0) return;
    // console.log(videoConversionProgress);
  }, [videoConversionProgress]);

  return (
    <div className="flex-1">
      <div className="flex flex-col p-4 gap-2 rounded-2xl bg-gray-100">
        <div className="font-medium mb-1.5">Output</div>
        <div className="w-full flex justify-center items-center max-h-80 mt-1">
          {output === null ? (
            <div className="flex h-80 w-full border-gray-300 border-8 border-dashed text-gray-400 justify-center items-center text-3xl text-center">
              {isLoading && videoConversionProgress >= 0 ? (
                <CircularWithValueLabel
                  progressValue={videoConversionProgress}
                  progressMessage={progressMessage}
                />
              ) : isLoading ? (
                <Fade
                  in={isLoading}
                  style={{
                    transitionDelay: isLoading ? "800ms" : "0ms",
                  }}
                  unmountOnExit
                >
                  <div className="flex flex-row gap-4">
                    <div className="flex justify-center items-center">
                      <Typography variant="body1" color="primary">
                        {progressMessage}
                      </Typography>
                    </div>
                    <CircularProgress />
                  </div>
                </Fade>
              ) : (
                "Output Here"
              )}
            </div>
          ) : (
            // Render output here
            <Fade
              in={output !== null}
              // style={{
              //   transitionDelay: output !== null ? "500ms" : "0ms",
              // }}
              // unmountOnExit
            >
              <div className="flex h-80 w-full bg-gray-300 justify-center items-center text-xl text-center">
                <div>{`${inputFileNameWithoutExt}.${outputFileFormat}`}</div>
              </div>
            </Fade>
          )}
        </div>
      </div>
      <div className="flex gap-4 my-4 justify-end">
        <Button
          variant="contained"
          size="large"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadLogFile}
          disabled={isLogFileEmpty}
        >
          Download log file
        </Button>
        {/* <Button
          variant="contained"
          size="large"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadOutput}
          disabled={isOutputEmpty}
        >
          Download output
        </Button> */}
        <CustomizedMenus
          options={videoOptions}
          output={output}
          handleSave={handleDownloadOutput}
        />
      </div>
    </div>
  );
}
