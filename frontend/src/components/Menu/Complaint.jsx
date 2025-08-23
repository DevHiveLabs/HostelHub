import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Complaint.css";

export default function Complaint() {
    const [f, setF] = useState({ category: "", urgency: "", description: "" });
    const [userType, setUserType] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    useEffect(() => {
        const t = localStorage.getItem("userType");
        setUserType(t);

        if (t === "admin") {
            (async () => {
                setLoading(true);
                setErr("");
                try {
                    const res = await axios.get("https://shms-backend-zvyd.onrender.com/admin-api/complaints");
                    // make tolerant to different response shapes
                    setComplaints(res?.data?.complaints || res?.data || []);
                } catch (e) {
                    console.error(e);
                    setErr("Failed to load complaints");
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setF((p) => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setMsg("");
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.room || !user.room.roomNo) throw new Error("Missing room information");

            const payload = { ...f, roomNo: user.room.roomNo };
            setSubmitting(true);
            await axios.post("https://shms-backend-zvyd.onrender.com/user-api/complaints", payload);
            setMsg("Complaint submitted successfully.");
            setF({ category: "", urgency: "", description: "" });
        } catch (error) {
            console.error(error);
            setErr(error?.response?.data?.message || error.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    // utility to get pill class
    const pillClass = (u) => {
        if (!u) return "urgency-pill urgency-low";
        const k = String(u).toLowerCase();
        if (k.includes("high")) return "urgency-pill urgency-high";
        if (k.includes("moderate")) return "urgency-pill urgency-moderate";
        return "urgency-pill urgency-low";
    };

    return (
        <div className="complaint-container" role="region" aria-label="Complaint and Maintenance">
            {userType === "user" && (
                <>
                    <h1 className="complaint-title">Complaint & Maintenance</h1>

                    <form onSubmit={handleSubmit} aria-live="polite">
                        <label className="complaint-label" htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            className="complaint-select complaint-input"
                            value={f.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Choose category</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Cleanliness">Cleanliness</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Others">Others</option>
                        </select>

                        <label className="complaint-label" htmlFor="urgency">Urgency</label>
                        <select
                            id="urgency"
                            name="urgency"
                            className="complaint-select complaint-input"
                            value={f.urgency}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select urgency</option>
                            <option value="Low">Low</option>
                            <option value="Moderate">Moderate</option>
                            <option value="High">High</option>
                        </select>

                        <label className="complaint-label" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className="complaint-textarea"
                            value={f.description}
                            onChange={handleChange}
                            placeholder="Explain the issue (what, where, when)..."
                            required
                        />

                        {err && <div className="message error">{err}</div>}
                        {msg && <div className="message success">{msg}</div>}

                        <div className="btn-row" style={{ marginTop: 8 }}>
                            <button type="submit" className="submit-btn" disabled={submitting}>
                                {submitting ? "Submitting..." : "Submit Complaint"}
                            </button>
                            <button
                                type="button"
                                className="reset-btn"
                                onClick={() => {
                                    setF({ category: "", urgency: "", description: "" });
                                    setErr("");
                                    setMsg("");
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </>
            )}

            {userType === "admin" && (
                <>
                    <h1 className="complaint-title">All Complaints</h1>
                    {loading && <div style={{ color: "#6b7280", marginBottom: 8 }}>Loading complaints…</div>}
                    {err && <div className="message error">{err}</div>}

                    <table className="complaints-table" role="table" aria-label="Complaints list">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Room No</th>
                                <th>Urgency</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!complaints || complaints.length === 0) ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", padding: "1rem", color: "#64748b" }}>
                                        No complaints found
                                    </td>
                                </tr>
                            ) : (
                                complaints.map((it, i) => (
                                    <tr key={i}>
                                        <td>{it.category}</td>
                                        <td className="complaint-desc">{it.description}</td>
                                        <td>{it.roomNo ?? it.room ?? "-"}</td>
                                        <td>
                                            <span className={pillClass(it.urgency)}>{it.urgency ?? "Low"}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}
