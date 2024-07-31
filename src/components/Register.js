import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError('');
    setSuccessMessage('');
  }, []);

  const registerUser = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        name: displayName,
        email: userCredential.user.email,
      });

      console.log("Usuario registrado con éxito:", userCredential.user);
      setSuccessMessage('Usuario registrado con éxito.');
      setEmail('');
      setPassword('');
      setDisplayName('');
      setError('');
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setError(error.message);
      setSuccessMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(email, password, displayName);
  };

  return (
    <div>
      <h1>Registro de Usuario</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nombre" 
          value={displayName} 
          onChange={(e) => setDisplayName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Correo Electrónico" 
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
        <button type="submit">Registrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <p>
        ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
      </p>
    </div>
  );
};

export default Register;
