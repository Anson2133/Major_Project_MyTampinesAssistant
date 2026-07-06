import {
  Building2,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  Phone,
  Search
} from "lucide-react"; // Removed Volume2 and VolumeX imports
import { useNavigate } from "react-router";

export default function HelpDirectory({
  categories,
  directory,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  openDirectoryId,
  toggleDirectoryItem,
  clearSearch,
  showIcons,
  isColorCoded,
  activeAudioId,
  onSpeak,
  isReadMode // NEW PROP: We pass the mode down
}) {
  const navigate = useNavigate();

  const getCategoryIcon = (category) => {
    if (!showIcons || !category) return "";
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes("financial")) return "💰 ";
    if (lowerCat.includes("health")) return "🏥 ";
    if (lowerCat.includes("booking") || lowerCat.includes("facility")) return "📅 ";
    if (lowerCat.includes("community")) return "🏘️ ";
    if (lowerCat.includes("employ") || lowerCat.includes("skill")) return "💼 ";
    if (lowerCat.includes("education") || lowerCat.includes("school")) return "🎓 ";
    if (lowerCat.includes("elderly") || lowerCat.includes("senior")) return "🧓 ";
    if (lowerCat.includes("access") || lowerCat.includes("disability")) return "♿ ";
    return "🔹 ";
  };

  const getColorClass = (category) => {
    if (!isColorCoded || !category) return "";
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes("financial")) return "color-green";
    if (lowerCat.includes("health")) return "color-red";
    if (lowerCat.includes("community") || lowerCat.includes("booking")) return "color-blue";
    if (lowerCat.includes("employ") || lowerCat.includes("education")) return "color-yellow";
    return "color-purple";
  };

  const formatPhoneForSpeech = (phoneText) => {
    if (!phoneText) return "";
    if (/[a-zA-Z]/.test(phoneText.toString())) {
      return phoneText;
    }
    return phoneText.toString().split('').join(' ');
  };

  return (
    <section className="help-directory-section">
      <div className="help-section-header">
        <div>
          <span className="help-section-kicker">Directory</span>
          <h2>Search Phone Directory</h2>
          <p>
            Search by issue, agency, service, or keyword. For example: “bulky
            item”, “scam”, “CHAS”, “childcare”, or “senior”.
          </p>
        </div>
      </div>

      <div className="help-search-panel">
        <div className="help-search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search contacts, issues, services..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="help-category-pills">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`help-category-pill ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="help-results-summary">
        Showing <strong>{directory.length}</strong> result
        {directory.length === 1 ? "" : "s"}
      </div>

      {directory.length === 0 ? (
        <div className="help-empty-state">
          <HelpCircle size={32} />
          <h3>No matching contacts found</h3>
          <p>Try another keyword, clear the filter, or ask the chatbot.</p>
          <div className="help-empty-actions">
            <button type="button" onClick={clearSearch}>Clear Search</button>
            <button type="button" onClick={() => navigate("/chat")}>Ask Chatbot</button>
          </div>
        </div>
      ) : (
        <div className="help-directory-list">
          {directory.map((item, index) => {
            const currentId = item.id || `dir-item-${index}`;
            const isOpen = openDirectoryId === currentId;
            const colorClass = getColorClass(item.category);
            const isPlaying = activeAudioId === `dir-${currentId}`;

            return (
              <article
                key={currentId}
                className={`help-directory-card ${isOpen ? "open" : ""} ${colorClass}`}
                // Visual feedback to show they are in Read Mode
                style={{
                  backgroundColor: isPlaying ? "#f0f9ff" : "",
                  border: isReadMode ? "2px dashed #3b82f6" : "",
                  transition: "all 0.2s ease"
                }}
              >
                <div className="help-directory-main">
                  <button
                    type="button"
                    style={{ flex: 1, display: 'flex', textAlign: 'left', background: 'none', border: 'none', padding: 0, cursor: isReadMode ? 'pointer' : 'auto' }}
                    onClick={() => {
                      // THE TECHNICAL FLEX: Intercepting the click based on global state
                      if (isReadMode) {
                        const readablePhone = formatPhoneForSpeech(item.phone);
                        onSpeak(
                          `${item.name}. ${item.description}. Phone number: ${readablePhone}.`,
                          `dir-${currentId}`
                        );
                      } else {
                        toggleDirectoryItem(currentId);
                      }
                    }}
                  >
                    <div className="help-directory-icon">
                      <Building2 size={22} />
                    </div>

                    <div className="help-directory-content">
                      <div className="help-directory-title-row">
                        <div>
                          <span className="help-directory-category">
                            {item.category}
                          </span>
                          <h3>
                            {getCategoryIcon(item.category)}
                            {item.name}
                          </h3>
                        </div>

                        <ChevronDown
                          size={22}
                          className={`help-chevron ${isOpen ? "open" : ""}`}
                        />
                      </div>

                      <p>{item.description}</p>

                      <div className="help-directory-meta">
                        <span>
                          <Phone size={15} />
                          {item.phone}
                        </span>
                      </div>
                    </div>
                  </button>
                  {/* INLINE AUDIO BUTTON COMPLETELY REMOVED! */}
                </div>

                {isOpen && (
                  <div className="help-directory-details">
                    {/* Your existing details code goes here... */}
                    <p>Detailed view is open.</p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}