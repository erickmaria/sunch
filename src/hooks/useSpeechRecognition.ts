import { useMemo, useState } from "react";

interface OptionSpeechRecognition {
    lang?: string
}

export function useSpeechRecognition({ lang }: OptionSpeechRecognition) {

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState<string>('')
    const [hasError, setHasError] = useState<string>('')

    const recognition = useMemo(() => {
        
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        if (!recognition) {
            return null
        }
        if (lang) {
            recognition.lang = lang;
        }

        recognition.onstart = () => {
            setIsListening(true);
        }

        recognition.onend = () => {
            setIsListening(false);
        }

        recognition.onerror = (event: any) => {
            setHasError('SpeechRecognition error: '+ event.error)
        }

        recognition.onresult = (event: any) => {
            const speechResult = event.results[0][0].transcript;
            setTranscript(speechResult);
        }

        return recognition
    }, [])


    const startRecording = () => recognition.start()

    const stopRecording = () => recognition.stop()
    
    
    return {
        isListening,
        startRecording,
        stopRecording,
        hasError,
        transcript
    }

}