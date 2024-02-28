"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Tab, Tabs } from "@mui/material";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import ImageIcon from "@mui/icons-material/Image";
import VideocamIcon from "@mui/icons-material/Videocam";
import useSessionStorage from "@/utils/useSessionStorage";

const ImageProcessingUnit = dynamic(() => import("./image/ImageProcessingUnit"), {
  loading: () => <p>Loading...</p>,
});

const AudioProcessingUnit = dynamic(() => import("./audio/AudioProcessingUnit"), {
  loading: () => <p>Loading...</p>,
});

const VideoProcessingUnit = dynamic(() => import("./video/VideoProcessingUnit"), {
  loading: () => <p>Loading...</p>,
});

export default function MultimediaProcessor() {

  const [activeTab, setActiveTab] = useSessionStorage<number>("activeTab", 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="multimedia-nav-tabs"
        sx={{ marginBottom: "1rem", borderBottom: 2, borderColor: "grey.300" }}
      >
        <Tab icon={<ImageIcon />} label="IMAGE" />
        <Tab icon={<AudioFileIcon />} label="AUDIO" />
        <Tab icon={<VideocamIcon />} label="VIDEO" />
      </Tabs>
      {activeTab === 0 && <ImageProcessingUnit />}
      {activeTab === 1 && <AudioProcessingUnit />}
      {activeTab === 2 && <VideoProcessingUnit />}
    </div>
  );
}
