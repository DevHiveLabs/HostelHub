// File: FoodMenu.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import './FoodMenu.css';

const WEEKLY_MENU = {
    Monday: {
        Breakfast: 'Idly',
        Lunch: {
            Main: 'Rice, Dal',
            Curry: 'Aloo Kurma, Brinjal Curry, Mixed Vegetable Curry',
            Sambar: 'Vegetable Sambar',
        },
        Snacks: { Item: 'Masala Vada', Beverage: 'Tea, Coffee' },
        Dinner: {
            Main: 'Rice, Sambar, Chapathi',
            Curry: 'Paneer Butter Masala, Chana Masala, Bhindi Masala',
            Pickle: 'Mango Pickle, Lemon Pickle, Gongura Pickle',
        },
    },
    Tuesday: {
        Breakfast: 'Tomato Rice, Jeera Rice, Lemon Rice',
        Lunch: {
            Main: 'Rice, Dal, French Fries',
            Curry: 'Aloo Kurma, Brinjal Curry, Mixed Vegetable Curry',
            Sambar: 'Vegetable Sambar',
        },
        Snacks: { Item: 'Samosa', Beverage: 'Tea, Coffee' },
        Dinner: {
            Main: 'Rice, Sambar',
            Curry: 'Boiled Eggs Fry, Egg Curry',
            Pickle: 'Tomato Pickle, Lime Pickle',
        },
    },
    Wednesday: {
        Breakfast: 'Chapathi',
        Lunch: {
            Main: 'Rice, Dal, Sambar',
            Curry: 'Bottle Gourd Curry, Cauliflower Curry, Carrot Peas Masala',
            Sambar: 'Brinjal Sambar',
        },
        Snacks: { Item: 'Pakora', Beverage: 'Tea, Coffee' },
        Dinner: { Main: 'Rice, Sambar ', Curry: ', Chicken, Paneer Masala', Pickle: ' Amla Pickle' },
    },
    Thursday: {
        Breakfast: 'Uthappam',
        Lunch: {
            Main: 'Rice, Dal, Ladies Finger Fry',
            Curry: 'Aloo Kurma, Brinjal Curry, Mixed Vegetable Curry',
            Sambar: 'Drumstick Sambar',
        },
        Snacks: { Item: 'Murukku', Beverage: 'Tea, Coffee' },
        Dinner: {
            Main: 'Rice, Sambar, Chapathi',
            Curry: 'Baingan Bharta, Capsicum Masala, Rajma Masala',
            Pickle: 'Ginger Pickle, Mango Pickle, Tomato Pickle',
        },
    },
    Friday: {
        Breakfast: 'Mysore Bonda, Pungulu, Puri',
        Lunch: {
            Main: 'Rice, Dal, Sambar',
            Curry: 'Paneer Tikka Masala, Aloo Gobi, Bhindi Fry',
            Sambar: 'Vegetable Sambar',
        },
        Snacks: { Item: 'Bhel Puri', Beverage: 'Tea, Coffee' },
        Dinner: { Main: 'Veg Fried Rice, Egg Fried Rice', Curry: 'Masala', Pickle: 'Mango Pickle ' },
    },
    Saturday: {
        Breakfast: 'Dosa',
        Lunch: {
            Main: 'Rice, Dal, Rasam',
            Curry: 'Cabbage Fry, Carrot Fry, Beetroot Fry',
            Sambar: 'Drumstick Sambar',
        },
        Snacks: { Item: 'Banana Bajji', Beverage: 'Tea, Coffee' },
        Dinner: { Main: 'Rice', Curry: 'Gongura Chicken, Palak Paneer, Dal Tadka', Pickle: 'Tomato Pickle' },
    },
    Sunday: {
        Breakfast: 'Upma',
        Lunch: {
            Main: 'Rice, Dal, Rasam',
            Curry: 'Mango Pickle, Garlic Pickle, Tomato Pickle',
            Sambar: 'Vegetable Sambar',
        },
        Snacks: { Item: 'Pani Puri', Beverage: 'Tea, Coffee' },
        Dinner: { Main: 'Rice, Sambar', Curry: ' Chicken Curry, Paneer Curry', Pickle: ' Amla Pickle' },
    },
};

