import React, { useContext, useEffect, useRef, useState } from "react";
import { RedactionInputContext } from "@/utils/context";

interface RedactionInputProps {
  isRemoveBlur: boolean;
  setIsRemoveBlur: React.Dispatch<React.SetStateAction<boolean>>;
  previewImage: string;
  hasNoRedactedArea: boolean;
  setHasNoRedactedArea: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RedactionInput({
  isRemoveBlur,
  setIsRemoveBlur,
  previewImage,
  hasNoRedactedArea,
  setHasNoRedactedArea,
}: RedactionInputProps) {
  const { redactCanvasRef } = useContext(RedactionInputContext);
  const divRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const [isBlur, setIsBlur] = useState<boolean>(false);

  useEffect(() => {
    drawImage();
  }, [previewImage]);

  useEffect(() => {
    if (!isRemoveBlur) return;

    handleClear();
    setIsRemoveBlur(false);
  }, [isRemoveBlur]);

  const drawImage = () => {
    console.log(redactCanvasRef);
    if (!redactCanvasRef.current) return;
    const canvas = redactCanvasRef.current;
    const context = canvas?.getContext("2d");
    const image = new Image();
    if (!context) return;

    image.src = previewImage;
    image.onload = () => {
      if (divRef.current === null) return;
      const containerWidth = divRef.current.offsetWidth; // Width of the screen
      const containerHeight = 320; // Fixed height of the div

      const imageWidth = image.width;
      const imageHeight = image.height;

      const containerAspectRatio = containerWidth / containerHeight;
      const imageAspectRatio = imageWidth / imageHeight;

      let canvasWidth, canvasHeight;

      // Set image size so that it won't overflow
      if (imageAspectRatio > containerAspectRatio) {
        canvasWidth = containerWidth;
        canvasHeight = containerWidth / imageAspectRatio;
      } else {
        canvasWidth = containerHeight * imageAspectRatio;
        canvasHeight = containerHeight;
      }
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      context.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      contextRef.current = context;
    };
  };

  const startDrawingBlur = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    const canvas = redactCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    startX.current = (event.clientX - rect.left) * scaleX;
    startY.current = (event.clientY - rect.top) * scaleY;

    setIsDrawing(true);
  };

  const drawBlur = (event: any) => {
    if (!isDrawing) return;
    if (hasNoRedactedArea) setHasNoRedactedArea(false);

    event.preventDefault();
    event.stopPropagation();

    const canvas = redactCanvasRef.current;
    if (!canvas) return;
    if (!startX.current || !startY.current) return;
    if (!contextRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const newMouseX = (event.clientX - rect.left) * scaleX;
    const newMouseY = (event.clientY - rect.top) * scaleY;

    const rectWidth = newMouseX - startX.current;
    const rectHeight = newMouseY - startY.current;

    // console.log(
    //   `x: ${startX.current}, y: ${startY.current}, width: ${rectWidth}, height: ${rectHeight}`
    // );

    contextRef.current.filter = "blur(10px)";
    contextRef.current.fillRect(
      startX.current,
      startY.current,
      rectWidth,
      rectHeight
    );
  };

  const stopDrawingBlur = () => {
    setIsBlur(true);
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (!isBlur) return;

    setHasNoRedactedArea(true);
    drawImage();
    setIsBlur(false);
  };

  const handleTouchStart = (event: any) => {
    const canvas = redactCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // console.log(event.touches);
    // console.log(event.clientY);

    startX.current = (event.touches[0].clientX - rect.left) * scaleX;
    startY.current = (event.touches[0].clientY - rect.top) * scaleY;

    setIsDrawing(true);
    // console.log("Touched!");
  };

  const handleTouchMove = (event: any) => {
    if (!isDrawing) return;
    if (hasNoRedactedArea) setHasNoRedactedArea(false);

    const canvas = redactCanvasRef.current;
    if (!canvas) return;
    if (!startX.current || !startY.current) return;
    if (!contextRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const newMouseX = (event.touches[0].clientX - rect.left) * scaleX;
    const newMouseY = (event.touches[0].clientY - rect.top) * scaleY;

    const rectWidth = newMouseX - startX.current;
    const rectHeight = newMouseY - startY.current;

    contextRef.current.filter = "blur(10px)";
    contextRef.current.fillRect(
      startX.current,
      startY.current,
      rectWidth,
      rectHeight
    );
    // console.log("Moved!");
  };

  const handleTouchEnd = (event: any) => {
    setIsBlur(true);
    setIsDrawing(false);
    // console.log("Touch lifted!");
  };

  return (
    <div
      ref={divRef}
      className="flex h-80 w-full justify-center items-center bg-gray-200"
    >
      <canvas
        className="cursor-crosshair bg-gray-200"
        ref={redactCanvasRef}
        onMouseDown={startDrawingBlur}
        onMouseMove={drawBlur}
        onMouseUp={stopDrawingBlur}
        onMouseLeave={stopDrawingBlur}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}
