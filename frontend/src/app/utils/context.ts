// Contexts
import { createContext } from "react";
import { PixelCrop } from 'react-image-crop';

interface CropInputProviderProps {
  setCompletedCrop: React.Dispatch<React.SetStateAction<PixelCrop | null>>;
  imgRef: React.RefObject<HTMLImageElement>;
}

interface RedactionInputProviderProps {
  redactCanvasRef: React.RefObject<HTMLCanvasElement>;
}

export const CropInputContext = createContext<CropInputProviderProps>({
  setCompletedCrop: () => {},
  imgRef: { current: null },
});
export const RedactionInputContext = createContext<RedactionInputProviderProps>({
    redactCanvasRef: { current: null },
  }
);
