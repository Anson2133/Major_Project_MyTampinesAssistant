import { Search } from "lucide-react";
import { useNavigate } from "react-router";

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
  const navigate = useNavigate();

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

      <div className="services-hero-divider">
        <span />
        <span className="services-hero-divider-label">or</span>
        <span />
      </div>

      <div className="services-hero-wizard">
        <span>Not sure what to search for?</span>
        <button onClick={() => navigate("/life-situations")}>
          Describe your situation instead →
        </button>
      </div>
    </section>
  );
}

export default ServicesHero;