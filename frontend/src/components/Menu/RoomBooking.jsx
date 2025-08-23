import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

function RoomBooking() {
    // State to store fetched room data and the booking message
    const [rooms, setRooms] = useState([]);
    const [message, setMessage] = useState(""); // New state for message

    // React Hook Form initialization
    const { register, handleSubmit, reset } = useForm();

    // Function to fetch rooms based on form data
    async function fetchRooms(data) {
        // Adding email to the form data from localStorage
        data.email = JSON.parse(localStorage.getItem("user")).email;
        let res = await axios.post('https://shms-backend-zvyd.onrender.com/rooms-api/getRooms', data);
        if (res.data.message === "Rooms found successfully.") {
            setRooms(res.data.matchedRooms);
        } else {
            console.log(res.data.message);
        }
    };

    // Booking function
    async function handleBooking(roomNo) {
        let room = rooms.filter((ele) => ele.roomNo === roomNo)[0];
        let roomSent = {
            email: JSON.parse(localStorage.getItem("user")).email,
            floor: room.floor,
            roomNo: roomNo,
            roomType: room.roomType,
            roomCapacity: room.roomCapacity
        };

        // Making the booking API call
        let res = await axios.post('https://shms-backend-zvyd.onrender.com/rooms-api/bookRooms', roomSent);
        setMessage(res.data.message); // Setting the message based on booking response
    };

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Room Booking</h2>

            {/* First section of the form */}
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(fetchRooms)}>
                                {/* Row for horizontal alignment */}
                                <div className="row mb-3">
                                    <div className="col-4 d-flex align-items-center">
                                        <label className="form-label">Floor</label>
                                    </div>
                                    <div className="col-8">
                                        <input 
                                            {...register('floor', { required: true })} 
                                            className="form-control form-control-sm" 
                                            type="number" 
                                            placeholder="Enter Floor Number"
                                        />
                                    </div>
                                </div>

                                {/* Row for Room Type */}
                                <div className="row mb-3">
                                    <div className="col-4 d-flex align-items-center">
                                        <label className="form-label">Room Type</label>
                                    </div>
                                    <div className="col-8">
                                        <select {...register('roomType', { required: true })} className="form-select form-select-sm">
                                            <option value="AC">AC</option>
                                            <option value="Non-AC">Non-AC</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Row for Room Capacity */}
                                <div className="row mb-3">
                                    <div className="col-4 d-flex align-items-center">
                                        <label className="form-label">Room Capacity</label>
                                    </div>
                                    <div className="col-8">
                                        <select {...register('roomCapacity', { required: true })} className="form-select form-select-sm">
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-100">Search Rooms</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Display fetched rooms in grid layout */}
            <div className="row row-cols-1 row-cols-md-3 g-4">
                {rooms.length > 0 ? (
                    rooms.map((room) => (
                        <div key={room.roomNo} className="col">
                            <div className="card h-100">
                                <img
                                    src={room.image}
                                    alt={`Room No: ${room.roomNo}`}
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">Room No: {room.roomNo}</h5>
                                    <p className="card-text">Type: {room.roomType}</p>
                                    <p className="card-text">Capacity: {room.roomCapacity}</p>
                                    <p className="card-text">Vacancy: {room.vacancy}</p>
                                    <p className="card-text">Floor: {room.floor}</p>
                                    <button onClick={() => handleBooking(room.roomNo)} className="btn btn-success w-100">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-12">No rooms available</p>
                )}
            </div>

            {/* Display booking message */}
            {message && (
                <div className="alert alert-info mt-3">
                    {message}
                </div>
            )}

            {/* Optional: Reset the form */}
            <div className="text-center mt-3">
                <button onClick={() => reset()} className="btn btn-secondary">Reset Form</button>
            </div>
        </div>
    );
}

export default RoomBooking;
