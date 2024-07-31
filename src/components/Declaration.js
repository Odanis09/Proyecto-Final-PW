// src/components/Declaration.js
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const Declaration = () => {
  const [declarationText, setDeclarationText] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const saveDeclaration = async () => {
    if (!user) {
      setError("Usuario no autenticado");
      return;
    }

    const sender = isPublic ? user.email : null;
    const collectionName = isPublic ? 'publicDeclarations' : 'privateDeclarations';
    const declarationDocRef = doc(db, collectionName, user.uid);

    try {
      await setDoc(declarationDocRef, {
        createdAt: new Date(),
        declarations: declarationText,
        isPublic: isPublic,
        recipient: recipient,
        sender: sender
      });
      console.log("Declaración guardada exitosamente");
      // Limpiar los campos después de enviar
      setDeclarationText('');
      setRecipient('');
    } catch (error) {
      console.error("Error al guardar la declaración:", error);
      setError(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveDeclaration();
  };

  return (
    <div>
      <h1>Enviar Declaración</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Declaración" 
          value={declarationText} 
          onChange={(e) => setDeclarationText(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Destinatario" 
          value={recipient} 
          onChange={(e) => setRecipient(e.target.value)} 
          required 
        />
        <label>
          <input 
            type="radio" 
            value="public" 
            checked={isPublic} 
            onChange={() => setIsPublic(true)} 
          />
          Pública
        </label>
        <label>
          <input 
            type="radio" 
            value="private" 
            checked={!isPublic} 
            onChange={() => setIsPublic(false)} 
          />
          Privada
        </label>
        {isPublic && (
          <input 
            type="text" 
            value={user?.email} 
            readOnly 
            placeholder="Enviado por" 
          />
        )}
        <button type="submit">Enviar Declaración</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Declaration;
