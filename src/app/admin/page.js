'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    Promise.all([
      fetch('/api/admin/logs').then(res => res.json()),
      fetch('/api/admin/users').then(res => res.json())
    ]).then(([logsData, usersData]) => {
      setLogs(logsData.logs || []);
      setUsers(usersData.users || []);
      setLoading(false);
    }).catch(() => router.push('/login'));
  }, [router]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#667eea' }}>Panel de Administración</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button
          onClick={() => router.push('/admin/usuarios')}
          style={{ background: '#17a2b8', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Gestionar Usuarios
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}
          style={{ background: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cerrar sesión
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Usuarios */}
        <div style={{ flex: 1, background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h2>Usuarios registrados ({users.length})</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Código</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Accesos</th>
               </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{user.email}</td>
                  <td style={{ padding: '8px' }}>{user.accessCode}</td>
                  <td style={{ padding: '8px' }}>{user.accessCount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Logs de acceso */}
        <div style={{ flex: 1, background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h2>Últimos accesos ({logs.length})</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Usuario</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Fecha/Hora</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{log.user_email}</td>
                  <td style={{ padding: '8px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="2" style={{ padding: '20px', textAlign: 'center' }}>No hay accesos registrados aún</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}