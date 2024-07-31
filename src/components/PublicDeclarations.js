
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const PublicDeclarations = () => {
  const [declarations, setDeclarations] = useState([]);

  useEffect(() => {
    const fetchDeclarations = async () => {
      const querySnapshot = await getDocs(collection(db, "publicDeclarations")); 
      const publicDeclarations = querySnapshot.docs.filter(doc => doc.data().isPublic);
      setDeclarations(publicDeclarations.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchDeclarations();
  }, []);

  return (
    <div>
      <h1>Declaraciones Públicas</h1>
      <ul>
        {declarations.map(declaration => (
          <li key={declaration.id}>
            {declaration.declarations} - Publicada por: {declaration.sender} - Destinatario: {declaration.recipient}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicDeclarations;

