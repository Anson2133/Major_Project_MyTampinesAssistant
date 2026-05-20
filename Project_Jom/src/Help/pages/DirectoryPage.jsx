import HelpEmergencySection from "../components/HelpEmergencySection";
import HelpDirectory from "../components/HelpDirectory";
import useHelpDirectory from "../hooks/useHelpDirectory";

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

  return (
    <main className="help-page">
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

      <HelpEmergencySection items={emergencyItems} />

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
      />
    </main>
  );
}