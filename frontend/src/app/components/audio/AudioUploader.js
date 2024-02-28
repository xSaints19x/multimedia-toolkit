import React, { useEffect, useState, useRef } from "react";
import Waveform from "./Waveform";
import {
  InputActionButtons,
  EnhancementOptions,
} from "@/components/componentFile";

export default function AudioUploader({
  audioPreview,
  handleFileChange,
  handleClear,
  handleSubmit,
  taskOption,
  handleChangeOption,
}) {
  // Used to click on the hidden upload button
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  // Disable the submit and clear image if image is null
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    if (audioPreview) setIsDisabled(false);
    else setIsDisabled(true);
  }, [audioPreview]);

  // Audio Enhancement Options
  const audioEnhancementOptions = [
    { value: 1, label: "Transcribe Audio" },
    { value: 2, label: "De-noise" },
  ];

  return (
    <div className="flex-1">
      <div className="flex flex-col p-4 gap-2 rounded-2xl bg-gray-100">
        <div className="font-medium mb-1.5">Input Audio</div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".m4a, .mp3, mp4, .wav, .wma, .aac"
          onClick={(event) => {
            // Clear input so that uploading same file works
            event.target.value = null;
          }}
          onChange={handleFileChange}
          className="mb-4 cursor-pointer hidden"
        />
        <div className="w-full flex justify-center items-center h-80 mt-1 mb-4">
          {audioPreview === null ? (
            <div
              className="flex h-80 w-full border-gray-300 border-8 border-dashed text-gray-400 justify-center items-center text-3xl cursor-pointer"
              onClick={handleClick}
            >
              Click to Upload Audio Here
            </div>
          ) : (
            <Waveform
              audioPreview={audioPreview}
            />
          )}
        </div>
        <EnhancementOptions
          taskOption={taskOption}
          handleChangeOption={handleChangeOption}
          formOptions={audioEnhancementOptions}
        />
      </div>
      <InputActionButtons
        handleClear={handleClear}
        handleSubmit={handleSubmit}
        isDisabled={isDisabled}
        mediaType="audio"
      />
    </div>
  );
}
