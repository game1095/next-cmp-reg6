import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const pageStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--surface-strong-light)',
    padding: 'var(--spacing-md)'
  };

  const cardStyle = {
    backgroundColor: 'var(--canvas-light)',
    borderRadius: 'var(--rounded-lg)',
    padding: 'var(--spacing-xl)',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: '1px solid var(--hairline-on-light)'
  };

  const errorStyle = {
    color: '#f6465d', // trading-down red from design system
    backgroundColor: 'rgba(246, 70, 93, 0.1)',
    padding: '12px',
    borderRadius: 'var(--rounded-sm)',
    fontSize: '14px',
    marginBottom: 'var(--spacing-md)'
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 className="text-title-lg" style={{ marginBottom: 'var(--spacing-xs)', textAlign: 'center' }}>
          Welcome to CMP-Core
        </h1>
        <p className="text-muted text-body-md" style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
          Log in with your branch postal code
        </p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleLogin}>
          <Input
            id="email"
            type="email"
            label="Email Address"
            placeholder="e.g. 64000@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
