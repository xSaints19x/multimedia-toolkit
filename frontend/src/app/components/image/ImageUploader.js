"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CropInput,
  RedactionInput,
  InputActionButtons,
  EnhancementOptions,
} from "@/components/componentFile";
import {
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function ImageUploader({
  taskOption,
  handleClear,
  handleChangeOption,
  handleSubmit,
  handleFileChange,
  previewImage,
  hasNoRedactedArea,
  setHasNoRedactedArea
}) {
  // Used to click on the hidden upload button
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  // Disable the submit and clear image if image is null
  const [isDisabled, setIsDisabled] = useState(true);
  useEffect(() => {
    setHasNoRedactedArea(true);
    if (previewImage) setIsDisabled(false);
    else setIsDisabled(true);
  }, [previewImage]);

  // Clear redaction from canvas
  const [isRemoveBlur, setIsRemoveBlur] = useState(false);
  const removeAllBlur = () => {
    setIsRemoveBlur(true);
  };

  // Disable clear redaction button if no areas redacted yet
  // const [hasNoRedactedArea, setHasNoRedactedArea] = useState(true);

  // Image Enhancement Options
  const imageEnhancementOptions = [
    { value: 1, label: "Deblurring" },
    { value: 2, label: "Low light" },
    { value: 3, label: "Crop" },
    { value: 4, label: "Redaction" },
  ];

  return (
    <>
      <div className="flex-1">
        <div className="flex p-4 flex-col gap-2 rounded-2xl bg-gray-100">
          <div className="font-medium mb-1.5">Input Image</div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onClick={(event) => {
              // Clear input so that uploading same file works
              event.target.value = null;
            }}
            onChange={handleFileChange}
            className="mb-4 cursor-pointer hidden"
          />
          <div className="w-full flex justify-center items-center max-h-80 mt-1 mb-4">
            {previewImage === null ? (
              <div
                className="flex h-80 w-full border-gray-300 border-8 border-dashed text-gray-400 justify-center items-center text-3xl cursor-pointer"
                onClick={handleClick}
              >
                Click to Upload Image Here
              </div>
            ) : taskOption === 1 || taskOption === 2 ? (
              <div className="flex h-80 w-full justify-center items-center">
                <img
                  alt="Input Image"
                  src={previewImage}
                  className="h-80 w-full object-contain bg-gray-200"
                />
              </div>
            ) : taskOption === 3 ? (
              <div className="flex h-80 w-full my-2 justify-center items-center bg-gray-200">
                <CropInput previewImage={previewImage} />
              </div>
            ) : (
              <RedactionInput
                isRemoveBlur={isRemoveBlur}
                setIsRemoveBlur={setIsRemoveBlur}
                previewImage={previewImage}
                hasNoRedactedArea={hasNoRedactedArea}
                setHasNoRedactedArea={setHasNoRedactedArea}
              />
            )}
          </div>
          <EnhancementOptions
            taskOption={taskOption}
            handleChangeOption={handleChangeOption}
            formOptions={imageEnhancementOptions}
          />
          {taskOption === 4 ? (
            <div>
              <Button
                variant="contained"
                size="medium"
                startIcon={<DeleteIcon />}
                onClick={removeAllBlur}
                disabled={hasNoRedactedArea}
              >
                Clear Redaction
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
        <InputActionButtons
          handleClear={handleClear}
          handleSubmit={handleSubmit}
          isDisabled={isDisabled}
          mediaType="image"
        />
      </div>
    </>
  );
}

export default ImageUploader;
