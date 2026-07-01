import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import "../auth.css";
import "../selectProfile.css";

const RESIDENTIAL_STATUS_OPTIONS = [
  "Citizen",
  "Permanent Resident",
  "Foreigner",
];

const MARITAL_STATUS_OPTIONS = [
  "Single",
  "Married",
  "Widowed",
  "Divorced",
];

const HOUSEHOLD_TYPE_OPTIONS = [
  "Family with children",
  "Family",
  "Single adult household",
  "Multi-generation household",
  "Senior household",
  "Single senior household",
];

const EMPLOYMENT_STATUS_OPTIONS = [
  "Employed",
  "Self-employed",
  "Unemployed",
  "Student",
  "Retired",
  "Homemaker",
];

const INCOME_BAND_OPTIONS = [
  "Low income",
  "Middle income",
  "High income",
  "Very low income",
  "No income",
];

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [mode, setMode] = useState("register");
  const [form, setForm] = useState({
    name: "",
    displayName: "",
    email: "",
    password: "",
    age: "",
    residentialStatus: "Citizen",
    housingType: "",
    householdType: HOUSEHOLD_TYPE_OPTIONS[0],
    employmentStatus: EMPLOYMENT_STATUS_OPTIONS[0],
    incomeBand: INCOME_BAND_OPTIONS[0],
    maritalStatus: "Single",
    hasChildren: false,
    caregiver: false,
    mobilityNeeds: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedMode = params.get("mode");
    if (requestedMode === "register" || requestedMode === "login") {
      setMode(requestedMode);
      setMessage("");
    }
  }, [location.search]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "register") {
        if (!form.name.trim()) {
          throw new Error("Please enter your full name");
        }

        await register({
          name: form.name.trim(),
          displayName: form.displayName.trim() || form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          age: form.age ? Number(form.age) : null,
          residentialStatus: form.residentialStatus,
          housingType: form.housingType,
          householdType: form.householdType,
          employmentStatus: form.employmentStatus,
          incomeBand: form.incomeBand,
          maritalStatus: form.maritalStatus,
          hasChildren: form.hasChildren,
          caregiver: form.caregiver,
          mobilityNeeds: form.mobilityNeeds,
        });
      } else {
        await login({
          email: form.email.trim(),
          password: form.password,
        });
      }

      navigate("/select-profile");
    } catch (error) {
      setMessage(error.message || "Unable to continue right now");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="select-profile-layout">
      <main className="select-profile-main">
        <div className="select-profile-hero">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
          <h1 className="select-profile-hero__title">
            {mode === "register" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="select-profile-hero__subtitle">
            Register or log in to continue with your own Tampines resident profile.
          </p>
        </div>

        <div className="select-profile-content">
          <div className="auth-panel">
            <div className="auth-panel__toggle" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className={`auth-panel__tab ${mode === "register" ? "is-active" : ""}`}
                onClick={() => {
                  setMode("register");
                  setMessage("");
                }}
              >
                Register
              </button>
              <button
                type="button"
                className={`auth-panel__tab ${mode === "login" ? "is-active" : ""}`}
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
              >
                Login
              </button>
            </div>

            <form className="auth-form auth-form--panel" onSubmit={handleSubmit}>
              {mode === "register" && (
                <>
                  <div className="auth-field">
                    <label htmlFor="auth-name">Full name</label>
                    <input
                      id="auth-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={(event) => updateField("name", event.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label htmlFor="auth-displayName">Display name</label>
                    <input
                      id="auth-displayName"
                      name="displayName"
                      type="text"
                      value={form.displayName}
                      onChange={(event) => updateField("displayName", event.target.value)}
                      placeholder="Enter your preferred display name"
                    />
                  </div>
                </>
              )}

              <div className="auth-field">
                <label htmlFor="auth-email">Email</label>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              {mode === "register" && (
                <div className="auth-grid auth-grid--three">
                  <div className="auth-field">
                    <label htmlFor="auth-age">Age</label>
                    <input
                      id="auth-age"
                      name="age"
                      type="number"
                      min="0"
                      step="1"
                      inputMode="numeric"
                      value={form.age}
                      onChange={(event) => updateField("age", event.target.value)}
                      placeholder="e.g. 32"
                    />
                  </div>

                  <div className="auth-field">
                    <label htmlFor="auth-residentialStatus">Residential status</label>
                    <select
                      id="auth-residentialStatus"
                      value={form.residentialStatus}
                      onChange={(event) => updateField("residentialStatus", event.target.value)}
                    >
                      {RESIDENTIAL_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="auth-housingType">Housing type</label>
                    <input
                      id="auth-housingType"
                      name="housingType"
                      type="text"
                      value={form.housingType}
                      onChange={(event) => updateField("housingType", event.target.value)}
                      placeholder="e.g. 4-room HDB"
                    />
                  </div>
                </div>
              )}

              {mode === "register" && (
                <div className="auth-grid auth-grid--three">
                  <div className="auth-field">
                    <label htmlFor="auth-householdType">Household type</label>
                    <select
                      id="auth-householdType"
                      value={form.householdType}
                      onChange={(event) => updateField("householdType", event.target.value)}
                    >
                      {HOUSEHOLD_TYPE_OPTIONS.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="auth-employmentStatus">Employment status</label>
                    <select
                      id="auth-employmentStatus"
                      value={form.employmentStatus}
                      onChange={(event) => updateField("employmentStatus", event.target.value)}
                    >
                      {EMPLOYMENT_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="auth-field">
                    <label htmlFor="auth-incomeBand">Income band</label>
                    <select
                      id="auth-incomeBand"
                      value={form.incomeBand}
                      onChange={(event) => updateField("incomeBand", event.target.value)}
                    >
                      {INCOME_BAND_OPTIONS.map((band) => (
                        <option key={band} value={band}>
                          {band}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {mode === "register" && (
                <div className="auth-field">
                  <label htmlFor="auth-maritalStatus">Marital status</label>
                  <select
                    id="auth-maritalStatus"
                    value={form.maritalStatus}
                    onChange={(event) => updateField("maritalStatus", event.target.value)}
                  >
                    {MARITAL_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {mode === "register" && (
                <div className="profile-options auth-options">
                  <label className="profile-checkbox">
                    <input
                      type="checkbox"
                      checked={form.hasChildren}
                      onChange={(event) => updateField("hasChildren", event.target.checked)}
                    />
                    <span>I have children</span>
                  </label>
                  <label className="profile-checkbox">
                    <input
                      type="checkbox"
                      checked={form.caregiver}
                      onChange={(event) => updateField("caregiver", event.target.checked)}
                    />
                    <span>I am a caregiver</span>
                  </label>
                  <label className="profile-checkbox">
                    <input
                      type="checkbox"
                      checked={form.mobilityNeeds}
                      onChange={(event) => updateField("mobilityNeeds", event.target.checked)}
                    />
                    <span>I need mobility support</span>
                  </label>
                </div>
              )}

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "Please wait..." : mode === "register" ? "Create account" : "Log in"}
              </button>
            </form>

            {message && <p className="auth-message">{message}</p>}
            <p className="auth-panel__hint">
              You can still continue as a demo resident from the existing flow.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
