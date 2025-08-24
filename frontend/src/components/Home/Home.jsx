import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home1() {
    const n = useNavigate();
    const r = useRef(null);

    useEffect(() => {
        const els = document.querySelectorAll("[data-reveal]");
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((en) => {
                    if (en.isIntersecting) {
                        en.target.classList.add("in-view");
                        io.unobserve(en.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        const onScroll = () => {
            if (!r.current) return;
            const y = window.scrollY;
            const k = Math.max(-40, -y * 0.15);
            r.current.style.backgroundPosition = `center ${k}px`;
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <main className="page-root">
            <section
                ref={r}
                className="hero"
                aria-label="Hostel system hero"
                role="region"
            >
                <div className="hero-inner">
                    <div className="hero-kicker" data-reveal>
                        Built for modern campus living
                    </div>
                    <h1 className="hero-title" data-reveal>
                        Smart Hostel Management
                    </h1>
                    <p className="hero-sub" data-reveal>
                        Manage rooms, payments, maintenance and students from a single
                        elegant dashboard — simple, secure, and fast.
                    </p>
                    <div className="hero-ctas" data-reveal>
                        <button className="btn primary" onClick={() => n("/signup")}>
                            Get started
                        </button>
                        <button className="btn ghost" onClick={() => n("/about")}>
                            Learn more
                        </button>
                    </div>
                </div>
            </section>

            <section className="section features" aria-label="Features" role="region">
                <div className="container">
                    <h2 className="section-title" data-reveal>
                        Designed around what matters
                    </h2>

                    <div className="grid-3">
                        <article className="card" data-reveal>
                            <svg className="icon" viewBox="0 0 24 24" aria-hidden>
                                <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" fill="currentColor" />
                            </svg>
                            <h3>Simple booking</h3>
                            <p>Fast room allocation and calendar-based booking flow for students.</p>
                        </article>

                        <article className="card" data-reveal>
                            <svg className="icon" viewBox="0 0 24 24" aria-hidden>
                                <path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7z" fill="currentColor" />
                            </svg>
                            <h3>Payments & dues</h3>
                            <p>Track fee schedules, send reminders and accept payments securely.</p>
                        </article>

                        <article className="card" data-reveal>
                            <svg className="icon" viewBox="0 0 24 24" aria-hidden>
                                <path d="M12 7a5 5 0 100 10 5 5 0 000-10zM2 20c0-4.5 5.5-8 10-8s10 3.5 10 8v1H2v-1z" fill="currentColor" />
                            </svg>
                            <h3>Maintenance</h3>
                            <p>Log complaints, monitor progress and resolve issues with priority tags.</p>
                        </article>
                    </div>
                </div>
            </section>

            <section className="section stats" aria-label="Highlights" role="region">
                <div className="container" data-reveal>
                    <div className="stats-grid">
                        <div className="stat">
                            <div className="stat-number">98%</div>
                            <div className="stat-label">Satisfaction</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number">1.2k</div>
                            <div className="stat-label">Active residents</div>
                        </div>
                        <div className="stat">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Support</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section cta" aria-label="Call to Action" role="region">
                <div className="container" data-reveal>
                    <div className="cta-card">
                        <div>
                            <h3>Ready to modernize your hostel?</h3>
                            <p>Start a free trial or request a demo for your campus.</p>
                        </div>
                        <div className="cta-actions">
                            <button className="btn primary" onClick={() => n("/signup")}>
                                Start free
                            </button>
                            <button className="btn ghost" onClick={() => n("/contact")}>
                                Request demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
