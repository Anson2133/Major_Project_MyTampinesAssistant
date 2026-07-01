import React, { useState } from "react";
import { useNavigate } from "react-router";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import FeaturesSection from "../components/FeaturesSection";
import HowItWorksSection from "../components/HowItWorksSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import "../auth.css";
import "../landing.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
          email: form.email.trim(),
          password: form.password,
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
    <>
      <main>
        <HeroSection />

        <section className="auth-main">
          <div className="auth-card auth-card--compact">
            <div className="auth-card-header">
              <h1>{mode === "register" ? "Create your account" : "Sign in to continue"}</h1>
              <p>
                {mode === "register"
                  ? "Create an account before completing your resident profile."
                  : "Log in with your email and password to continue."}
              </p>
            </div>

            <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
              <button
                type="button"
                className={`auth-toggle__button ${mode === "login" ? "is-active" : ""}`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={`auth-toggle__button ${mode === "register" ? "is-active" : ""}`}
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "register" && (
                <div className="auth-field">
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "Please wait..." : mode === "register" ? "Create account" : "Log in"}
              </button>
            </form>

            {message && <p className="auth-message">{message}</p>}
            <p className="auth-help">Use the demo resident page only when you want the preset demo profiles.</p>
          </div>
        </section>

        <ServicesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
