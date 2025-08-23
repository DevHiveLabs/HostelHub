import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodMenu = () => {
    const [formData, setFormData] = useState({
        taste: 0,
        quality: 0,
        hygiene: 0,
        services: 0,
        suggestions: '',
    });
    const [userType, setUserType] = useState(null);

    const handleRating = (field, rating) => {
        setFormData({ ...formData, [field]: rating });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setFormData({ ...formData, date: new Date().toLocaleDateString('en-GB').split('/').join(':') });
            formData.hygiene = parseInt(formData.hygiene);
            formData.taste = parseInt(formData.taste);
            formData.quality = parseInt(formData.quality);
            console.log(formData);
            let res = await axios.post('https://shms-backend-zvyd.onrender.com/user-api/feedback', formData);
            console.log(res.data);
        } catch (err) {
            console.error(err);
            alert('Error submitting feedback');
        }
    };

    let [menu, setMenu] = useState(null)
    const [feedbackData, setFeedbackData] = useState([]);
    const [currentDay, setCurrentDay] = useState('');

    async function getData() {
        let res = await axios.get('https://shms-backend-zvyd.onrender.com/admin-api/feedback');
        console.log(res.data);
        setFeedbackData(res.data.feedback);
    }

    useEffect(() => {
        setUserType(localStorage.getItem('userType'));
        setMenu({
            Monday: {
                Breakfast: "Idly",
                Lunch: {
                    Main: "Rice, Dal",
                    Curry: "Aloo Kurma, Brinjal Curry, Mixed Vegetable Curry",
                    Sambar: "Vegetable Sambar"
                },
                Snacks: {
                    Item: "Masala Vada",
                    Beverage: "Tea, Coffee"
                },
                Dinner: {
                    Main: "Rice, Sambar, Chapathi",
                    Curry: "Paneer Butter Masala, Chana Masala, Bhindi Masala",
                    Pickle: "Mango Pickle, Lemon Pickle, Gongura Pickle"
                }
            },
            Tuesday: {
                Breakfast: "Tomato Rice, Jeera Rice, Lemon Rice",
                Lunch: {
                    Main: "Rice, Dal, French Fries",
                    Curry: "Aloo Kurma, Brinjal Curry, Mixed Vegetable Curry",
                    Sambar: "Vegetable Sambar"
                },
                Snacks: {
                    Item: "Samosa",
                    Beverage: "Tea, Coffee"
                },
                Dinner: {
                    Main: "Rice, Sambar",
                    Curry: "Boiled Eggs Fry, Egg Curry",
                    Pickle: "Tomato Pickle, Lime Pickle"
                }
            },
            Wednesday: {
                Breakfast: "Chapathi",
                Lunch: {
                    Main: "Rice, Dal, Sambar",
                    Curry: "Bottle Gourd Curry, Cauliflower Curry, Carrot Peas Masala",
                    Sambar: "Brinjal Sambar"
                },
                Snacks: {
                    Item: "Pakora",
                    Beverage: "Tea, Coffee"
                },
                Dinner: {
                    Main: "Rice, Sambar ",
                    Curry: ", Chicken, Paneer Masala",
                    Pickle: " Amla Pickle"
                }
            },
            Thursday: {
                Breakfast: "Uthappam",
                Lunch: {
                    Main: "Rice, Dal, Ladies Finger Fry",
                    Curry: "Aloo Kurma, Brinjal Curry, Mixed Vegetable Curry",
                    Sambar: "Drumstick Sambar"
                },
                Snacks: {
                    Item: "Murukku",
                    Beverage: "Tea, Coffee"
                },
                Dinner: {
                    Main: "Rice, Sambar, Chapathi",
                    Curry: "Baingan Bharta, Capsicum Masala, Rajma Masala",
                    Pickle: "Ginger Pickle, Mango Pickle, Tomato Pickle"
                }
            },
            Friday: {
                Breakfast: "Mysore Bonda, Pungulu, Puri",
                Lunch: {
                    Main: "Rice, Dal, Sambar",
                    Curry: "Paneer Tikka Masala, Aloo Gobi, Bhindi Fry",
                    Sambar: "Vegetable Sambar"
                },
                Snacks: {
                    Item: "Bhel Puri",
                    Beverage: "Tea, Coffee"
                },
                Dinner: {
                    Main: "Veg Fried Rice, Egg Fried Rice",
                    Curry: "Masala",
                    Pickle: "Mango Pickle "
                }
            },
            Saturday: {
                Breakfast: "Dosa",
                Lunch: {
                    Main: "Rice, Dal, Rasam",
                    Curry: "Cabbage Fry, Carrot Fry, Beetroot Fry",
                    Sambar: "Drumstick Sambar"
                },
                Snacks: {
                    Item: "Banana Bajji",
                    Beverage: "Tea, Coffee"
                },
                Dinner: {
                    Main: "Rice",
                    Curry: "Gongura Chicken, Palak Paneer, Dal Tadka",
                    Pickle: "Tomato Pickle"
                }
            },
            Sunday: {
                Breakfast: "Upma",
                Lunch: {
                    Main: "Rice, Dal, Rasam",
                    Curry: "Mango Pickle, Garlic Pickle, Tomato Pickle",
                    Sambar: "Vegetable Sambar"
                },
                Snacks: {
                    Item: "Pani Puri",
                    Beverage: "Tea, Coffee"
                },
                Dinner: {
                    Main: "Rice, Sambar",
                    Curry: " Chicken Curry, Paneer Curry",
                    Pickle: " Amla Pickle"
                }
            }
        });
        const dayOfWeek = new Date().toLocaleString('default', { weekday: 'long' });
        setCurrentDay(dayOfWeek);
        getData();
    }, []);

    // Calculate average values for feedback
    const calculateAverage = () => {
        if (feedbackData.length === 0) return { taste: 0, quality: 0, hygiene: 0, services: 0 };

        let totalTaste = 0, totalQuality = 0, totalHygiene = 0, totalServices = 0;

        feedbackData.forEach(feedback => {
            totalTaste += feedback.taste;
            totalQuality += feedback.quality;
            totalHygiene += feedback.hygiene;
            totalServices += feedback.services;
        });

        return {
            taste: (totalTaste / feedbackData.length).toFixed(2),
            quality: (totalQuality / feedbackData.length).toFixed(2),
            hygiene: (totalHygiene / feedbackData.length).toFixed(2),
            services: (totalServices / feedbackData.length).toFixed(2)
        };
    };

    const averages = calculateAverage();

    return (
        <div className='row'>
            <div className='col'>
                <div style={{
                    borderRadius: '8px',
                    padding: '20px',
                    width: '80%', /* Reduced the width to make it thinner */
                    margin: 'auto'
                }}>
                    {menu && currentDay && (
                        <div style={{
                            borderRadius: '1rem',
                            padding: '2rem',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                            margin: '15px auto',
                            backgroundColor: 'white'
                        }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1.5rem' }}>
                                {currentDay}'s Menu
                            </h3>
                            <div style={{ marginBottom: '15px' }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Breakfast:</h4>
                                <p>{menu[currentDay]?.Breakfast}</p>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Lunch:</h4>
                                <p><strong>Main:</strong> {menu[currentDay]?.Lunch?.Main}</p>
                                <p><strong>Curry:</strong> {menu[currentDay]?.Lunch?.Curry}</p>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Snacks:</h4>
                                <p><strong>Item:</strong> {menu[currentDay]?.Snacks?.Item}</p>
                                <p><strong>Beverage:</strong> {menu[currentDay]?.Snacks?.Beverage}</p>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <h4 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Dinner:</h4>
                                <p><strong>Main:</strong> {menu[currentDay]?.Dinner?.Main}</p>
                                <p><strong>Curry:</strong> {menu[currentDay]?.Dinner?.Curry}</p>
                                <p><strong>Pickle:</strong> {menu[currentDay]?.Dinner?.Pickle}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {userType === 'user' && <div className="col">
                <div className='feedback-container' style={{
                    padding: '2rem',
                    width: '80%',
                    margin: '15px auto',
                    background: '#ffffff',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 className="feedback-title" style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '1.5rem'
                    }}>Feedback</h2>
                    <form onSubmit={handleSubmit}>
                        <label className="feedback-label" style={{ fontWeight: '600', display: 'block', fontSize: '1rem' }}>Taste:</label>
                        <div className="star-rating" style={{ display: 'flex', gap: '0.4rem', fontSize: '1.8rem', cursor: 'pointer' }}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <span
                                    key={num}
                                    className={`star ${formData.taste >= num ? 'selected' : ''}`}
                                    onClick={() => handleRating('taste', num)}
                                    style={{
                                        color: formData.taste >= num ? 'gold' : '#ccc',
                                        transition: 'color 0.2s ease'
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <br />
                        <label className="feedback-label" style={{ fontWeight: '600', display: 'block', fontSize: '1rem' }}>Quality:</label>
                        <div className="star-rating" style={{ display: 'flex', gap: '0.4rem', fontSize: '1.8rem', cursor: 'pointer' }}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <span
                                    key={num}
                                    className={`star ${formData.quality >= num ? 'selected' : ''}`}
                                    onClick={() => handleRating('quality', num)}
                                    style={{
                                        color: formData.quality >= num ? 'gold' : '#ccc',
                                        transition: 'color 0.2s ease'
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <br />
                        <label className="feedback-label" style={{ fontWeight: '600', display: 'block', fontSize: '1rem' }}>Hygiene:</label>
                        <div className="star-rating" style={{ display: 'flex', gap: '0.4rem', fontSize: '1.8rem', cursor: 'pointer' }}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <span
                                    key={num}
                                    className={`star ${formData.hygiene >= num ? 'selected' : ''}`}
                                    onClick={() => handleRating('hygiene', num)}
                                    style={{
                                        color: formData.hygiene >= num ? 'gold' : '#ccc',
                                        transition: 'color 0.2s ease'
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <br />
                        <label className="feedback-label" style={{ fontWeight: '600', display: 'block', fontSize: '1rem' }}>Services:</label>
                        <div className="star-rating" style={{ display: 'flex', gap: '0.4rem', fontSize: '1.8rem', cursor: 'pointer' }}>
                            {[1, 2, 3, 4, 5].map((num) => (
                                <span
                                    key={num}
                                    className={`star ${formData.services >= num ? 'selected' : ''}`}
                                    onClick={() => handleRating('services', num)}
                                    style={{
                                        color: formData.services >= num ? 'gold' : '#ccc',
                                        transition: 'color 0.2s ease'
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <br />
                        <textarea
                            name="suggestions"
                            value={formData.suggestions}
                            onChange={handleChange}
                            placeholder="Any suggestions..."
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #ccc',
                                borderRadius: '0.5rem',
                                resize: 'vertical',
                                minHeight: '100px'
                            }}
                        ></textarea>
                        <br />
                        <button type="submit" className="btn btn-primary" style={{
                            width: '100%',
                            padding: '10px',
                            background: '#007bff',
                            border: 'none',
                            color: '#fff',
                            fontSize: '1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                        }}>Submit Feedback</button>
                    </form>
                </div>
            </div>}
            {userType === 'admin' && (
                <div className='col'>
                    <div style={{
                        padding: '2rem',
                        width: '95%',
                        margin: '15px auto',
                        background: '#ffffff',
                        borderRadius: '1rem',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            marginBottom: '1.5rem'
                        }}>Feedback Table</h2>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f0f0f0' }}>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Taste</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quality</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Hygiene</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Services</th>
                                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>Suggestion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbackData.map((item, index) => (
                                    <tr key={index}>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.taste}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.quality}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.hygiene}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.services}</td>
                                        <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'left' }}>{item.suggestions}</td>
                                    </tr>
                                ))}
                                <tr style={{ backgroundColor: '#e0e0e0', fontWeight: 'bold' }}>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{averages.taste}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{averages.quality}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{averages.hygiene}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{averages.services}</td>
                                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FoodMenu;
