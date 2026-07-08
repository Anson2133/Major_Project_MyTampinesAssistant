import HelpEmergencySection from "../components/HelpEmergencySection";
import HelpDirectory from "../components/HelpDirectory";
import useHelpDirectory from "../hooks/useHelpDirectory";
import useAudioGuide from "../../Audio/hooks/useAudioGuide";
import FloatingAudioButton from "../../Audio/components/FloatingAudioButton";

import "../help.css";

export default function DirectoryPage() {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    openDirectoryId,
    filteredDirectory,
    emergencyItems,
    helpCategories,
    loading,
    error,
    refreshDirectory,
    toggleDirectoryItem,
    clearSearch,
  } = useHelpDirectory();

  // Bring in the full suite of audio tools, including the Read Mode toggle
  const { activeAudioId, handleSpeak, isReadMode, toggleReadMode } = useAudioGuide();
  const currentLang = localStorage.getItem("i18nextLng") || "en";

  return (
    <main className="help-page">
      {/* Inject the Floating Action Button. 
        Because it has position: fixed, it can go anywhere, but top level is best.
      */}
      <FloatingAudioButton
        isReadMode={isReadMode}
        toggleReadMode={toggleReadMode}
        targetLang={currentLang} /* NEW: Passes the selected language to SEA-LION */
      />

      {/* NEW: We wrap all the actual page content in this ID so the button can scrape it */}
      <div id="readable-content">
        <section className="help-hero">
          <div>
            <span className="help-eyebrow">Directory</span>
            <h1>Find official contacts and support channels</h1>
            <p>
              Search agencies, services, reporting channels, official websites,
              and support contacts. Use this page when you already know the type
              of help you need and want a direct place to go.
            </p>
          </div>

          <div className="help-hero-card">
            <strong>Tip</strong>
            <p>
              Search by issue, such as scam, CHAS, childcare, elderly, bulky item,
              financial support, healthcare, training, or town council.
            </p>
          </div>
        </section>

        {loading && (
          <div className="help-api-state">Loading directory contacts...</div>
        )}

        {error && (
          <div className="help-api-state error">
            <strong>Unable to load directory.</strong>
            <p>{error}</p>
            <button type="button" onClick={refreshDirectory}>
              Try Again
            </button>
          </div>
        )}

        {/* Pass the isReadMode down so the cards know when to intercept clicks */}
        <HelpEmergencySection
          items={emergencyItems}
          activeAudioId={activeAudioId}
          onSpeak={handleSpeak}
          isReadMode={isReadMode}
        />

        <HelpDirectory
          categories={helpCategories}
          directory={filteredDirectory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          openDirectoryId={openDirectoryId}
          toggleDirectoryItem={toggleDirectoryItem}
          clearSearch={clearSearch}
          showIcons={true}
          isColorCoded={true}
          activeAudioId={activeAudioId}
          onSpeak={handleSpeak}
          isReadMode={isReadMode}
        />
      </div>
    </main>
  );
}