export default function FoodMenu() {
    const [formData, setFormData] = useState({ taste: 0, quality: 0, hygiene: 0, services: 0, suggestions: '' });
    const [userType, setUserType] = useState(null);
    const [feedbackData, setFeedbackData] = useState([]);
    const [currentDay, setCurrentDay] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const timersRef = useRef({});
    // inside FoodMenu component
    const [hoverRating, setHoverRating] = useState({ taste: 0, quality: 0, hygiene: 0, services: 0 });

    const handleMouseEnter = (field, rating) => {
        setHoverRating((prev) => ({ ...prev, [field]: rating }));
    };

    const handleMouseLeave = (field) => {
        setHoverRating((prev) => ({ ...prev, [field]: 0 }));
    };

    const getWeekday = () => new Date().toLocaleString('default', { weekday: 'long' });

    useEffect(() => {
        const setDayNow = () => setCurrentDay(getWeekday());
        setDayNow();
        const now = new Date();
        const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const msUntilNextMidnight = nextMidnight - now;
        timersRef.current.midnightTimeout = setTimeout(() => {
            setDayNow();
            timersRef.current.midnightInterval = setInterval(setDayNow, 24 * 60 * 60 * 1000);
        }, msUntilNextMidnight + 50);
        return () => {
            clearTimeout(timersRef.current.midnightTimeout);
            clearInterval(timersRef.current.midnightInterval);
        };
    }, []);

    useEffect(() => {
        setUserType(localStorage.getItem('userType'));
    }, []);

    useEffect(() => {
        async function fetchFeedback() {
            try {
                const res = await axios.get('https://shms-backend-zvyd.onrender.com/admin-api/feedback');
                setFeedbackData(res.data.feedback || []);
            } catch (err) {
                console.error('Failed to fetch feedback', err);
            }
        }
        fetchFeedback();
    }, []);

    const averages = useMemo(() => {
        if (!feedbackData || feedbackData.length === 0) return { taste: '0.00', quality: '0.00', hygiene: '0.00', services: '0.00' };
        const totals = feedbackData.reduce(
            (acc, f) => ({
                taste: acc.taste + Number(f.taste || 0),
                quality: acc.quality + Number(f.quality || 0),
                hygiene: acc.hygiene + Number(f.hygiene || 0),
                services: acc.services + Number(f.services || 0),
            }),
            { taste: 0, quality: 0, hygiene: 0, services: 0 }
        );
        return {
            taste: (totals.taste / feedbackData.length).toFixed(2),
            quality: (totals.quality / feedbackData.length).toFixed(2),
            hygiene: (totals.hygiene / feedbackData.length).toFixed(2),
            services: (totals.services / feedbackData.length).toFixed(2),
        };
    }, [feedbackData]);

    const handleRating = (field, rating) => {
        setFormData((prev) => ({ ...prev, [field]: rating }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        const taste = parseInt(formData.taste || '0', 10);
        const quality = parseInt(formData.quality || '0', 10);
        const hygiene = parseInt(formData.hygiene || '0', 10);
        const services = parseInt(formData.services || '0', 10);
        if ([taste, quality, hygiene, services].some((v) => isNaN(v) || v < 1 || v > 5)) {
            setMessage({ type: 'error', text: 'Please give a rating between 1 and 5 for all categories.' });
            return;
        }
        const payload = { taste, quality, hygiene, services, suggestions: formData.suggestions || '', date: new Date().toISOString() };
        try {
            setSubmitting(true);
            await axios.post('https://shms-backend-zvyd.onrender.com/user-api/feedback', payload);
            setMessage({ type: 'success', text: 'Feedback submitted — thank you!' });
            setFormData({ taste: 0, quality: 0, hygiene: 0, services: 0, suggestions: '' });
            try {
                const updated = await axios.get('https://shms-backend-zvyd.onrender.com/admin-api/feedback');
                setFeedbackData(updated.data.feedback || []);
            } catch { }
        } catch {
            setMessage({ type: 'error', text: 'Error submitting feedback. Please try again later.' });
        } finally {
            setSubmitting(false);
        }
    };

    const weekdayNames = Object.keys(WEEKLY_MENU);
    const currentIndex = weekdayNames.indexOf(currentDay || 'Monday');
    const goToPrevious = () => setCurrentDay(weekdayNames[(currentIndex - 1 + weekdayNames.length) % weekdayNames.length]);
    const goToNext = () => setCurrentDay(weekdayNames[(currentIndex + 1) % weekdayNames.length]);
    const menu = WEEKLY_MENU[currentDay] || WEEKLY_MENU[weekdayNames[0]];

    return (
        <div className="foodmenu-wrapper">
            <div className="foodmenu-grid">
                <section className="menu-card">
                    <div className="menu-header">
                        <h3 className="menu-title">{currentDay}'s Menu</h3>
                        <div className="menu-controls">
                            <button onClick={goToPrevious} aria-label="previous">◀</button>
                            <button onClick={() => setCurrentDay(getWeekday())}>Today</button>
                            <button onClick={goToNext} aria-label="next">▶</button>
                        </div>
                    </div>

                    <div className="menu-body">
                        <div className="menu-section">
                            <h4>Breakfast</h4>
                            <p>{menu?.Breakfast}</p>
                        </div>

                        <div className="menu-section">
                            <h4>Lunch</h4>
                            <p><strong>Main:</strong> {menu?.Lunch?.Main}</p>
                            <p><strong>Curry:</strong> {menu?.Lunch?.Curry}</p>
                            {menu?.Lunch?.Sambar && <p><strong>Sambar:</strong> {menu?.Lunch?.Sambar}</p>}
                        </div>

                        <div className="menu-section">
                            <h4>Snacks</h4>
                            <p><strong>Item:</strong> {menu?.Snacks?.Item}</p>
                            <p><strong>Beverage:</strong> {menu?.Snacks?.Beverage}</p>
                        </div>

                        <div className="menu-section">
                            <h4>Dinner</h4>
                            <p><strong>Main:</strong> {menu?.Dinner?.Main}</p>
                            <p><strong>Curry:</strong> {menu?.Dinner?.Curry}</p>
                            <p><strong>Pickle:</strong> {menu?.Dinner?.Pickle}</p>
                        </div>
                    </div>
                </section>

                {userType === 'user' && (
                    <aside className="panel-card">
                        <h2>Feedback</h2>
                        <form onSubmit={handleSubmit} className="feedback-form">
                            {['taste', 'quality', 'hygiene', 'services'].map((field) => (
                                <div key={field} className="form-row">
                                    <label className="form-label">{field}</label>
                                    <div className="stars">
                                        {[1, 2, 3, 4, 5].map((num) => {
                                            const isActive = hoverRating[field]
                                                ? num <= hoverRating[field] // show hover highlight
                                                : num <= formData[field];   // fallback to saved rating
                                            return (
                                                <span
                                                    key={num}
                                                    className={isActive ? "active" : ""}
                                                    onClick={() => handleRating(field, num)}
                                                    onMouseEnter={() => handleMouseEnter(field, num)}
                                                    onMouseLeave={() => handleMouseLeave(field)}
                                                >
                                                    ★
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}


                            <div className="form-row">
                                <textarea name="suggestions" value={formData.suggestions} onChange={handleChange} placeholder="Any suggestions..." rows={4} />
                            </div>

                            {message && <div className={`form-message ${message.type}`}>{message.text}</div>}

                            <button type="submit" className="submit-btn" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Feedback'}</button>
                        </form>
                    </aside>
                )}

                {userType === 'admin' && (
                    <aside className="panel-card">
                        <h2>Feedback Table</h2>
                        <div className="table-wrap">
                            <table className="feedback-table">
                                <thead>
                                    <tr>
                                        <th>Taste</th>
                                        <th>Quality</th>
                                        <th>Hygiene</th>
                                        <th>Services</th>
                                        <th>Suggestion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feedbackData.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.taste}</td>
                                            <td>{item.quality}</td>
                                            <td>{item.hygiene}</td>
                                            <td>{item.services}</td>
                                            <td>{item.suggestions}</td>
                                        </tr>
                                    ))}
                                    <tr className="averages-row">
                                        <td>{averages.taste}</td>
                                        <td>{averages.quality}</td>
                                        <td>{averages.hygiene}</td>
                                        <td>{averages.services}</td>
                                        <td>-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
