import React, { useEffect, useRef } from "react";
import BGMusicTrack from "../assets/sounds/bg-music.mp3";

const BGMusic = () => {
  const bgMusicRef = useRef(null);

  useEffect(() => {
    const bgMusic = bgMusicRef.current;

    if (bgMusic) {
      bgMusic.play().catch(function (error) {
        // If autoplay is blocked, use a user interaction to start the music
        console.log(
          "Autoplay was blocked, user interaction is required to start music."
        );
      });
    }
  }, []);

  return (
    <audio id="bg-music" ref={bgMusicRef} loop>
      <source src={BGMusicTrack} type="audio/mp3" />
    </audio>
  );
};

export default BGMusic;
