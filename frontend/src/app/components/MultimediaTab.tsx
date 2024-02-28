"use client";

import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";

export default function MultimediaTab(): JSX.Element {
  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="multimedia-nav-tabs"
    >
      <Tab icon={<ImageIcon />} label="IMAGE" />
      <Tab icon={<AudioFileIcon />} label="AUDIO" />
      <Tab icon={<VideocamIcon />} label="VIDEO" />
    </Tabs>
  );
}

