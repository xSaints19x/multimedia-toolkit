import React, { useState, useContext, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  Crop
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { CropInputContext } from "@/utils/context";

interface CropInputProps {
  previewImage: string | undefined;
}

export default function CropInput({previewImage}: CropInputProps) {
  const [crop, setCrop] = useState<Crop>();
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);
  const { setCompletedCrop, imgRef } = useContext(CropInputContext);

  function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight
      ),
      mediaWidth,
      mediaHeight
    );
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
      console.log(imgRef);
    }
  }

  useEffect(() => {
    if (!previewImage) setCompletedCrop(null);
    // console.log(previewImage);
  }, [previewImage]);

  return (
    <ReactCrop
      // className="flex h-full w-full justify-center items-center"
      crop={crop}
      onChange={(newCrop) => setCrop(newCrop)}
      onComplete={(c) => setCompletedCrop(c)}
    >
      <div className="flex h-full w-full">
        <img
          ref={imgRef}
          src={previewImage}
          className="max-h-80 w-full object-contain bg-gray-200"
          onLoad={onImageLoad}
        />
      </div>
    </ReactCrop>
  );
}
