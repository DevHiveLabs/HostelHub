import React from 'react';
import logo from '../../assets/hstl_logo.jpg';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer-element">
            <div className="footer-container">
                <div className="footer-links">
                    <a href="#home">Home</a>
                    <a href="#features">Features</a>
                    <a href="#contact">Contact</a>
                </div>
                <p className="footer-bottom">
                    © {new Date().getFullYear()} Smart Hostel Management System. All rights reserved.
                </p>
                <img src={logo} alt="Logo" className="footer-logo-bottom" />
            </div>
        </footer>
    );
}

export default Footer;