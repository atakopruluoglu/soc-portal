import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  const fetchTickets = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/tickets/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTickets(response.data);
    } catch (err) {
      console.error('Ticketları çekerken hata oluştu:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('access_token');
      await axios.post('http://127.0.0.1:8000/api/tickets/', {
        title: newTitle,
        description: newDescription,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert('Ticket başarıyla oluşturuldu!');
      setNewTitle('');
      setNewDescription('');
      fetchTickets();
    } catch (err) {
      console.error('Ticket oluşturulurken hata:', err.response || err.message);
      alert('Ticket oluşturulamadı.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hoşgeldiniz!</h1>

      <button
        onClick={handleLogout}
        style={{
          marginTop: '20px',
          marginBottom: '40px',
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Çıkış Yap
      </button>

      <h2>Yeni Ticket Oluştur</h2>
      <form onSubmit={handleCreateTicket} style={{ marginBottom: '40px' }}>
        <input
          type="text"
          placeholder="Başlık"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
          style={{ padding: '8px', width: '300px', marginBottom: '10px' }}
        />
        <br />
        <textarea
          placeholder="Açıklama"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          required
          style={{ padding: '8px', width: '300px', height: '100px', marginBottom: '10px' }}
        />
        <br />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Oluştur
        </button>
      </form>

      <h2>Ticket Listesi</h2>
      {tickets.length === 0 ? (
        <p>Hiç ticket yok.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Başlık</th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Açıklama</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ticket.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ticket.title}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>{ticket.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
