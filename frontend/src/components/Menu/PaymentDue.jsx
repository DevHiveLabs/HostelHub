import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './PaymentDue.css';

function PaymentDue() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Payment Due Reminder',
    message: 'This is a reminder that your payment is due. Please make the payment at your earliest convenience.',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = (e) => {
    e.preventDefault();

    emailjs
      .send('service_t4ck98a', 'template_s6mgx07', formData, 'svCCGxfc8uTnzqJlS')
      .then(
        () => {
          setStatus('✅ Alert sent successfully!');
          setFormData((prev) => ({ ...prev, name: '', email: '' }));
        },
        (error) => {
          console.error(error);
          setStatus('❌ Failed to send alert. Check console.');
        }
      );
  };

  return (
    <div className="pay-container" style={{ maxWidth: '600px', margin: 'auto', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 className="pay-title" style={{ fontSize: '2rem', textAlign: 'center', fontWeight: 'bold', marginBottom: '1.5rem' }}>💳 Fee Payment & Due Alert</h2>
      <form onSubmit={handleSend} className="pay-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <input
          type="email"
          name="email"
          placeholder="Student Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <input
          type="text"
          name="subject"
          value={formData.subject}
          readOnly
          style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <textarea
          name="message"
          value={formData.message}
          rows={5}
          onChange={handleChange}
          style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem', fontSize: '1rem', cursor: 'pointer' }}>
          📨 Send Due Alert
        </button>
      </form>
      {status && <p className="pay-status" style={{ marginTop: '1rem', textAlign: 'center', fontSize: '1rem', fontWeight: '600' }}>{status}</p>}
    </div>
  );
}

export default PaymentDue;
