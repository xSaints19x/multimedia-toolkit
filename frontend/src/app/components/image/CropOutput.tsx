import React from "react";

interface CropOutputProps {
  outputImageUrl: string;
}

const CropOutput: React.FC<CropOutputProps> = ({ outputImageUrl }) => {
  return (
    <div className="flex h-80 w-full justify-center items-center bg-gray-200">
      <img
        src={outputImageUrl}
        className="max-h-80 w-full object-contain bg-gray-200"
        alt="Crop Output"
      />
    </div>
  );
};

export default CropOutput;
