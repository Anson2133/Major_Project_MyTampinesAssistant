import {
  Building2,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  Phone,
  Search,
} from "lucide-react";
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
  // 1. ADD THE NEW PROPS HERE
  showIcons,
  isColorCoded,
}) {
  const navigate = useNavigate();

  // 2. HELPER FUNCTIONS FOR ICONS AND COLORS
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
              className={`help-category-pill ${selectedCategory === category ? "active" : ""
                }`}
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
          <p>
            Try another keyword, clear the filter, or ask the chatbot to
            describe your issue in plain English.
          </p>

          <div className="help-empty-actions">
            <button type="button" onClick={clearSearch}>
              Clear Search
            </button>

            <button type="button" onClick={() => navigate("/chat")}>
              Ask Chatbot
            </button>
          </div>
        </div>
      ) : (
        <div className="help-directory-list">
          {directory.map((item) => {
            const isOpen = openDirectoryId === item.id;
            // 3. GET THE COLOR CLASS FOR THIS SPECIFIC ITEM
            const colorClass = getColorClass(item.category);

            return (
              <article
                key={item.id}
                // 4. INJECT THE COLOR CLASS INTO THE CARD WRAPPER
                className={`help-directory-card ${isOpen ? "open" : ""} ${colorClass}`}
              >
                <button
                  type="button"
                  className="help-directory-main"
                  onClick={() => toggleDirectoryItem(item.id)}
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
                        {/* 5. INJECT THE ICON RIGHT NEXT TO THE TITLE */}
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

                      {item.openingHours && <span>{item.openingHours}</span>}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="help-directory-details">
                    {item.address && (
                      <div className="help-detail-block">
                        <strong>Address / Location</strong>
                        <p>{item.address}</p>
                      </div>
                    )}

                    {item.note && (
                      <div className="help-detail-block">
                        <strong>Note</strong>
                        <p>{item.note}</p>
                      </div>
                    )}

                    {item.tags?.length > 0 && (
                      <div className="help-tags">
                        {item.tags.slice(0, 8).map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    )}

                    <div className="help-card-actions">
                      {item.website && (
                        <a
                          href={item.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="help-primary-link"
                        >
                          Open Website <ExternalLink size={15} />
                        </a>
                      )}

                      {item.relatedRoute && (
                        <button
                          type="button"
                          className="help-secondary-btn"
                          onClick={() => navigate(item.relatedRoute)}
                        >
                          {item.actionText || "Check Related Services"}
                        </button>
                      )}

                      <button
                        type="button"
                        className="help-secondary-btn"
                        onClick={() => navigate("/chat")}
                      >
                        Ask AI About This
                      </button>
                    </div>
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