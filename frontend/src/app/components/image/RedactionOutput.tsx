import React from "react";

interface RedactionOutputProps {
  outputImageUrl: string;
}

const RedactionOutput: React.FC<RedactionOutputProps> = ({ outputImageUrl }) => {
  return (
    <div className="flex h-80 w-full justify-center items-center bg-gray-200">
      <img
        src={outputImageUrl}
        className="h-80 w-full object-contain bg-gray-200"
        alt="Redaction Output"
      />
    </div>
  );
};

export default RedactionOutput;

