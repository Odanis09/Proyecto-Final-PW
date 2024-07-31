import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Dashboard = () => {
  const [declaration, setDeclaration] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [users, setUsers] = useState([]);
  const [declarations, setDeclarations] = useState([]);
  const [error, setError] = useState('');
  const [otherRecipient, setOtherRecipient] = useState('');
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDecl, setSelectedDecl] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchDeclarations = async () => {
      const querySnapshot = await getDocs(collection(db, "declarations"));
      const allDeclarations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeclarations(allDeclarations);
    };
    fetchDeclarations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      const finalRecipient = recipient === "OTRO" ? otherRecipient : recipient;
      
      const newDeclaration = {
        declaration,
        recipient: finalRecipient,
        isPublic,
        sender: isPublic ? user.displayName : null,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "declarations"), newDeclaration);
      setDeclarations([...declarations, newDeclaration]);
      setDeclaration('');
      setRecipient('');
      setIsPublic(true);
      setOtherRecipient('');
    } catch (error) {
      console.error("Error al enviar la declaración: ", error);
      setError(error.message);
    }
  };

  const handleEdit = async (id, updatedDeclaration) => {
    try {
      await updateDoc(doc(db, "declarations", id), updatedDeclaration);
      setDeclarations(declarations.map(decl => (decl.id === id ? updatedDeclaration : decl)));
    } catch (error) {
      console.error("Error al actualizar la declaración: ", error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "declarations", id));
      setDeclarations(declarations.filter(decl => decl.id !== id));
    } catch (error) {
      console.error("Error al eliminar la declaración: ", error);
      setError(error.message);
    }
  };

  const handleMenuOpen = (event, decl) => {
    setAnchorEl(event.currentTarget);
    setSelectedDecl(decl);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDecl(null);
  };

  return (
    <div className="app-container">
      <button className="back-button" onClick={() => navigate('/')}>Volver al inicio de sesión</button>
      <h1>Hacer Declaración de Amor</h1>
      <form onSubmit={handleSubmit}>
        <textarea placeholder="Escribe tu declaración" value={declaration} onChange={(e) => setDeclaration(e.target.value)} required></textarea>
        <select value={recipient} onChange={(e) => setRecipient(e.target.value)} required>
          <option value="">Selecciona un destinatario</option>
          {users.map(user => (
            <option key={user.id} value={user.email}>{user.name} {user.surname}</option>
          ))}
          <option value="OTRO">OTRO</option>
        </select>
        {recipient === "OTRO" && (
          <input 
            type="text" 
            placeholder="Escribe el nombre de tu crush" 
            value={otherRecipient} 
            onChange={(e) => setOtherRecipient(e.target.value)} 
            required 
          />
        )}
        <label>
          <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
          Pública
        </label>
        <button type="submit">Enviar Declaración</button>
      </form>
      {error && <p className="error">{error}</p>}
      
      <h2>Declaraciones</h2>
      <ul>
        {declarations.map(decl => (
          <li key={decl.id}>
            <p><strong>Publicado por:</strong> {decl.sender || 'Anónimo'}</p>
            <p>{decl.declaration}</p>
            <p><strong>Destinatario:</strong> {decl.recipient}</p>
            <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => handleMenuOpen(e, decl)}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {auth.currentUser && auth.currentUser.displayName === selectedDecl?.sender && (
                <>
                  <MenuItem onClick={() => { handleMenuClose(); handleEdit(selectedDecl.id, { ...selectedDecl, declaration: prompt("Edita tu declaración:", selectedDecl.declaration) }); }}>Editar</MenuItem>
                  <MenuItem onClick={() => { handleMenuClose(); handleDelete(selectedDecl.id); }}>Eliminar</MenuItem>
                </>
              )}
            </Menu>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
