import { useEffect, useRef, useState } from "react";

export function useVoiceRecorder() {

    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState<string | undefined>();
    const recorderRef = useRef<MediaRecorder | null>(null);

    useEffect(() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("getUserMedia not supported on this browser");
        }
    }, []);

    const startRecording = async () => {

        if (!isRecording) {
            setIsRecording(true)
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    const recorder = new MediaRecorder(stream);
                    recorderRef.current = recorder;
                    recorder.start();
                })
                .catch((error) => {
                    console.error("Error getting user media:", error);
                })
        }

    }
    const stopRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            if (recorderRef.current) {
                recorderRef.current.stop()
                recorderRef.current.ondataavailable = (e) => {
                    setAudioURL(URL.createObjectURL(e.data));
                }
            }
        }
    }

    return {
        isRecording,
        startRecording,
        stopRecording,
        audioURL,
    }
}