'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminUsuariosPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', name: '', accessCode: '', arcadinaGalleryUrl: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage(`Usuario ${newUser.email} creado con código ${newUser.accessCode}`);
      setNewUser({ email: '', name: '', accessCode: '', arcadinaGalleryUrl: '' });
      cargarUsuarios();
    } else {
      setMessage(`Error: ${data.error}`);
    }
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser({ ...newUser, accessCode: code });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Gestionar Usuarios</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2>Agregar nuevo usuario</h2>
        {message && <div style={{ background: '#d4edda', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{message}</div>}
        <form onSubmit={handleAddUser}>
          <div style={{ marginBottom: '10px' }}>
            <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="text" placeholder="Nombre" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Código (6 caracteres)" value={newUser.accessCode} onChange={(e) => setNewUser({ ...newUser, accessCode: e.target.value.toUpperCase() })} maxLength={6} required style={{ flex: 1, padding: '8px' }} />
              <button type="button" onClick={generateCode} style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Generar</button>
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input type="url" placeholder="URL de Arcadina" value={newUser.arcadinaGalleryUrl} onChange={(e) => setNewUser({ ...newUser, arcadinaGalleryUrl: e.target.value })} style={{ width: '100%', padding: '8px' }} />
          </div>
          <button type="submit" style={{ background: '#28a745', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Crear Usuario</button>
        </form>
      </div>
      
      <h2>Usuarios existentes</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Nombre</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Código</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>URL Arcadina</th>
           </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{user.email}</td>
              <td style={{ padding: '8px' }}>{user.name || '-'}</td>
              <td style={{ padding: '8px' }}>{user.accessCode}</td>
              <td style={{ padding: '8px' }}>{user.arcadinaGalleryUrl ? '✅' : '❌'}</td>
             </tr>
          ))}
        </tbody>
       </table>
       
       <div style={{ marginTop: '30px' }}>
         <button onClick={() => router.push('/admin')} style={{ padding: '8px 16px', cursor: 'pointer' }}>Volver al Panel</button>
       </div>
    </div>
  );
}