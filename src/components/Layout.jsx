import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Layout({ session, children }) {
  const navigate = useNavigate();
  const userEmail = session?.user?.email || '';

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="app-layout" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'row',
      backgroundColor: 'var(--theme-canvas)',
      overflow: 'hidden' // Prevent double scrollbars
    }}>
      <style>{`
        .nav-sidebar-item:not(.active):hover {
          background-color: var(--theme-canvas) !important;
          color: var(--theme-ink) !important;
        }
        .nav-sidebar-item:not(.active):hover .nav-sidebar-icon {
          color: var(--theme-ink) !important;
        }
        .sidebar-transition {
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fade-text {
          transition: opacity 0.2s ease, width 0.2s ease;
        }
      `}</style>
      {/* ── Left Sidebar ── */}
      <aside className="no-print sidebar-transition" style={{
        width: isCollapsed ? '80px' : '280px',
        flexShrink: 0,
        backgroundColor: 'var(--theme-surface-strong)', // Solid premium look
        borderRight: '1px solid var(--theme-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
        boxShadow: '4px 0 24px rgba(0,0,0,0.02)'
      }}>
        {/* Top — Brand & Toggle */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? '28px 0 20px' : '28px 24px 20px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: 800,
            fontSize: '22px',
            color: 'var(--theme-ink)',
            letterSpacing: '-0.5px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'var(--primary)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(252, 213, 53, 0.2)',
              flexShrink: 0
            }}>
              <i className="fa-solid fa-cube" style={{ fontSize: '18px', color: 'var(--on-primary)' }}></i>
            </div>
            {!isCollapsed && (
              <span className="fade-text" style={{ whiteSpace: 'nowrap' }}>CMP-Core</span>
            )}
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--muted)',
              cursor: 'pointer',
              display: isCollapsed ? 'none' : 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '4px',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--theme-ink)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
            title="ซ่อนเมนู"
          >
            <i className="fa-solid fa-bars-staggered" style={{ fontSize: '18px' }}></i>
          </button>
        </div>

        {/* When collapsed, we might still want a toggle button at the top to expand it */}
        {isCollapsed && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <button
              onClick={() => setIsCollapsed(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--theme-canvas)';
                e.currentTarget.style.color = 'var(--theme-ink)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--muted)';
              }}
              title="ขยายเมนู"
            >
              <i className="fa-solid fa-bars" style={{ fontSize: '18px' }}></i>
            </button>
          </div>
        )}

        {/* Middle — Nav Links */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '4px', 
          padding: isCollapsed ? '8px' : '8px 16px',
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {!isCollapsed && (
            <span className="fade-text" style={{ 
              fontSize: '11px', 
              fontWeight: 700, 
              color: 'var(--muted)', 
              textTransform: 'uppercase', 
              letterSpacing: '1.2px', 
              marginLeft: '12px', 
              marginBottom: '12px',
              whiteSpace: 'nowrap'
            }}>
              Main Menu
            </span>
          )}
          
          <NavItem 
            to="/" 
            label="ข้อมูลลูกค้า" 
            icon={<i className="fa-solid fa-users" style={{ fontSize: '18px' }}></i>} 
            isCollapsed={isCollapsed}
          />
          <NavItem 
            to="/signatories" 
            label="ผู้ลงนาม" 
            icon={<i className="fa-solid fa-file-signature" style={{ fontSize: '18px' }}></i>}
            isCollapsed={isCollapsed} 
          />
          <NavItem 
            to="/guide" 
            label="แนะนำการใช้งาน" 
            icon={<i className="fa-solid fa-book-open" style={{ fontSize: '18px' }}></i>} 
            isCollapsed={isCollapsed}
          />
          <NavItem 
            to="/developer" 
            label="ผู้พัฒนา" 
            icon={<i className="fa-solid fa-code" style={{ fontSize: '18px' }}></i>} 
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Bottom — User & Theme & Logout */}
        <div style={{
          padding: isCollapsed ? '24px 8px' : '24px 20px',
          borderTop: '1px solid var(--theme-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: isCollapsed ? 'center' : 'stretch'
        }}>
          {/* User Profile Mini */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '12px',
            padding: isCollapsed ? '8px' : '12px',
            backgroundColor: 'var(--theme-canvas)',
            borderRadius: '12px',
            border: '1px solid var(--theme-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: 'rgba(252, 213, 53, 0.1)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 800, flexShrink: 0
            }} title={isCollapsed ? userEmail : ''}>
              {userEmail.substring(0, 2).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="fade-text" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{
                  fontSize: '13px',
                  color: 'var(--theme-ink)',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {userEmail}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>Admin</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexDirection: isCollapsed ? 'column' : 'row', width: '100%' }}>
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                flex: 1,
                background: 'transparent',
                border: '1px solid var(--theme-border)',
                borderRadius: '8px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--theme-canvas)'; e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--theme-ink)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.color = 'var(--muted)'; }}
              title={isDark ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
            >
              {isDark ? (
                <i className="fa-regular fa-sun" style={{ fontSize: '16px' }}></i>
              ) : (
                <i className="fa-regular fa-moon" style={{ fontSize: '16px' }}></i>
              )}
            </button>

            <button
              onClick={handleLogout}
              style={{
                flex: 1,
                background: 'transparent',
                border: '1px solid var(--theme-border)',
                borderRadius: '8px',
                padding: '10px',
                color: 'var(--trading-down)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(246, 70, 93, 0.05)'; e.currentTarget.style.borderColor = 'rgba(246, 70, 93, 0.3)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'var(--theme-border)'; }}
              title="ออกจากระบบ"
            >
              <i className="fa-solid fa-arrow-right-from-bracket" style={{ fontSize: '16px' }}></i>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Page Content ── */}
      <main className="app-main" style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        backgroundColor: 'var(--theme-canvas)',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 32px',
        }}>
          {children}
        </div>
      </main>
    </div>
  );
}

/** Individual nav tab */
function NavItem({ to, label, icon, isCollapsed }) {
  return (
    <NavLink
      to={to}
      end
      title={isCollapsed ? label : ''}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: '12px',
        padding: isCollapsed ? '12px 0' : '12px 16px',
        fontSize: '14px',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--theme-ink)' : 'var(--muted)',
        backgroundColor: isActive ? 'var(--theme-canvas)' : 'transparent',
        borderRadius: '8px',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.03)' : 'none',
        border: isActive ? '1px solid var(--theme-border)' : '1px solid transparent',
      })}
      className={({ isActive }) => `nav-sidebar-item ${isActive ? 'active' : ''}`}
    >
      {({ isActive }) => (
        <>
          <span className="nav-sidebar-icon" style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isActive ? 'var(--primary)' : 'currentColor',
            transition: 'color 0.2s ease'
          }}>
            {icon}
          </span>
          {!isCollapsed && (
            <span className="fade-text" style={{ whiteSpace: 'nowrap' }}>{label}</span>
          )}
        </>
      )}
    </NavLink>
  );
}
