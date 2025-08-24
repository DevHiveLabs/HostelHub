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
    formData.email = JSON.parse(localStorage.getItem('user')).email;
    try {
      const response = await fetch(
        'https://shms-backend-zvyd.onrender.com/leave-api/leaveRequests',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

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
      <h2 style={styles.heading}>Leave Request</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Reason */}
        <div>
          <label style={styles.label}>Reason</label>
          <div style={styles.radioGroup}>
            {reasons.map((r) => (
              <label key={r} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={formData.reason === r}
                  onChange={handleChange}
                  style={styles.radioInput}
                  required
                />
                <span>{r}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div style={styles.dateGroup}>
          <div style={styles.dateField}>
            <label style={styles.label}>Check-Out</label>
            <input
              type="date"
              name="checkOutDate"
              value={formData.checkOutDate}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.dateField}>
            <label style={styles.label}>Check-In</label>
            <input
              type="date"
              name="checkInDate"
              value={formData.checkInDate}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        </div>

        {/* Message */}
        <textarea
          name="message"
          placeholder="Additional message..."
          value={formData.message}
          onChange={handleChange}
          rows={4}
          style={styles.textarea}
        />

        {/* Submit */}
        <button type="submit" style={styles.button}>
          Submit Request
        </button>
        {status && <p style={styles.status}>{status}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '480px',
    margin: '3rem auto',
    padding: '2rem',
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
    fontFamily: 'system-ui, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#555',
    marginBottom: '0.3rem',
    display: 'block',
  },
  radioGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.8rem',
    marginTop: '0.5rem',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.4rem 0.8rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  radioInput: {
    accentColor: '#4CAF50',
  },
  dateGroup: {
    display: 'flex',
    gap: '1rem',
  },
  dateField: {
    flex: 1,
  },
  input: {
    width: '100%',
    padding: '0.6rem 0.8rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border 0.2s ease',
  },
  textarea: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '10px',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'none',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '0.8rem',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  status: {
    textAlign: 'center',
    marginTop: '0.8rem',
    fontSize: '0.9rem',
    color: '#444',
  },
};

export default LeaveRequest;
