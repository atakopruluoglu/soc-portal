import React, { useState } from 'react';
import axios from 'axios';

function TicketCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('access_token');

    try {
      await axios.post('http://127.0.0.1:8000/api/tickets/', 
        { title, description }, 
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setMessage('Ticket başarıyla oluşturuldu!');
      setTitle('');
      setDescription('');
    } catch (error) {
      setMessage('Ticket oluşturulurken hata oluştu.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Yeni Ticket Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Başlık" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required
        />
        <br />
        <textarea 
          placeholder="Açıklama" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required
        />
        <br />
        <button type="submit">Gönder</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default TicketCreate;
