import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './UserProfile.css';

function UserProfile() {
    const [currentUser, setCurrentUser] = useState(null);
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    function cap(s) {
        return s?.charAt(0).toUpperCase() + s?.slice(1);
    }

    // Fetch user details from localStorage on component mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            navigate('/signin');
        } else {
            setCurrentUser(user);
        }
    }, [navigate]);

    // Fetch userType details from localStorage
    useEffect(() => {
        setUserType(localStorage.getItem('userType'));
    }, []);

    if (!currentUser) return null;

    const cardStyle = {
        backgroundImage: 'linear-gradient(135deg, #f2f2f2, #f8f9fa)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        padding: '20px',
        height: '100%'
    };

    return (
        <div className="p-4 user-profile text-center" style={{ minHeight: '80vh' }}>
            <h2 className="mb-4 fw-bold">Welcome back, {cap(currentUser.name)}</h2>
            <div className="row g-4 text-start">
                <div className="col-md-4">
                    <div style={cardStyle}>
                        <h5 className="fw-semibold mb-3 text-success">Personal Details</h5>
                        <p><strong>Name:</strong> {currentUser.name}</p>
                        {userType === 'user' && <p><strong>Email:</strong> {currentUser.email}</p>}
                        {userType === 'user' && <p><strong>Gender:</strong> {currentUser.gender}</p>}
                        <p><strong>Mobile:</strong> {currentUser.mobileNumber}</p>
                    </div>
                </div>

                {userType === 'user' && (
                    <div className="col-md-4">
                        <div style={cardStyle}>
                            <h5 className="fw-semibold mb-3 text-primary">Room Details</h5>
                            <p><strong>Room No:</strong> {currentUser.room.roomNo}</p>
                            <p><strong>Room Type:</strong> {currentUser.room.roomType}</p>
                            <p><strong>Sharing:</strong> {currentUser.room.sharingNo}</p>
                        </div>
                    </div>
                )}

                {userType === 'user' && (
                    <div className="col-md-4">
                        <div style={cardStyle}>
                            <h5 className="fw-semibold mb-3 text-danger">Payment Details</h5>
                            <p><strong>Balance:</strong> ₹{currentUser.paymentBalance}</p>
                            <p><strong>Status:</strong> {currentUser.paymentStatus ? "Complete" : "Incomplete"}</p>
                            <p><strong>Due Date:</strong> {'10-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + new Date().getFullYear()}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
