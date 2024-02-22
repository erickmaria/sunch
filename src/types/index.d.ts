export {};

declare global {
  interface Window {
    webkitSpeechRecognition : webkitSpeechRecognition
    SpeechRecognition: SpeechRecognition
  }
}