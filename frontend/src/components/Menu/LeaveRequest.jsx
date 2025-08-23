import React, { useState } from 'react';

function LeaveRequest() {
  const [formData, setFormData] = useState({
    reason: '',
    checkOutDate: '',
    checkInDate: '',
    approval: 'pending',
    message: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.email=JSON.parse(localStorage.getItem('user')).email
    console.log(formData)
    try {
      const response = await fetch('https://shms-backend-zvyd.onrender.com/leave-api/leaveRequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('✅ Leave request submitted successfully!');
        setFormData({
          reason: '',
          checkOutDate: '',
          checkInDate: '',
          approval: 'pending',
          message: '',
        });
      } else {
        setStatus(`❌ ${data.message || 'Failed to submit request.'}`);
      }
    } catch (err) {
      setStatus('❌ Something went wrong.');
      console.error(err);
    }
  };

  const reasons = ['Sick Leave', 'Personal', 'Emergency', 'Vacation', 'Other'];

  return (
    <div style={styles.container}>
      <h2>Leave Request Form</h2>
      <form onSubmit={handleSubmit} style={styles.form}>

        <div>
          <label>Reason for Leave:</label>
          <div style={styles.radioGroup}>
            {reasons.map((r) => (
              <label key={r} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={formData.reason === r}
                  onChange={handleChange}
                  required
                />
                {r}
              </label>
            ))}
          </div>
        </div>

        <label>Check-Out Date</label>
        <input
          type="date"
          name="checkOutDate"
          value={formData.checkOutDate}
          onChange={handleChange}
          required
        />

        <label>Check-In Date</label>
        <input
          type="date"
          name="checkInDate"
          value={formData.checkInDate}
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          placeholder="Additional message..."
          value={formData.message}
          onChange={handleChange}
          rows={4}
        />

        <button type="submit">Submit Leave Request</button>
        {status && <p>{status}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '0.5rem',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.3rem',
  },
};

export default LeaveRequest;
