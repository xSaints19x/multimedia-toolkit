import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const formWaveSurferOptions = (ref) => ({
  barWidth: 3,
  container: ref,
  height: 80,
  progressColor: "#2D5BFF",
  responsive: true,
  waveColor: "#EFEFEF",
  cursorWidth: 1,
  cursorColor: "#000",
  /** Automatically scroll the container to keep the current position in viewport */
  autoScroll: true,
  /** If autoScroll is enabled, keep the cursor in the center of the waveform during playback */
  autoCenter: true,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
  interact: false,
});


// Could be updated in future to include the typescript version of wavesurfer
export default function Waveform({ audioPreview }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const audioRef = useRef(null);

  // Create new WaveSurfer instance
  // On component mount and when audio changes
  useEffect(() => {
    // if (!waveformRef.current) return;
    // setIsPlaying(false);
    // console.log(audioPreview);
    // console.log(wavesurfer.current);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.load(audioPreview);

    wavesurfer.current.on("ready", function () {
      // console.log("Ready!");
      wavesurfer.current.setMute(true); // Mute audio loaded for wavesurfer to avoid duplicate sounds
    });

    // console.log("Finished Loading!!");
    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy();
  }, [audioPreview]);

  const handlePlayPause = () => {
    // Reset audio and wavesurfer if audio ends
    if (wavesurfer.current.getDuration() === wavesurfer.current.getCurrentTime()) {
      resetAudio();
    }
    wavesurfer.current.playPause();
    // console.log(wavesurfer.current.getVolume());
    // console.log(wavesurfer.current.getCurrentTime());
    // console.log(wavesurfer.current.getDuration());
    // console.log(wavesurfer.current.getMute());
    // console.log(wavesurfer.current.toggleMute());
  };

  // Handle change of time
  const handleSeeking = () => {
    wavesurfer.current.setCurrentTime(audioRef.current.currentTime);
  };

  const handleEnded = () => {
    wavesurfer.current.pause();
    resetAudio();
  };

  const resetAudio = () => {
    wavesurfer.current.setCurrentTime(0);
    audioRef.current.currentTime = 0;
  }

  return (
    <div className="flex h-80 w-full">
      <div className="flex flex-col h-80 w-full justify-center items-center bg-white">
        <div ref={waveformRef} className="w-11/12" />
        <audio
          ref={audioRef}
          src={audioPreview}
          controls
          controlsList="nodownload"
          className="w-11/12"
          onPlay={handlePlayPause}
          onPause={handlePlayPause}
          onSeeking={handleSeeking}
          onEnded={handleEnded}
        />
      </div>
    </div>
  );
}
