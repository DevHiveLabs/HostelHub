
  const updateApproval = async (email, checkOutDate, decision) => {
    try {
      const response = await fetch('https://shms-backend-zvyd.onrender.com/leave-api/approve', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, checkOutDate, decision }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus(`✅ Request ${decision}`);
        fetchLeaveRequests(); // Refresh list
      } else {
        setStatus(result.message);
      }
    } catch (err) {
      console.error(err);
      setStatus('Error while updating approval');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Leave Requests</h2>
      {leaveRequests.length === 0 ? (
        <p>No leave requests.</p>
      ) : (
        leaveRequests.map((req, idx) => (
          <div key={idx} style={styles.card}>
            <p><strong>Email:</strong> {req.email}</p>
            <p><strong>Reason:</strong> {req.reason}</p>
            <p><strong>From:</strong> {req.checkOutDate}</p>
            <p><strong>To:</strong> {req.checkInDate}</p>
            <p><strong>Status:</strong> {req.approval}</p>
            <p><strong>Message:</strong> {req.message}</p>

            {req.approval === 'pending' && (
              <div style={styles.buttonGroup}>
                <button
                  style={styles.approveBtn}
                  onClick={() => updateApproval(req.email, req.checkOutDate, 'accepted')}
                >
                  Approve
                </button>
                <button
                  style={styles.rejectBtn}
                  onClick={() => updateApproval(req.email, req.checkOutDate, 'rejected')}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
      {status && <p>{status}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '1rem',
  },
  card: {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '10px',
    marginBottom: '1.5rem',
    backgroundColor: '#f9f9f9',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  approveBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  rejectBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default AdminApproval;
