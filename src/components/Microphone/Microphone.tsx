import { Mic } from "lucide-react";
import './Microphone.css'
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { Dispatch, SetStateAction, useEffect } from "react";

interface MicrophoneProps {
    lang: string
    onErrorMessage: Dispatch<SetStateAction<string[]>>
    onTranscriptData: Dispatch<SetStateAction<string>>
    className: string | undefined 
}

export function Microphone({onErrorMessage, onTranscriptData, lang, className }: MicrophoneProps ) {
    const { isListening, startRecording, stopRecording, transcript, hasError } = useSpeechRecognition({lang: lang})

    useEffect(()=>{
        if(hasError){
            onErrorMessage([hasError])
        }

        if (transcript){
            onTranscriptData(transcript)
        }
    },[hasError, transcript])

    async function toogleRecording() {

        !isListening ? startRecording() : stopRecording()
    }

    return (
        <>
            <div onClick={toogleRecording} className={className} style={{
            color: 'var(--foreground-color)'
          }}>
                {isListening ? (
                    <div className='mic'>
                        <Mic size={20} className='mic-icon' />
                    </div>
                ) : <Mic size={20} />}
            </div>
        </>
    );
}