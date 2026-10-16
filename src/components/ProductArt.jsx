import React from "react";

const VIDEOS = {
  ai: "../assets/misai-ai-video.mp4",
  platform: "../assets/misai-platform-video.mp4",
  analytics: "../assets/misai-analytics-video.mp4",
  studio: "../assets/misai-studio-video.mp4",
};

export default function ProductArt({ variant }) {
  const video = VIDEOS[variant] || VIDEOS.ai;

  return (
    <div className="art product-video-art" aria-hidden="true">
      <video
        key={video}
        className="product-art-video"
        src={video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    </div>
  );
}