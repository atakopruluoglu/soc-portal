import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);

  const handleDeleteTicket = async (ticketId) => {
    const confirmed = window.confirm("Bu ticketı silmek istediğinize emin misiniz?");
    if (!confirmed) return;
  
    try {
      const accessToken = localStorage.getItem('access_token');
      await axios.delete(`http://127.0.0.1:8000/api/tickets/${ticketId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("Ticket silindi.");
      fetchTickets();
    } catch (err) {
      alert("Silme işlemi başarısız.");
    }
  };
  
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const accessToken = localStorage.getItem('access_token');
      await axios.patch(`http://127.0.0.1:8000/api/tickets/${ticketId}/`, {
        status: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchTickets();
    } catch (err) {
      alert("Statü güncellenemedi.");
    }
  };
  

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

  const fetchUsers = async () => {
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/api/users/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Kullanıcılar çekilemedi:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchUsers();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem('access_token');
      await axios.post('http://127.0.0.1:8000/api/tickets/', {
        title: newTitle,
        description: newDescription,
        assigned_to: assignedTo || null,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert('Ticket başarıyla oluşturuldu!');
      setNewTitle('');
      setNewDescription('');
      setAssignedTo('');
      fetchTickets();
    } catch (err) {
      console.error('Ticket oluşturulurken hata:', err.response || err.message);
      alert('Ticket oluşturulamadı.');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Hoşgeldiniz!</h1>

      <button onClick={handleLogout} className="logout-button">
        Çıkış Yap
      </button>

      <h2>Yeni Ticket Oluştur</h2>
      <form onSubmit={handleCreateTicket} className="ticket-form">
        <input
          type="text"
          placeholder="Başlık"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
          className="ticket-input"
        />
        <br />
        <textarea
          placeholder="Açıklama"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          required
          className="ticket-textarea"
        />
        <br />
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="ticket-select"
        >
          <option value="">Atanacak kullanıcı seç</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>
        <br />
        <button type="submit" className="submit-button">
          Oluştur
        </button>
      </form>

      <h2>Ticket Listesi</h2>
      {tickets.length === 0 ? (
        <p>Hiç ticket yok.</p>
      ) : (
        <table className="ticket-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Başlık</th>
              <th>Açıklama</th>
              <th>Oluşturan</th>
              <th>Atanan</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>
                <td>{ticket.created_by_email}</td>
                <td>{ticket.assigned_to_email || 'Henüz atanmadı'}</td>
                <td>
        <select
          value={ticket.status}
          onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
          className="status-select"
        >
          <option value="open">Açık</option>
          <option value="in_progress">Devam Ediyor</option>
          <option value="resolved">Çözüldü</option>
          <option value="closed">Kapandı</option>
        </select>
        <button
          onClick={() => handleDeleteTicket(ticket.id)}
          className="delete-button"
          style={{ marginLeft: '10px' }}
        >
          Sil
        </button>
      </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
