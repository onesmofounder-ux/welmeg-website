"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
>
  ☰
</div>
    <ul className={menuOpen ? "nav-links active" : "nav-links"}>

        <li>
          <Link href="/">Home</Link>
        </li>

        <li>
          <Link href="/about">About</Link>
        </li>

        <li>
          <Link href="/services">Services</Link>
        </li>

       <li>
  <Link href="/projects">
    Projects
  </Link>
</li>

<li>
  <Link href="/client-portal">
    Client Portal
  </Link>
</li>

<li>
  <Link href="/careers">
    Careers
  </Link>
</li>

<li>
  <Link href="/contact">
    Contact
  </Link>
</li>

<li>
  <Link href="/admin/login">
    Admin
  </Link>
</li>
</ul>

</nav> 
  );
}