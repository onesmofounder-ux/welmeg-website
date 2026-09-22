"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <Link href="/" className="branding">

        <Image
          src="/images/welmeg_logo.png"
          alt="WELMEG Logo"
          width={50}
          height={50}
          className="branding-logo"
        />

        <div className="branding-text">
          <span className="branding-name">WELMEG</span>
          <span className="branding-sub">Solution Company Limited</span>
        </div>

      </Link>
      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </div>

      <ul className={menuOpen ? "nav-links active" : "nav-links"}>
        <li className="nav-close-row">
          <button
            className="nav-drawer-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>
        </li>

        <li>
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>

        <li>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
        </li>

        <li>
          <Link href="/services" onClick={() => setMenuOpen(false)}>Services</Link>
        </li>

        <li>
          <Link href="/projects" onClick={() => setMenuOpen(false)}>
            Projects
          </Link>
        </li>

        <li>
          <Link href="/client-portal" onClick={() => setMenuOpen(false)}>
            Client Portal
          </Link>
        </li>

        <li>
          <Link href="/careers" onClick={() => setMenuOpen(false)}>Careers</Link>
        </li>

        <li>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </li>

        <li>
          <Link href="/admin/login" onClick={() => setMenuOpen(false)}>Admin</Link>
        </li>
      </ul>

      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}