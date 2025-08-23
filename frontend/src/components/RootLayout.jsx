import { Outlet } from "react-router-dom";
import Header from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { FaComments } from 'react-icons/fa'; 
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";

function RootLayout() {
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false); // Show loading indicator

    const toggleChat = () => {
        setShowChat(!showChat);
    };

    const handleMessageSend = async () => {
        if (input.trim() === '') return;

        // Add user message to chat
        setMessages((prevMessages) => [...prevMessages, { text: input, sender: 'user' }]);
        setInput('');
        setLoading(true); // Show loading while fetching response

        try {
            const ai = new GoogleGenAI({ apiKey: "AIzaSyAFN-Q65qEquAaH3MFQElmjA1mGWY1zfUM" }); // Replace with your API Key

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: "Answer only based on given information if out of asked deny that you cant answer as you dont have information. Information: The Smart Hostel Management System is a web-based application designed to efficiently manage hostel operations. The system includes three types of user logins: admin, user, and security. The user begins by registering through a form that collects details such as name, email, gender, password, and mobile number, among other necessary fields. Once the registration is successful, the user can log in to the system. After logging in, the user is directed to the home page, which contains a menu dropdown and a profile dropdown. In the menu dropdown, the first option is room booking. In this section, the user fills out a form to book a room. The form requires the floor number, type of room (AC or Non-AC), and the sharing type (2, 3, or 4-sharing). Based on the input, the system fetches room data that matches the criteria. If no room is available with the requested features, the system notifies the user about the unavailability and specifies the reason, such as no rooms left on that floor or no rooms of that type available on this floor. If matching data is found, the available room details are displayed along with a book button. Upon clicking the button, one bed in that particular room will be booked. The hostel includes AC and Non-AC rooms with 2, 3, and 4-sharing options across 10 floors, with 20 rooms on each floor.The second option is fee payment. This section allows users to pay their hostel fees using a payment gateway. The user is required to enter their personal details and complete the transaction through the integrated payment system. The third option is attendance. Users must perform a daily check-in and check-out to maintain their attendance records. This section includes visual charts such as pie charts and bar charts to show statistics like present days, absent days, leaves, and holidays. Additionally, there is a calendar feature to store and visualize the same data. There is also a leave request form in this section, where the user can submit a request to the admin by filling in the reason for leave, check-out date, and check-in date. If the reason is valid, the admin will approve the request. When the user is leaving the hostel, the security will check whether the leave request has been accepted by the admin. If it is approved, the security will allow the user to move out using proper authentication. The fourth option is complaint. This section allows users to file complaints regarding any issue within the hostel premises. A complaint form is provided, which includes fields for category such as electrical, plumbing, or furniture, urgency level such as low, moderate, or high, and a description of the problem. The submitted complaint is sent to the admin, who can then view and take appropriate action to resolve it. The fifth option is food menu. This section displays the daily food menu, which updates according to the day. Users can also submit feedback through a form that includes ratings from 1 to 5 for quality, taste, and cleanliness, along with a description field. The feedback is sent to the admin for review. In the profile dropdown, the first option is profile. This displays the user’s complete information in three sections. The personal details section includes name, email, gender, and mobile number. The room details section displays room number, type of room, and sharing type. The payment details section shows the due date, balance amount to be paid, and payment status, which indicates whether the payment is completed or not. The second option in the profile dropdown is admin details. This section displays admin contact information, including name, email, and contact number. The final option is sign out, which allows the user to securely log out of the system. This is conversation from you. The following are messages given in bracket sent by user or bot. User is me and bot is you. Just reply to the present input which is given in last without any brackets. Answer as if you have gone through this conversation with me."+messages.map(msg => "("+msg.sender+": "+msg.text+"), ").join(" ")+" "+input,
            });

            const botMessageText = response.text;

            // Ensure state updates **AFTER** fetching AI response
            setMessages((prevMessages) => [...prevMessages, { text: botMessageText, sender: 'bot' }]);
        } catch (error) {
            console.error("Error sending message to bot:", error);
            setMessages((prevMessages) => [...prevMessages, { text: error.message, sender: 'bot' }]);
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    return (
        <div className="position-relative">
            <div>
                <Header />
                <div style={{ minHeight: '75vh' }}>
                    <Outlet />
                </div>
                <Footer />
            </div>

            {/* Chat icon */}
            <div
                className="position-fixed bottom-0 end-0 mb-4 me-4"
                style={{
                    backgroundColor: '#25d366', // WhatsApp green color
                    borderRadius: '50%',
                    padding: '15px',
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                onClick={toggleChat} // Toggle chat on click
            >
                <FaComments size={40} />
            </div>

            {/* Sliding chat panel */}
            <div
                className={`position-fixed top-0 end-0 h-100 bg-white shadow-lg ${showChat ? 'slide-in' : 'slide-out'}`}
                style={{
                    width: '400px', // Width of a typical mobile screen
                    transition: 'transform 0.3s ease-in-out',
                    transform: showChat ? 'translateX(0)' : 'translateX(100%)',
                }}
            >
                <div style={{ padding: '20px', position: 'relative' }}>
                    {/* Close icon (cross mark) */}
                    <span
                        onClick={toggleChat}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            fontSize: '24px',
                            cursor: 'pointer',
                        }}
                    >
                        ×
                    </span>

                    <h5>Chat with us!</h5>
                    <p>Welcome to the support chat.</p>

                    {/* Chat messages */}
                    <div className="chat-container" style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
                        <div className="chat-box">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message ${message.sender}`}
                                    style={{
                                        display: 'flex',
                                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: '10px 15px',
                                            borderRadius: '10px',
                                            maxWidth: '75%',
                                            backgroundColor: message.sender === 'user' ? '#6c757d' : '#007bff', // bg-secondary for user, blue for bot
                                            color: 'white',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {message.sender === 'bot' ? <ReactMarkdown>{message.text}</ReactMarkdown> : message.text}
                                    </div>
                                </div>
                            ))}
                            {loading && <div className="message bot">Typing...</div>} {/* Show loading */}
                        </div>
                    </div>

                    {/* Message input */}
                    <div className="input-box" style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleMessageSend()}
                            disabled={loading}
                            style={{ flex: 1, padding: '10px' }}
                        />
                        <button
                            onClick={handleMessageSend}
                            disabled={loading}
                            style={{ marginLeft: '10px', padding: '10px 15px' }}
                        >
                            {loading ? "Sending..." : "Send"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RootLayout;
