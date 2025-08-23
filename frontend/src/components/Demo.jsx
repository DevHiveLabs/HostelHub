import { createBrowserRouter, RouterProvider } from "react-router-dom"
import RootLayout from "./RootLayout"
import ErrorRoute from "./ErrorRoute"
import Home from './Home/Home'
import Login from "./Login/Login.jsx"
import UserProfile from "./UserProfile/UserProfile.jsx"
import Complaint from "./Menu/Complaint.jsx"
import PaymentDue from "./Menu/PaymentDue.jsx"
import FoodMenu from "./Menu/FoodMenu.jsx"
import Attendance from "./Menu/Attendance.jsx"
import RoomBooking from "./Menu/RoomBooking.jsx"
import './Demo.css';
import CheckInOut from "./Menu/CheckInOut.jsx"
import LeaveRequest from "./Menu/LeaveRequest.jsx"
import AdminApproval from "./Menu/AdminApproval.jsx"
import Payment from "./Menu/Payment.jsx"
import LostAndFound from "./Menu/LostAndFound.jsx"

function Demo() {
    let router = createBrowserRouter([
        {
            path: '',
            element: <RootLayout />,
            errorElement: <ErrorRoute />,
            children: [
                {
                    path: '',
                    element: <Home />,
                },
                {
                    path: 'login',
                    element: <Login />
                },
                {
                    path: 'user-profile',
                    element: <UserProfile />
                },
                {
                    path: 'room-booking',
                    element: <RoomBooking/>,
                },
                {
                    path: 'complaint',
                    element: <Complaint/>
                },
                {
                    path:'payment-due',
                    element:<PaymentDue/>
                },
                {
                    path:'food-menu',
                    element: <FoodMenu/>
                },
                {
                    path:'attendance',
                    element: <Attendance/>
                },
                {
                    path:'tracker',
                    element: <CheckInOut/>
                },
                {
                    path: 'leave-request',
                    element: <LeaveRequest />,
                },
                {
                    path: 'admin-approval',
                    element: <AdminApproval />,
                },
                {
                    path:'payment',
                    element: <Payment/>
                },
                {
                    path:'lost-and-found',
                    element: <LostAndFound/>
                }
            ]
        }
    ]);
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    )
}

export default Demo