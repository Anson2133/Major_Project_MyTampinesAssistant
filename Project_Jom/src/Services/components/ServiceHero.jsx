import { Search } from "lucide-react";

function getResidentName() {
  try {
    const cachedProfile = JSON.parse(
      localStorage.getItem("cachedProfile") || "{}"
    );

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    return (
      cachedProfile?.displayName ||
      cachedProfile?.name ||
      cachedProfile?.identity?.name ||
      user?.displayName ||
      user?.name ||
      "there"
    );
  } catch {
    return "there";
  }
}

function ServicesHero({ searchTerm, onSearchChange }) {
  const residentName = getResidentName();

  return (
    <section className="services-hero">
      <p className="services-welcome-text">
        Welcome back, {residentName}
      </p>

      <h1>Find the right support without going in circles</h1>

      <p>
        Search by situation, check likely eligibility, prepare documents, and continue
        to the right official next step.
      </p>

      <div className="services-search">
        <Search size={22} />
        <input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='Search "medical bill", "urgent cash", "elderly care"...'
        />
      </div>

      <p className="services-search-helper">
        We show the closest matches. For complex situations, start with the AI Assistant.
      </p>
    </section>
  );
}

export default ServicesHero;