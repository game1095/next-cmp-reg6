import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Layout({ session, children }) {
  const navigate = useNavigate();
  const userEmail = session?.user?.email || '';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <nav className="no-print" style={{
        height: '64px',
        backgroundColor: 'var(--canvas-light)',
        borderBottom: '1px solid var(--hairline-on-light)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--spacing-lg)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        {/* Left — Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 700,
          fontSize: '20px',
          color: 'var(--ink)',
          letterSpacing: '-0.3px',
          marginRight: 'var(--spacing-xxl)',
          flexShrink: 0,
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            backgroundColor: 'var(--primary)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          CMP-Core
        </div>

        {/* Center — Nav Links */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', height: '100%' }}>
          <NavItem to="/" label="ข้อมูลลูกค้า" />
          <NavItem to="/signatories" label="ผู้ลงนาม" />
          <NavItem to="/guide" label="แนะนำการใช้งาน" />
          <NavItem to="/developer" label="ผู้พัฒนา" />
        </div>

        {/* Right — User & Logout */}
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            backgroundColor: 'var(--surface-strong-light)',
            borderRadius: 'var(--rounded-lg)',
          }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              backgroundColor: 'var(--ink)', color: 'var(--canvas-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700
            }}>
              {userEmail.substring(0, 2).toUpperCase()}
            </div>
            <span style={{
              fontSize: '13px',
              color: 'var(--ink)',
              fontWeight: 500,
              maxWidth: '150px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {userEmail}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              padding: '6px 8px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              transition: 'color 0.15s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = 'var(--trading-down)'}
            onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            ออกจากระบบ
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main style={{
        flex: 1,
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: 'var(--spacing-lg)',
      }}>
        {children}
      </main>
    </div>
  );
}

/** Individual nav tab */
function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      end
      style={({ isActive }) => ({
        display: 'inline-flex',
        alignItems: 'center',
        height: '100%',
        padding: '0 4px',
        fontSize: '14px',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--ink)' : 'var(--muted)',
        borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
        textDecoration: 'none',
        transition: 'color 0.15s, border-color 0.15s',
      })}
    >
      <span style={{ paddingBottom: '2px' }}>{label}</span>
    </NavLink>
  );
}
