import React, { RefObject } from "react";

interface CanvasProps {
  refVariable: RefObject<HTMLCanvasElement> | null;
}

const Canvas: React.FC<CanvasProps> = ({ refVariable }) => {
  return (
    <canvas
      className="hidden max-h-80 w-full"
      ref={refVariable}
      style={{
        objectFit: "contain",
      }}
    />
  );
};

export default Canvas;
