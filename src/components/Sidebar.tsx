
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function Sidebar({ mobileOpen = false, onSectionChange }: { mobileOpen?: boolean; onSectionChange?: (section: string) => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const triggerAddProject = (e: any) => {
    e.preventDefault();
    document.querySelector('.admin-add-project-btn')?.dispatchEvent(new MouseEvent('click'));
  };

  const handleNavClick = (section: string) => (e: React.MouseEvent) => {
    if (onSectionChange) {
      e.preventDefault();
      onSectionChange(section);
    }
  };

  const isActive = (path: string) => pathname === path || (path === '/admin' && pathname?.startsWith('/admin'));

  const Icon = ({ name }:{name:string}) => {
    const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg', className: 'svg-icon' };
    switch(name){
      case 'dashboard':
        return (
          <svg {...common} aria-hidden>
            <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" />
            <rect x="13" y="3" width="8" height="5" rx="1" fill="currentColor" opacity="0.18" />
            <rect x="13" y="10" width="8" height="11" rx="1" fill="currentColor" opacity="0.12" />
          </svg>
        );
      case 'projects':
        return (
          <svg {...common} aria-hidden>
            <path d="M3 7h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <rect x="3" y="9" width="6" height="10" rx="1" fill="currentColor" opacity="0.15" />
            <rect x="9" y="9" width="12" height="10" rx="1" fill="currentColor" opacity="0.08" />
          </svg>
        );
      case 'add':
        return (
          <svg {...common} aria-hidden>
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'requests':
        return (
          <svg {...common} aria-hidden>
            <path d="M3 7h18v10H3z" fill="currentColor" opacity="0.08" />
            <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'workers':
        return (
          <svg {...common} aria-hidden>
            <circle cx="9" cy="8" r="3" fill="currentColor" />
            <rect x="3" y="13" width="12" height="6" rx="2" fill="currentColor" opacity="0.12" />
          </svg>
        );
      case 'clients':
        return (
          <svg {...common} aria-hidden>
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M3 20c0-3 4-5 9-5s9 2 9 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
          </svg>
        );
      case 'applications':
        return (
          <svg {...common} aria-hidden>
            <rect x="4" y="3" width="16" height="18" rx="2" fill="currentColor" opacity="0.09" />
            <path d="M8 7h8M8 11h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        );
      case 'reports':
        return (
          <svg {...common} aria-hidden>
            <path d="M4 19h16" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
            <rect x="6" y="7" width="3" height="10" rx="1" fill="currentColor" opacity="0.95" />
            <rect x="11" y="4" width="3" height="13" rx="1" fill="currentColor" opacity="0.8" />
            <rect x="16" y="10" width="3" height="7" rx="1" fill="currentColor" opacity="0.7" />
          </svg>
        );
      case 'settings':
        return (
          <svg {...common} aria-hidden>
            <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" strokeWidth="1.2" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 113.53 16.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.2 3.53A2 2 0 116.9 3.53l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001.51 1V9a2 2 0 114 0V8.91a1.65 1.65 0 001-1.51h.09a2 2 0 110 4h-.09a1.65 1.65 0 00-1 1.51V15c.12.35.33.68.6.97z" fill="currentColor" opacity="0.12" />
          </svg>
        );
      case 'logout':
        return (
          <svg {...common} aria-hidden>
            <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="4" width="6" height="16" rx="1" fill="currentColor" opacity="0.12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="admin-sidebar-top">
        <div className="admin-brand-text-only">
          <div className="brand-title">WELMEG</div>
          <div className="brand-sub">Admin Panel</div>
        </div>
      </div>

      <nav className="admin-nav">
        <ul>
          <li className="nav-section">MAIN</li>
          <li>
            <Link href="/admin" className={isActive('/admin') ? 'active' : ''} onClick={handleNavClick('dashboard')}>
              <Icon name="dashboard" />
              <span className="label">Dashboard</span>
            </Link>
          </li>

          <li className="nav-section">PROJECTS</li>
          <li>
            <Link href="/admin" className={isActive('/admin') ? 'active' : ''} onClick={handleNavClick('projects')}>
              <Icon name="projects" />
              <span className="label">All Projects</span>
            </Link>
          </li>
          <li>
            <a href="#add" onClick={(e) => { e.preventDefault(); onSectionChange?.('add'); }} className="link-action add-project-link">
              <Icon name="add" />
              <span className="label">Add Project</span>
            </a>
          </li>
          <li>
            <Link href="/admin" className={pathname?.includes('requests') ? 'active' : ''} onClick={handleNavClick('requests')}>
              <Icon name="requests" />
              <span className="label">Project Requests</span>
            </Link>
          </li>

          <li className="nav-section">PEOPLE</li>
          <li>
            <Link href="/admin" className={pathname?.includes('workers') ? 'active' : ''} onClick={handleNavClick('workers')}>
              <Icon name="workers" />
              <span className="label">Skilled Workers</span>
            </Link>
          </li>
          <li>
            <Link href="/admin" className={pathname?.includes('clients') ? 'active' : ''} onClick={handleNavClick('clients')}>
              <Icon name="clients" />
              <span className="label">Clients</span>
            </Link>
          </li>
          <li>
            <Link href="/admin" className={pathname?.includes('applications') ? 'active' : ''} onClick={handleNavClick('applications')}>
              <Icon name="applications" />
              <span className="label">Job Applications</span>
            </Link>
          </li>

          <li className="nav-section">MANAGEMENT</li>
          <li>
            <Link href="/admin" className={pathname?.includes('reports') ? 'active' : ''} onClick={handleNavClick('reports')}>
              <Icon name="reports" />
              <span className="label">Reports</span>
            </Link>
          </li>
          <li>
            <Link href="/admin" className={pathname?.includes('settings') ? 'active' : ''} onClick={handleNavClick('settings')}>
              <Icon name="settings" />
              <span className="label">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={logout} className="link-action logout-link">
          <Icon name="logout" />
          <span className="label">Logout</span>
        </button>
      </div>
    </aside>
  );
}

