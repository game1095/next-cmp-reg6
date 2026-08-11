import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 100;
    const y = (clientY / window.innerHeight) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#030712', // Ultra dark background (Tailwind gray-950)
        padding: 'var(--spacing-md)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-family)'
      }}
    >
      <style>{`
        @keyframes bgIgnite {
          0% { opacity: 0; filter: brightness(0); }
          100% { opacity: 1; filter: brightness(1); }
        }
        @keyframes floatOrb1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes floatOrb2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 40px) scale(1.2); }
          66% { transform: translate(30px, -20px) scale(0.8); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes shimmerText {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes cardEntrance {
          0% { opacity: 0; transform: scale(0.85) translateY(120px) perspective(1000px) rotateX(15deg); filter: blur(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0) perspective(1000px) rotateX(0deg); filter: blur(0); }
        }
        @keyframes logoDrop {
          0% { opacity: 0; transform: translateY(-50px) scale(0.5) rotate(-15deg); filter: drop-shadow(0 0 0 rgba(59,130,246,0)); }
          60% { opacity: 1; transform: translateY(15px) scale(1.15) rotate(5deg); filter: drop-shadow(0 20px 40px rgba(59,130,246,0.6)); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(0); filter: drop-shadow(0 12px 32px rgba(59, 130, 246, 0.4)); }
        }
        @keyframes staggerFadeUp {
          0% { opacity: 0; transform: translateY(30px); filter: blur(5px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 15px rgba(255,255,255,0.1); }
          50% { box-shadow: 0 0 40px rgba(59,130,246,0.6); }
          100% { box-shadow: 0 0 15px rgba(255,255,255,0.1); }
        }
        .login-btn-shimmer {
          background: linear-gradient(110deg, #f59e0b 20%, #fbbf24 40%, #f59e0b 60%) !important;
          background-size: 200% auto !important;
          color: #fff !important;
          border: none !important;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px !important;
          animation: shimmerText 3s linear infinite !important;
        }
        .login-btn-shimmer:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 12px 28px rgba(245, 158, 11, 0.4) !important;
        }
        .dev-signature {
          color: rgba(255,255,255,0.2);
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: crosshair;
          font-weight: 700;
        }
        .dev-signature:hover {
          color: #fff;
          text-shadow: 0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(59,130,246,0.8), 0 0 40px rgba(245,158,11,0.6);
          letter-spacing: 6px;
          transform: scale(1.1);
        }
        .premium-input {
          width: 100%; height: 52px; padding: 0 16px; border-radius: 12px; font-size: 15px;
          background-color: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08); color: #fff;
          outline: none; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-family: var(--font-family);
        }
        .premium-input:focus {
          border-color: rgba(59,130,246,0.6);
          background-color: rgba(0,0,0,0.6);
          box-shadow: 0 0 0 4px rgba(59,130,246,0.15), inset 0 2px 4px rgba(0,0,0,0.3);
        }
        .premium-input::placeholder {
          color: rgba(255,255,255,0.3);
        }
        .animate-stagger-1 { animation: staggerFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.8s; opacity: 0; }
        .animate-stagger-2 { animation: staggerFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.9s; opacity: 0; }
        .animate-stagger-3 { animation: staggerFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 1.0s; opacity: 0; }
        .animate-stagger-4 { animation: staggerFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 1.1s; opacity: 0; }
      `}</style>

      {/* Dynamic Glowing Orbs Background */}
      <div style={{
        position: 'absolute', top: '10%', left: '20%', width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none',
        animation: 'bgIgnite 2s ease-out forwards, floatOrb1 15s ease-in-out infinite 2s'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '20%', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none',
        animation: 'bgIgnite 2.5s ease-out forwards, floatOrb2 20s ease-in-out infinite 2.5s'
      }} />
      
      {/* Interactive cursor glow */}
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.02), transparent 40%)`,
        transition: 'background 0.1s ease-out'
      }} />

      {/* Glassmorphism Login Card */}
      <div style={{
        backgroundColor: 'rgba(20, 20, 22, 0.65)',
        backdropFilter: 'blur(32px) saturate(200%)',
        WebkitBackdropFilter: 'blur(32px) saturate(200%)',
        borderRadius: '32px',
        padding: '56px 48px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255,255,255,0.02)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 1,
        animation: 'cardEntrance 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        {/* Logo Mark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', backgroundColor: 'var(--primary)', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'logoDrop 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, pulseGlow 4s infinite 2s',
            opacity: 0 /* Initial state before animation */
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
        </div>

        {/* Headings */}
        <h1 className="animate-stagger-1" style={{ 
          marginBottom: '8px', textAlign: 'center', fontSize: '32px', fontWeight: 800, letterSpacing: '-1px',
          background: 'linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Welcome to CMP-Core
        </h1>
        <p className="animate-stagger-2" style={{ marginBottom: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '15px', fontWeight: 500 }}>
          Secure access to your postal registry
        </p>

        {/* Error State */}
        {error && (
          <div style={{
            color: '#fca5a5', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '16px', borderRadius: '12px', fontSize: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)'
          }}>
            <span style={{ fontSize: '18px' }}>⚠️</span> {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          <div className="animate-stagger-3" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <input
                id="email" type="email" placeholder="e.g. 64000@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="premium-input"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Password
              </label>
              <input
                id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="premium-input"
              />
            </div>
          </div>
          
          <div className="animate-stagger-4">
            <Button type="submit" fullWidth disabled={loading} className="login-btn-shimmer" style={{ height: '56px', borderRadius: '14px', fontSize: '16px' }}>
              {loading ? 'Authenticating...' : 'Sign In to Core'}
            </Button>
          </div>
        </form>
      </div>

      {/* Signature Easter Egg */}
      <div style={{ position: 'absolute', bottom: '40px', zIndex: 1, textAlign: 'center', width: '100%' }}>
        <span className="dev-signature">
          Developed by คนทำงานมั่ว
        </span>
      </div>
    </div>
  );
}
