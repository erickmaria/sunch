import { useCallback, useRef, useState } from 'react';

type RecordingStatus = "IDLE" | "STOP" | "START" | "ERROR";

export const useVoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [status, setStatus] = useState<RecordingStatus>('IDLE');
    const [audioBase64, setAudioBase64] = useState<string | null>(null);
    const [error, setError] = useState<unknown>();


    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const silenceStartRef = useRef<number | null>(null);

    const SILENCE_THRESHOLD = 0.02;
    const MAX_SILENCE_MS = 2000;

    const detectSilence = useCallback(() => {
        const analyser = analyserRef.current;
        if (!analyser) return;

        const data = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(data);

        let sumSquares = 0;
        for (let i = 0; i < data.length; i++) {
            const normalized = (data[i] - 128) / 128;
            sumSquares += normalized * normalized;
        }

        const rms = Math.sqrt(sumSquares / data.length);
        const now = Date.now();

        console.log(rms)
        if (rms < SILENCE_THRESHOLD) {
            if (!silenceStartRef.current) silenceStartRef.current = now;
            if (now - silenceStartRef.current > MAX_SILENCE_MS) {
                stopRecording();
                return;
            }
        } else {
            silenceStartRef.current = null;
        }

        requestAnimationFrame(detectSilence);
    }, []);

    const blobToBase64 = (blob: Blob): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                if (typeof base64 === 'string') {
                    resolve(base64);
                } else {
                    reject('Failed to convert to base64');
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

                setAudioUrl(URL.createObjectURL(audioBlob));

                try {
                    const base64 = await blobToBase64(audioBlob);
                    setAudioBase64(base64);

                    // window.system.saveAudioBlob({ base64, filename: 'recording.webm' });
                } catch (err) {
                    console.error('Base64 conversion failed', err);
                    setStatus('ERROR');
                    setError(err)
                }

                setStatus('STOP');
            };

            mediaRecorder.start();
            setIsRecording(true);
            setStatus('START');

            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;

            source.connect(analyser);
            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            detectSilence();
        } catch (err) {
            console.error('Error starting recording:', err);
            setError(err)
            setStatus('ERROR');
        }
    }, [detectSilence]);

    const stopRecording = useCallback(() => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        analyserRef.current = null;
        silenceStartRef.current = null;
    }, []);

    return {
        isRecording,
        audioUrl,
        status,
        error,
        audioBase64,
        // audioByte,
        startRecording,
        stopRecording,
    };
};
