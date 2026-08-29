"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  createdAt: string; // ISO
  read: boolean;
  href?: string;
};

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // sample initial notifications
    const now = Date.now();
    return [
      {
        id: "n1",
        type: "project_request",
        title: "New Project Request",
        message: "ABC Construction submitted a project request.",
        createdAt: new Date(now - 1000 * 60 * 5).toISOString(),
        read: false,
        href: "/admin",
      },
      {
        id: "n2",
        type: "job_application",
        title: "New Job Application",
        message: "A new worker submitted an application.",
        createdAt: new Date(now - 1000 * 60 * 60).toISOString(),
        read: false,
        href: "/admin",
      },
      {
        id: "n3",
        type: "project_update",
        title: "Project Updated",
        message: "Project status was changed to Active.",
        createdAt: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
        read: true,
        href: "/admin",
      },
    ];
  });

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", onDoc);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Real-time subscriptions to inserts
  useEffect(() => {
    const channels: any[] = [];

    try {
      channels.push(
        supabase.channel(`public:project_requests`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'project_requests' },
            (payload: any) => {
              try {
                const newRow = payload?.new;
                if (!newRow) return;
                const id = String(newRow.id);
                setNotifications((prev) => {
                  if (prev.some((n) => n.id === id)) return prev;
                  const note: Notification = {
                    id,
                    type: 'project_request',
                    title: 'New Project Request',
                    message: `${newRow.client_name || 'A client'} submitted a project request.`,
                    createdAt: newRow.created_at || new Date().toISOString(),
                    read: false,
                    href: `/admin?requestId=${id}`,
                  };
                  return [note, ...prev];
                });
              } catch (e) {
                console.error('Error handling realtime payload', e);
              }
            }
          )
          .subscribe()
      );

      channels.push(
        supabase.channel(`public:job_applications`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'job_applications' },
            (payload: any) => {
              try {
                const newRow = payload?.new;
                if (!newRow) return;
                const id = `job_application-${String(newRow.id)}`;
                setNotifications((prev) => {
                  if (prev.some((n) => n.id === id)) return prev;
                  const note: Notification = {
                    id,
                    type: 'job_application',
                    title: 'New Job Application',
                    message: `${newRow.full_name || 'A worker'} submitted a job application.`,
                    createdAt: newRow.created_at || new Date().toISOString(),
                    read: false,
                    href: '/admin',
                  };
                  return [note, ...prev];
                });
              } catch (e) {
                console.error('Error handling job_applications realtime payload', e);
              }
            }
          )
          .subscribe()
      );

      channels.push(
        supabase.channel(`public:skilled_workers`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'skilled_workers' },
            (payload: any) => {
              try {
                const newRow = payload?.new;
                if (!newRow) return;
                const id = `skilled_worker-${String(newRow.id)}`;
                setNotifications((prev) => {
                  if (prev.some((n) => n.id === id)) return prev;
                  const note: Notification = {
                    id,
                    type: 'skilled_worker',
                    title: 'New Skilled Worker',
                    message: `${newRow.full_name || 'A worker'} registered as a skilled worker.`,
                    createdAt: newRow.created_at || new Date().toISOString(),
                    read: false,
                    href: '/admin',
                  };
                  return [note, ...prev];
                });
              } catch (e) {
                console.error('Error handling skilled_workers realtime payload', e);
              }
            }
          )
          .subscribe()
      );
    } catch (e) {
      console.error('Realtime subscription setup failed', e);
    }

    return () => {
      try {
        channels.forEach((channel) => {
          if ((supabase as any).removeChannel) {
            (supabase as any).removeChannel(channel);
          } else if (channel.unsubscribe) {
            channel.unsubscribe();
          }
        });
      } catch (e) {
        console.error('Error removing realtime channels', e);
      }
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggle = () => setOpen((v) => !v);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((p) => ({ ...p, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((p) => (p.id === id ? { ...p, read: true } : p)));
  };

  const formatTimeAgo = (iso: string) => {
    const time = new Date(iso).getTime();
    if (isNaN(time)) return 'just now';
    const s = Math.floor((Date.now() - time) / 1000);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 3600 * 24) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / (3600 * 24))}d ago`;
  };

  const iconFor = (type: string) => {
    switch (type) {
      case "project_request":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18v10H3z" fill="#07132a" opacity="0.06"/><path d="M3 7l9 6 9-6" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        );
      case "job_application":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="3" width="16" height="18" rx="2" fill="#07132a" opacity="0.03"/><path d="M8 7h8M8 11h8" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round"/></svg>
        );
      case "skilled_worker":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="9" cy="8" r="3" fill="#d4af37"/><rect x="3" y="13" width="12" height="6" rx="2" fill="#07132a" opacity="0.06"/></svg>
        );
      case "project_update":
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="8" height="8" rx="1" fill="#d4af37"/><rect x="13" y="3" width="8" height="5" rx="1" fill="#07132a" opacity="0.06"/></svg>
        );
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#07132a" opacity="0.04"/><path d="M9 12h6" stroke="#d4af37" strokeWidth="1.6" strokeLinecap="round"/></svg>
        );
    }
  };

  const allRead = notifications.length === 0 || unreadCount === 0;

  return (
    <div className="notification-center" ref={ref}>
      <div className="notification-bell-wrapper">
        <button
          className={`icon-btn notification-bell ${unreadCount > 0 ? 'pulse' : ''}`}
          aria-label="Notifications"
          aria-haspopup="true"
          aria-expanded={open}
          onClick={toggle}
          title="Notifications"
        >
          {/* bell icon preserved visually similar to existing */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.6 14H5.4c-.667 0-1.25.268-1.995.595L2 17h5" stroke="#07132a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 3v2" stroke="#d4af37" strokeWidth="1.4" strokeLinecap="round"/><path d="M12 21a2.5 2.5 0 002.5-2.5H9.5A2.5 2.5 0 0012 21z" fill="#d4af37"/></svg>
        </button>
        {unreadCount > 0 && (
          <span className="notif-badge" aria-hidden>{unreadCount}</span>
        )}
      </div>

      {open && (
        <div className="notif-dropdown" role="dialog" aria-label="Notifications" aria-modal="false">
          <div className="notif-header">
            <div className="notif-title">Notifications</div>
            <div className="notif-actions">
              <button className="notif-action-link" onClick={() => { markAllRead(); }}>
                Mark all as read
              </button>
              <Link href="/admin" className="notif-action-link">View all</Link>
            </div>
          </div>

          <div className="notif-list">
            {allRead ? (
              <div className="notif-empty">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V6h2v7z" fill="#07132a" opacity="0.06"/><path d="M11 10h2v4h-2z" fill="#d4af37"/></svg>
                <div style={{marginTop:8,fontWeight:700,color:'#07132a'}}>No new notifications</div>
                <div style={{fontSize:13,color:'#6b7280',marginTop:6}}>You're all caught up.</div>
              </div>
            ) : (
              notifications.filter(n=>!n.read).map((n) => (
                <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`} onClick={() => { try{ markRead(n.id); if (n.href) window.location.href = n.href; } catch(e) { console.error('Notification click error', e); } }}>
                  <div className="notif-icon">
                    {iconFor(n.type)}
                    {!n.read && <span className="unread-dot" aria-hidden />}
                  </div>
                  <div className="notif-body">
                    <div className="notif-item-title">{n.title ?? 'Notification'}</div>
                    <div className="notif-item-message">{n.message ?? ''}</div>
                    <div className="notif-item-time">{formatTimeAgo(n.createdAt ?? new Date().toISOString())}</div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
