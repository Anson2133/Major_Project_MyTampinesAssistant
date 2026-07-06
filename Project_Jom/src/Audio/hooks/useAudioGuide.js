import { useState, useEffect } from "react";

export default function useAudioGuide() {
    const [activeAudioId, setActiveAudioId] = useState(null);
    const [isReadMode, setIsReadMode] = useState(false); // NEW: Tracks the global mode

    const toggleReadMode = () => {
        setIsReadMode((prev) => {
            const newMode = !prev;
            // If we are turning Read Mode off, immediately stop all talking
            if (!newMode && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                setActiveAudioId(null);
            }
            return newMode;
        });
    };

    const handleSpeak = (textToRead, id) => {
        if (!("speechSynthesis" in window)) {
            alert("Text-to-speech is not supported in your browser.");
            return;
        }

        if (activeAudioId === id) {
            window.speechSynthesis.cancel();
            setActiveAudioId(null);
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onend = () => setActiveAudioId(null);
        utterance.onerror = () => setActiveAudioId(null);

        window.speechSynthesis.speak(utterance);
        setActiveAudioId(id);
    };

    useEffect(() => {
        return () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
        };
    }, []);

    return { activeAudioId, handleSpeak, isReadMode, toggleReadMode };
}