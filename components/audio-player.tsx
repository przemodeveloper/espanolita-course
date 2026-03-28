"use client";

import H5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { TaskLabel } from "./task-label";

export default function AudioPlayer({ url }: { url: string }) {
  return (
    <div className="border border-orange-500 bg-orange-50 p-4 rounded-lg">
      <TaskLabel label="Nagranie" className="mb-2" />
      <H5AudioPlayer
        src={url}
        preload="metadata"
        layout="horizontal"
        autoPlayAfterSrcChange={false}
        showJumpControls={false}
        className="rounded-lg border border-gray-200 !bg-background shadow-none"
      />
    </div>
  );
}
