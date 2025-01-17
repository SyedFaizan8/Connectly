import { useEffect, useRef, useState } from "react";

const useMediaStream = () => {
    const [state, setState] = useState<MediaStream | null>(null);
    const isStreamSet = useRef(false);

    useEffect(() => {
        if (isStreamSet.current) return;
        isStreamSet.current = true;

        (async function initStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true
                })
                console.log("setting a stream")
                setState(stream);
            } catch (error) {
                console.log("error in media navigator", error)
            }
        })()
    }, []);

    return { stream: state }
}

export default useMediaStream;