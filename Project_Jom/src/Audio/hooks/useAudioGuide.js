import { useState } from "react";
import toast from "react-hot-toast";

export default function useAudioGuide() {
    const [isReadMode, setIsReadMode] = useState(false);
    const [activeAudioId, setActiveAudioId] = useState(null);

    const toggleReadMode = () => {
        if (isReadMode) {
            window.speechSynthesis.cancel();
            setActiveAudioId(null);
        }
        setIsReadMode(!isReadMode);
    };

    const handleSpeak = async (id, textToRead) => {
        // 1. If Read Mode is off, do nothing (let the card act normally)
        if (!isReadMode) return;

        // 2. Stop any current audio and set the new active card ID (for highlighting)
        window.speechSynthesis.cancel();
        setActiveAudioId(id);

        // 3. Figure out the user's selected language
        const targetLang = localStorage.getItem("i18nextLng") || "en";
        let finalSpeechText = textToRead;

        // THE FIX: Added "zh-TW" and a generic "zh" fallback
        const voiceMap = {
            "en": "en-SG",
            "ms": "ms-MY",
            "zh-CN": "zh-CN",
            "zh-TW": "zh-TW", 
            "zh": "zh-CN",    
            "ta": "ta-IN"
        };

        const languageNames = {
            "en": "English",
            "ms": "Malay",
            "zh-CN": "Mandarin",
            "zh-TW": "Mandarin", 
            "zh": "Mandarin",    
            "ta": "Tamil"
        };

        try {
            // 4. Translate via SEA-LION if it's not English
            if (targetLang !== "en") {
                const toastId = toast.loading("Translating audio..."); // Show a loading state

                const response = await fetch("https://api.sea-lion.ai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${import.meta.env.VITE_SEALION_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "aisingapore/Gemma-SEA-LION-v4-27B-IT",
                        messages: [
                            {
                                role: "system",
                                content: `You are an accessibility assistant. Translate this directory/facility information into natural, spoken ${languageNames[targetLang]}. Keep it clear and concise for a listener.`
                            },
                            { role: "user", content: textToRead }
                        ]
                    })
                });

                if (!response.ok) throw new Error("Translation failed");

                const data = await response.json();
                finalSpeechText = data.choices[0].message.content;

                toast.dismiss(toastId); // Remove loading state
            }

            // 5. Play the translated audio natively
            const utterance = new SpeechSynthesisUtterance(finalSpeechText);
            utterance.lang = voiceMap[targetLang] || "en-SG";
            utterance.rate = 0.9;

            // When audio finishes, remove the highlight from the card
            utterance.onend = () => setActiveAudioId(null);
            utterance.onerror = () => setActiveAudioId(null);

            window.speechSynthesis.speak(utterance);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load audio translation.");
            setActiveAudioId(null);
        }
    };

    return { activeAudioId, handleSpeak, isReadMode, toggleReadMode };
}