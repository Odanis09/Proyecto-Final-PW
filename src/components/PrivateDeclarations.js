
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { auth } from '../firebase';

const PrivateDeclarations = () => {
  const [declarations, setDeclarations] = useState([]);

  useEffect(() => {
    const fetchDeclarations = async () => {
      const querySnapshot = await getDocs(collection(db, "privateDeclarations")); 
      const user = auth.currentUser;
      if (user) {
        const privateDeclarations = querySnapshot.docs.filter(doc => !doc.data().isPublic && doc.data().recipient === user.email);
        setDeclarations(privateDeclarations.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    };
    fetchDeclarations();
  }, []);

  return (
    <div>
      <h1>Declaraciones Privadas</h1>
      <ul>
        {declarations.map(declaration => (
          <li key={declaration.id}>
            {declaration.declarations} - Destinatario: {declaration.recipient} - Enviada por: {declaration.sender}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrivateDeclarations;
