
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const navigate = useNavigate();

  //  limpiar los campos 
  useEffect(() => {
    setEmail('');
    setPassword(''); 
    setError(''); 
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); 
      setEmail(''); 
      setPassword(''); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('Correo de restablecimiento de contraseña enviado');
      setShowResetForm(false); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>ITLA CRUSH</h1>
      <h3>Iniciar Sesión</h3>
      {!showResetForm ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
          <p>
            ¿Olvidaste tu contraseña? <button type="button" onClick={() => setShowResetForm(true)}>Recuperar Contraseña</button>
          </p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <p>No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </form>
      ) : (
        <form onSubmit={handlePasswordReset}>
          <input
            type="email"
            placeholder="Introduce tu correo electrónico"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Correo de Restablecimiento'}
          </button>
          <p>
            <button type="button" onClick={() => setShowResetForm(false)}>Volver al inicio de sesión</button>
          </p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default Login;
