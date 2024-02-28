import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { Button } from "@mui/material";

interface InputActionButtonsProps {
  handleClear: () => void;
  handleSubmit: () => void;
  isDisabled: boolean;
  mediaType: string;
}

const InputActionButtons: React.FC<InputActionButtonsProps> = ({
  handleClear,
  handleSubmit,
  isDisabled,
  mediaType
}) => {
  return (
    <div className="flex gap-4 my-4">
      <Button
        variant="contained"
        size="large"
        startIcon={<DeleteIcon />}
        onClick={handleClear}
        disabled={isDisabled}
      >
        Clear {mediaType}
      </Button>
      <Button
        variant="contained"
        size="large"
        startIcon={<SendIcon />}
        onClick={handleSubmit}
        disabled={isDisabled}
      >
        Process {mediaType}
      </Button>
    </div>
  );
};

export default InputActionButtons;
