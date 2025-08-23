import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Signup.css';

function Signup({ fun }) {
    let [err, setErr] = useState('');
    let navigate = useNavigate();
    let {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    async function handleFormSubmit(newUser) {
        newUser.room = {
            roomNo: 0,
            roomType: "Not Applicable",
            roomCapacity: 0,
            floor: 0
        }
        newUser.checkInOut = []
        newUser.isPresent = false
        newUser.joinDate = ""
        newUser.leaveRequests = []
        newUser.paymentBalance = 0
        newUser.paymentStatus = true
        console.log(newUser)
        const res = await axios.post('https://shms-backend-zvyd.onrender.com/user-api/user', newUser);
        if (res.data.message === "User created") {
            console.log(res.data.message)
        } else {
            setErr(res.data.message);
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center w-100 h-100">
            <div className="w-100 px-3" style={{ maxWidth: '600px' }}>
                <h1 className="display-3 fs-3 text-center mb-3">Signup</h1>
                {err.length !== 0 && <p className="text-danger fs-5 text-center">{err}</p>}

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <div className="row mb-3 align-items-center">
                        <label htmlFor="name" className="col-md-3 col-form-label">Name</label>
                        <div className="col-md-9">
                            <input
                                type="text"
                                id="name"
                                className="form-control shadow-sm"
                                placeholder="Full Name"
                                {...register("name", { required: true })}
                            />
                            {errors.name?.type === "required" && (
                                <span className="text-danger">Name is required</span>
                            )}
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label htmlFor="email" className="col-md-3 col-form-label">Email</label>
                        <div className="col-md-9">
                            <input
                                type="email"
                                id="email"
                                className="form-control shadow-sm"
                                placeholder="Email"
                                {...register("email", { required: true })}
                            />
                            {errors.email?.type === "required" && (
                                <span className="text-danger">Email is required</span>
                            )}
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label htmlFor="password" className="col-md-3 col-form-label">Password</label>
                        <div className="col-md-9">
                            <input
                                type="password"
                                id="password"
                                className="form-control shadow-sm"
                                placeholder="Password"
                                {...register("password", { required: true })}
                            />
                            {errors.password?.type === "required" && (
                                <span className="text-danger">Password is required</span>
                            )}
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label htmlFor="gender" className="col-md-3 col-form-label">Gender</label>
                        <div className="col-md-9">
                            <select
                                id="gender"
                                className="form-control"
                                {...register("gender", { required: true })}
                            >
                                <option value="">-- Select Gender --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.gender?.type === "required" && (
                                <span className="text-danger">Gender is required</span>
                            )}
                        </div>
                    </div>

                    <div className="row mb-3 align-items-center">
                        <label htmlFor="mobileNumber" className="col-md-3 col-form-label">Mobile</label>
                        <div className="col-md-9">
                            <input
                                type="text"
                                id="mobileNumber"
                                className="form-control shadow-sm"
                                placeholder="Mobile Number"
                                {...register("mobileNumber", {
                                    required: true,
                                    pattern: /^[0-9]{10}$/
                                })}
                            />
                            {errors.mobileNumber?.type === "required" && (
                                <span className="text-danger">Mobile Number is required</span>
                            )}
                            {errors.mobileNumber?.type === "pattern" && (
                                <span className="text-danger">Enter a valid 10-digit number</span>
                            )}
                        </div>
                    </div>

                    <button className="btn btn-success col-sm-6 col-md-4 col-lg-3 d-block mx-auto mt-3">
                        Signup
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
