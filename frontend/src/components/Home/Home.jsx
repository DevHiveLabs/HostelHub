import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home1() {
    const navigate = useNavigate();

    return (
        <div className="home-background">
            <div className="home-overlay">
                <div className="home-content">
                    <h1>Smart Hostel Management System</h1>
                    <p>Efficient, Reliable, and Digital</p>
                    <button onClick={() => navigate('/signup')}>Get Started</button>
                </div>
            </div>
        </div>
    );
}

export default Home1;