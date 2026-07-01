// components/HeroSection.jsx
import React from 'react';

function ChatWidget() {
  return (
    <div className="chat-widget">
      {/* Header */}
      <div className="chat-widget__header">
        <div className="chat-widget__avatar">🤖</div>
        <div className="chat-widget__info">
          <div className="chat-widget__name">MyTampines Assistant</div>
          <div className="chat-widget__status">
            <span className="chat-widget__status-dot" />
            Online · All services active
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-widget__messages">
        <div className="chat-msg">
          <div className="chat-msg__avatar">🤖</div>
          <div className="chat-msg__bubble">
            Hello! I'm your Tampines community assistant. What government service can I help you with today?
          </div>
        </div>

        <div className="chat-msg chat-msg--user">
          <div className="chat-msg__bubble">How do I check my CPF balance?</div>
        </div>

        <div className="chat-msg">
          <div className="chat-msg__avatar">🤖</div>
          <div className="chat-msg__bubble">
            You can check your CPF balance by logging in to my.cpf.gov.sg with your Singpass. Want me to guide you step by step?
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="chat-widget__input">
        <input type="text" placeholder="Ask about any government service..." readOnly />
        <button className="chat-widget__send" aria-label="Send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="container hero__inner">
        {/* Left content */}
        <div className="hero__content">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Proudly serving Tampines residents
          </div>

          <h1 className="hero__title">
            Welcome to{' '}
            <span className="hero__title-accent">MyTampines</span>
            {' '}Assistant
          </h1>

          <p className="hero__desc">
            Your personal guide to Singapore government services — CPF, HDB, healthcare, benefits, and more. All in one place, available 24/7.
          </p>

          <p className="hero__proto-note">
            Prototype mode: Simulates a consent-based Singpass/Myinfo login
          </p>

          <div className="hero__cta">
            <a href="/auth?mode=register" className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/>
                <path d="M12 8v4l3 3"/>
              </svg>
              Continue with Singpass
            </a>
            <a href="/select-profile" className="btn btn-secondary">
              Continue as Demo Resident
            </a>
          </div>
        </div>

        {/* Right — chat widget */}
        <div className="hero__chat-wrapper">
          <ChatWidget />
        </div>
      </div>
    </section>
  );
}
