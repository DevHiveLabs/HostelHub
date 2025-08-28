import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Attendance.css';

import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';

const COLORS = ['#00C49F', '#FF8042', '#0088FE', '#FFBB28'];

const Attendance = () => {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [absentDates, setAbsentDates] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await axios.get(`http://localhost:4000/attendance-api/report/${user.email}`);
        const data = res.data;
        setAttendance(data);
        setLoading(false);

        const yearStart = new Date(new Date().getFullYear(), 0, 1);
        const absents = [];

        data.attendancelogs.forEach((val, idx) => {
          if (val === 0) {
            const date = new Date(yearStart);
            date.setDate(date.getDate() + idx);
            absents.push(date);
          }
        });

        setAbsentDates(absents);
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const isAbsent = absentDates.some(d =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
      return isAbsent ? 'absent-day' : null;
    }
  };

  if (loading) return <p className="text-center">Loading attendance data...</p>;
  if (!attendance) return <p className="text-center">No attendance data available.</p>;

  const { totalpresent, totaldays, holidays, permittedleaves } = attendance;
  const totalAbsent = totaldays - totalpresent - holidays - permittedleaves;
  const attendancePercentage = ((totalpresent / totaldays) * 100).toFixed(2);

  const pieData = [
    { name: 'Present', value: totalpresent },
    { name: 'Absent', value: totalAbsent },
    { name: 'Leaves', value: permittedleaves },
    { name: 'Holidays', value: holidays }
  ];

  const userEmail = JSON.parse(localStorage.getItem("user"))?.email;

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">
        Attendance Report for <span>{userEmail}</span>
      </h2>
      <p className="attendance-percentage">
        <strong>Attendance Percentage:</strong> {attendancePercentage}%
      </p>

      <div className="charts-wrapper">
        <div className="chart-card">
          <h3>Pie Chart</h3>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="chart-card">
          <h3>Bar Chart</h3>
          <BarChart width={400} height={300} data={pieData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
      </div>

      <div className="calendar-section">
        <h3>Absent Dates Calendar</h3>
        <Calendar tileClassName={tileClassName} />
      </div>
    </div>
  );
};

export default Attendance;
