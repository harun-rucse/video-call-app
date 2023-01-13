import { useEffect, useState } from "react";

export function useUserMedia() {
  const [mediaStream, setMediaStream] = useState(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true
      })
      .then((stream) => {
        setMediaStream(stream);
      })
      .catch((err) => console.error(err));
  }, []);

  return mediaStream;
}
