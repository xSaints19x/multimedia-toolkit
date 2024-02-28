import React, { useEffect, useState } from "react";
import { Button, Fade, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { CustomizedMenus } from "@/components/componentFile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { SrtIcon } from "@/icons/iconFile";
import { getFileNameWithoutExtension } from "@/utils/helperMethods";

export default function AudioOutput({
  isLoading,
  transcriptText,
  subtitleUri,
  currLogFile,
  inputFile
}) {
  const handleSave = (format) => {
    const fileData = JSON.stringify(transcriptText);
    let filename = "output.";
    let fileUri;

    switch (format) {
      case "SRT":
        // TODO: Error handling if subtitle uri is empty
        fileUri = subtitleUri;
        filename += "srt";
        break;
      case "TXT":
      default:
        const file = new Blob([fileData], { type: "text/plain" });
        fileUri = URL.createObjectURL(file);
        filename += "txt";
    }

    downloadFile(fileUri, filename);
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

  const textOptions = [
    { format: "TXT", icon: <TextSnippetIcon /> },
    { format: "SRT", icon: <SrtIcon /> },
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
    downloadFile(logFileURL, `${inputFileName}_audio_log.txt`);
  };

  return (
    <div className="flex-1">
      <div className="flex flex-col p-4 gap-2 rounded-2xl bg-gray-100">
        <div className="font-medium mb-1.5">Output</div>
        <div className="w-full flex justify-center items-center max-h-80 mt-1">
          {transcriptText === null ? (
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
                "Output Here"
              )}
            </div>
          ) : (
            <div className="flex h-80 w-full my-1 bg-white text-gray-400 justify-center text-xl text-center overflow-auto">
              <div className="sm:mx-0.5 md:mx-1 lg:mx-2 mt-4">{transcriptText}</div>
            </div>
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
        <CustomizedMenus
          options={textOptions}
          output={transcriptText}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
}
