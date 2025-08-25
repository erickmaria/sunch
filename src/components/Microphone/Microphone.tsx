import { Mic } from "lucide-react";
import './Microphone.css'
import { Dispatch, SetStateAction, useEffect } from "react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

interface MicrophoneProps {
    lang: string
    onError: Dispatch<SetStateAction<string[]>>
    audioData: Dispatch<SetStateAction<string>>
    className: string | undefined
}

export function Microphone({audioData, onError, className }: MicrophoneProps) {
    const { isRecording, startRecording, stopRecording, status, audioBase64, error } = useVoiceRecorder()
    
    useEffect(() => {

        switch(status){
            case "START":
                break;
            case "STOP":
                audioData(audioBase64 || "")
                break;
            case "ERROR":
                onError([error as unknown as string])
                break;
        }
    }, [status])

    async function toogleRecording() {

        !isRecording ? startRecording() : stopRecording()
    }

    return (
        <>
            <div onClick={toogleRecording} className={className}>
                {isRecording ? (
                    <div className='mic'>
                        <Mic size={20} className='mic-icon' />
                    </div>
                ) : <Mic size={20} />}
            </div>
        </>
    );
}