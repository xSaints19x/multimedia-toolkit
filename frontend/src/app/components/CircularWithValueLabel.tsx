import * as React from "react";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface CircularProgressWithLabelProps extends CircularProgressProps {
  value: number;
  progressMessage: string;
}

function CircularProgressWithLabel(props: CircularProgressWithLabelProps) {
  const { value, progressMessage, ...otherProps } = props;

  return (
    <div className="flex flex-row gap-4">
      <div className="flex justify-center items-center">
        <Typography variant="body1" color="primary">
          {progressMessage}
        </Typography>
      </div>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" value={value} {...otherProps} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
          >{`${Math.round(value)}%`}</Typography>
        </Box>
      </Box>
    </div>
  );
}

interface CircularWithValueLabelProps {
  progressValue: number;
  progressMessage: string;
}

export default function CircularWithValueLabel(
  props: CircularWithValueLabelProps
) {
  const { progressValue, progressMessage } = props;

  return (
    <CircularProgressWithLabel
      value={progressValue}
      progressMessage={progressMessage}
    />
  );
}
