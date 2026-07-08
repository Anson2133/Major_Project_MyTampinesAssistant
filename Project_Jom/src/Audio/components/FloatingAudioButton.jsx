import React from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function FloatingAudioButton({ isReadMode, toggleReadMode }) {
    return (
        <button
            onClick={toggleReadMode}
            className={`floating-audio-btn ${isReadMode ? "active" : ""}`}
            style={{
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: isReadMode ? '#ef4444' : '#2563eb', // Red when active, Blue when off
                color: 'white',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 9999,
                transition: '0.3s'
            }}
        >
            {isReadMode ? <VolumeX size={24} /> : <Volume2 size={24} />}
            <span style={{ fontSize: '10px', marginTop: '4px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                {isReadMode ? "STOP" : "READ"}
            </span>
        </button>
    );
}