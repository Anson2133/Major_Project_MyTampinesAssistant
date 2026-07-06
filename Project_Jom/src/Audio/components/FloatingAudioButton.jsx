import { Volume2, VolumeX, Hand } from "lucide-react";

export default function FloatingAudioButton({ isReadMode, toggleReadMode }) {
    return (
        <button
            onClick={toggleReadMode}
            style={{
                position: "fixed",
                bottom: "32px",
                right: "32px",
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: isReadMode ? "#ef4444" : "#2563eb", // Red when active, Blue when inactive
                color: "white",
                border: "none",
                boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 9999, // Ensures it sits above EVERYTHING
                transition: "all 0.3s ease",
                transform: isReadMode ? "scale(1.1)" : "scale(1)" // Slight pop effect when activated
            }}
            title={isReadMode ? "Turn off Read Aloud" : "Turn on Read Aloud"}
        >
            {isReadMode ? <VolumeX size={32} /> : <Volume2 size={32} />}
            <span style={{ fontSize: "12px", fontWeight: "bold", marginTop: "4px" }}>
                {isReadMode ? "STOP" : "READ"}
            </span>
        </button>
    );
}