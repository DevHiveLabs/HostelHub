import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LostAndFound() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const token = JSON.parse(localStorage.getItem("token"));

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await axios.get('http://localhost:4000/lost-items');
            setItems(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching lost items:", err);
            setLoading(false);
        }
    };

    const claimItem = async (itemId) => {
        try {
            await axios.post(`http://localhost:4000/lost-items/claim/${itemId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchItems(); // Refresh list after claiming
        } catch (err) {
            console.error("Error claiming item:", err);
        }
    };

    if (loading) return <p className="text-center">Loading lost items...</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Lost and Found Items</h1>
            <div style={styles.grid}>
                {items.map((item, index) => (
                    <div key={index} style={styles.card}>
                        <img
                            src={item.image || 'https://via.placeholder.com/150'}
                            alt={item.name}
                            style={styles.image}
                        />
                        <h3>{item.name}</h3>
                        <p><strong>Date Found:</strong> {item.foundDate}</p>
                        <p><strong>Found At:</strong> {item.foundAt}</p>
                        <p><strong>Present At:</strong> {item.presentAt}</p>

                        {item.claimed === "yes" ? (
                            <button
                                style={{ ...styles.button, backgroundColor: 'gray', cursor: 'not-allowed' }}
                                disabled
                            >
                                Claimed
                            </button>
                        ) : (
                            <button
                                style={styles.button}
                                onClick={() => claimItem(item._id)}
                                disabled={!user}
                            >
                                {user ? 'Claim Item' : 'Login to Claim'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
    },
    title: {
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '2rem',
        color: '#343a40'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
    },
    image: {
        width: '100%',
        height: '150px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '10px'
    },
    button: {
        marginTop: '10px',
        padding: '8px 12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    }
};


export default LostAndFound;

