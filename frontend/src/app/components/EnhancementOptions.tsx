import React from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

interface FormOptions {
  value: number;
  label: string;
}

interface EnhancementOptionsProps {
  taskOption: number;
  handleChangeOption: () => void;
  formOptions: FormOptions[];
}

const EnhancementOptions: React.FC<EnhancementOptionsProps> = ({
  taskOption,
  handleChangeOption,
  formOptions,
}) => {
  return (
    <div>
      <FormControl>
        <FormLabel
          id="task-button-group"
          sx={{ fontWeight: 600 }}
          focused={false}
        >
          Enhancement
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="task-button-group"
          name="controlled-task-buttons-group"
          value={taskOption}
          onChange={handleChangeOption}
        >
          {formOptions.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio />}
              label={option.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default EnhancementOptions;
