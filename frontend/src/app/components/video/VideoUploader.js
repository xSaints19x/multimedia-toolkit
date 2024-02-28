import React, { useEffect, useRef, useState } from "react";
import {
  InputActionButtons,
  EnhancementOptions,
} from "@/components/componentFile";
import {
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

export default function VideoUploader({
  videoFile,
  videoPreview,
  handleFileChange,
  handleClear,
  handleSubmit,
  taskOption,
  handleChangeOption,
  currFormat,
  targetFormat,
  handleChangeTargetFormat,
}) {
  // Used to click on the hidden upload button
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  // Disable the submit and clear image if video is null
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    if (videoPreview) setIsDisabled(false);
    else setIsDisabled(true);
  }, [videoPreview]);

  const videoRef = useRef(null);

  // Video Enhancement Options
  const videoEnhancementOptions = [
    { value: 1, label: "Convert Format" },
    { value: 2, label: "Summarization" },
  ];

  const videoFormatOptions = [
    { value: "avi", label: "AVI" },
    { value: "flv", label: "FLV" },
    { value: "mkv", label: "MKV" },
    { value: "mov", label: "MOV" },
    { value: "mp4", label: "MP4" },
    { value: "ogg", label: "OGG" },
    { value: "webm", label: "WEBM" },
    { value: "wmv", label: "WMV" },
  ];

  const supportedHtml5VideoFormats = ["mp4", "ogg", "webm"];

  // Video Format
  // const handleFormat = () => {
  //   // console.log(videoFile);
  //   console.log(getFileExtensionType(videoFile.name));
  // };

  return (
    <div className="flex-1">
      <div className="flex flex-col p-4 gap-2 rounded-2xl bg-gray-100">
        <div className="font-medium mb-1.5">Input Video</div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp4, .mov, .avi, .wmv, .flv, .webm, .ogg, .mkv"
          // accept=".mp4, .webm, .ogg"
          onClick={(event) => {
            // Clear input so that uploading same file works
            event.target.value = null;
          }}
          onChange={handleFileChange}
          className="mb-4 cursor-pointer hidden"
        />
        <div className="w-full flex justify-center items-center h-80 mt-1 mb-4 ">
          {videoPreview === null ? (
            <div
              className="flex h-80 w-full border-gray-300 border-8 border-dashed text-gray-400 justify-center items-center text-3xl cursor-pointer"
              onClick={handleClick}
            >
              Click to Upload Video Here
            </div>
          ) : (
            // Render Video using HTML5 Video Player, don't render video if not supported by HTML5
            <div className="flex h-80 w-full justify-center items-center bg-gray-300">
              {/* <video
                ref={videoRef}
                src={videoPreview}
                controls
                controlsList="nodownload"
                // className="w-auto h-80"
                className="w-full h-80"
                // width={320}
                // height={320}
              /> */}
              {supportedHtml5VideoFormats.includes(currFormat) ? (
                <video
                  ref={videoRef}
                  src={videoPreview}
                  controls
                  controlsList="nodownload"
                  // className="w-auto h-80"
                  className="w-full h-80"
                  // width={320}
                  // height={320}
                />
              ) : (
                <div className="text-xl text-center">{videoFile.name}</div>
              )}
            </div>
          )}
        </div>
        <EnhancementOptions
          taskOption={taskOption}
          handleChangeOption={handleChangeOption}
          formOptions={videoEnhancementOptions}
        />
        {taskOption === 1 ? (
          <div className="flex flex-row">
            <FormControl sx={{ fontWeight: 600, minWidth: 100 }}>
              <InputLabel id="demo-simple-select-readonly-label">
                Format
              </InputLabel>
              <Select
                labelId="demo-simple-select-readonly-label"
                id="demo-simple-select-readonly"
                value={currFormat}
                label="format"
                inputProps={{ readOnly: true, IconComponent: () => null }} // IconComponent to remove arrow down
              >
                {videoFormatOptions
                  .filter((option) => option.value === currFormat)
                  .map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <div className="m-4">to</div>
            <FormControl sx={{ fontWeight: 600, minWidth: 100 }}>
              <InputLabel id="video-format-label">Format</InputLabel>
              <Select
                labelId="video-format-label"
                id="video-format"
                disabled={isDisabled}
                value={targetFormat}
                onChange={handleChangeTargetFormat}
                autoWidth
                label="Format"
                // input={<OutlinedInput label="Hello" />}
                // defaultValue={"MP4"} // Default value is format of video given
              >
                {videoFormatOptions
                  .filter((option) => option.value !== currFormat)
                  .map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        ) : (
          <></>
        )}
      </div>
      <InputActionButtons
        handleClear={handleClear}
        handleSubmit={handleSubmit}
        isDisabled={isDisabled}
        mediaType="video"
      />
    </div>
  );
}
