import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Complaint = () => {
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        urgency: '',
    });
    const [userType, setUserType] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (user && user.room && user.room.roomNo) {
                const complaintData = {
                    ...formData,
                    roomNo: user.room.roomNo,
                };

                setFormData(complaintData);
                console.log(complaintData);

                await axios.post('https://shms-backend-zvyd.onrender.com/user-api/complaints', complaintData);
                alert('Complaint submitted successfully');
            } else {
                throw new Error('User or room information is missing');
            }
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    useEffect(() => {
        const type = localStorage.getItem('userType');
        setUserType(type);

        if (type === 'admin') {
            async function fetchComplaints() {
                setLoading(true);
                try {
                    const response = await axios.get('https://shms-backend-zvyd.onrender.com/admin-api/complaints');
                    setComplaints(response.data.complaints);
                } catch (err) {
                    setError('Failed to fetch complaints');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }

            fetchComplaints();
        }
    }, []);

    return (
        <div className="container mt-4">
            <div className="mx-auto" style={{ width: '60%' }}>
                {userType === 'user' && (
                    <div>
                        <h2 className="mb-4">Complaint & Maintenance Form</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3 row align-items-center">
                                <label className="col-sm-3 col-form-label">Category:</label>
                                <div className="col-sm-9">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="form-select"
                                    >
                                        <option value="">-- Select Category --</option>
                                        <option value="Electrical">Electrical</option>
                                        <option value="Plumbing">Plumbing</option>
                                        <option value="Cleanliness">Cleanliness</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3 row align-items-center">
                                <label className="col-sm-3 col-form-label">Urgency:</label>
                                <div className="col-sm-9">
                                    <select
                                        name="urgency"
                                        value={formData.urgency}
                                        onChange={handleChange}
                                        required
                                        className="form-select"
                                    >
                                        <option value="">-- Select Urgency --</option>
                                        <option value="Low">Low</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3 row align-items-start">
                                <label className="col-sm-3 col-form-label">Description:</label>
                                <div className="col-sm-9">
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Explain the issue in detail..."
                                        required
                                        className="form-control"
                                        rows="4"
                                    />
                                </div>
                            </div>

                            <div className="text-center">
                                <button type="submit" className="btn btn-primary w-50">
                                    Submit Complaint
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {userType === 'admin' && (
                    <div className="px-3">
                        <h2 className="mb-3">All Complaints</h2>
                        {loading && <p>Loading complaints...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <table className="table table-bordered mt-3">
                            <thead className="table-light">
                                <tr>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Room No</th>
                                    <th>Urgency</th>
                                </tr>
                            </thead>
                            <tbody>
                                {complaints.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center">No complaints available</td>
                                    </tr>
                                ) : (
                                    complaints.map((complaint, index) => (
                                        <tr key={index}>
                                            <td>{complaint.category}</td>
                                            <td>{complaint.description}</td>
                                            <td>{complaint.roomNo}</td>
                                            <td>{complaint.urgency}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Complaint;
