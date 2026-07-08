import React, { useState } from "react";
import { Volume2, Loader2, Square } from "lucide-react";
import toast from "react-hot-toast";

export default function CulturalVoiceAssistant({
    originalText = "Hello, how can I help you book a facility today?",
    targetLang = "ms" // Defaults to Malay, but we can pass 'zh-CN' or 'ta' from your langMap
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [translatedText, setTranslatedText] = useState("");

    // Map your existing language codes to BCP-47 tags for the browser's TTS engine
    const voiceMap = {
        "en": "en-SG",   // Singapore English
        "ms": "ms-MY",   // Malay
        "zh-CN": "zh-CN", // Mandarin Chinese
        "ta": "ta-IN"    // Tamil
    };

    const languageNames = {
        "en": "English",
        "ms": "Malay",
        "zh-CN": "Mandarin",
        "ta": "Tamil"
    };

    const handleTranslateAndSpeak = async () => {
        // If it's already playing, this button acts as a stop button
        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        setIsLoading(true);
        let finalSpeechText = originalText;

        try {
            // 1. Fetch Culturally Accurate Translation from SEA-LION
            // We only call the API if the target isn't English to save time
            if (targetLang !== "en") {
                const response = await fetch("https://api.sea-lion.ai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${import.meta.env.VITE_SEALION_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "aisingapore/Gemma-SEA-LION-v4-27B-IT", // The optimized 27B model
                        messages: [
                            {
                                role: "system",
                                content: `You are a helpful assistant for Singaporean residents. Translate the following text into natural, conversational ${languageNames[targetLang]}. Do not include any other text, just the direct translation.`
                            },
                            { role: "user", content: originalText }
                        ]
                    })
                });

                if (!response.ok) throw new Error("Translation failed");

                const data = await response.json();
                finalSpeechText = data.choices[0].message.content;
                setTranslatedText(finalSpeechText);
            }

            // 2. Play the Text using Browser Native Audio
            playNativeAudio(finalSpeechText, voiceMap[targetLang]);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load audio translation.");
            setIsLoading(false);
        }
    };

    const playNativeAudio = (text, langTag) => {
        if ("speechSynthesis" in window) {
            // Cancel any currently playing audio so they don't overlap
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = langTag || "en-SG";
            utterance.rate = 0.9; // Slightly slower for elderly residents

            utterance.onstart = () => {
                setIsLoading(false);
                setIsPlaying(true);
            };

            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => {
                setIsPlaying(false);
                setIsLoading(false);
            };

            window.speechSynthesis.speak(utterance);
        } else {
            toast.error("Your browser does not support audio playback.");
            setIsLoading(false);
        }
    };

    return (
        <div className="voice-assistant-wrapper" style={{ marginTop: '10px' }}>
            <button
                onClick={handleTranslateAndSpeak}
                disabled={isLoading}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    width: '100%', padding: '10px',
                    backgroundColor: isPlaying ? '#fef3c7' : '#f3f4f6',
                    color: isPlaying ? '#d97706' : '#374151',
                    border: `1px solid ${isPlaying ? '#fcd34d' : '#e5e7eb'}`,
                    borderRadius: '8px', cursor: 'pointer', fontWeight: '500', transition: '0.2s'
                }}
            >
                {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : isPlaying ? (
                    <Square size={16} fill="currentColor" />
                ) : (
                    <Volume2 size={16} />
                )}

                {isLoading
                    ? "Translating..."
                    : isPlaying
                        ? "Stop Audio"
                        : `Listen in ${languageNames[targetLang]}`}
            </button>

            {/* Optional: Show the translated text below the button for accessibility */}
            {translatedText && !isPlaying && targetLang !== "en" && (
                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '8px', fontStyle: 'italic' }}>
                    "{translatedText}"
                </p>
            )}
        </div>
    );
}