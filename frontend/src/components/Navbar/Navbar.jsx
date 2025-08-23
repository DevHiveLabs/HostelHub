import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import { HiOutlineBars3 } from "react-icons/hi2";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import { MdOutlineLogin } from "react-icons/md";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import logo from '../../assets/hstl_logo.jpg'

function Navbar() {
    const navigate = useNavigate();
    const path = useLocation().pathname;
    const [userType, setUserType] = useState(null);

    const [s1, setS1] = useState({});
    const [s2, setS2] = useState({});
    const [s3, setS3] = useState({});
    const [s4, setS4] = useState({});
    const [f, setF] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const activeStyle = {
        backgroundColor: '#B235B2',
        borderRadius: '7px',
        color: 'white'
    };

    useEffect(() => {
        if (path === '/') {
            setS1(activeStyle); setS2({}); setS3({}); setS4({});
        } else if (path === '/login') {
            setS1({}); setS2(activeStyle); setS3({}); setS4({}); setF(false);
        } else if (path === '/menu') {
            setS1({}); setS2({}); setS3(activeStyle); setS4({});
        } else if (path === '/user-profile') {
            setS1({}); setS2({}); setS3({}); setS4(activeStyle); setF(true);
        }
    }, [path]);

    useEffect(() => {
        setUserType(localStorage.getItem('userType'));
        const token = localStorage.getItem('token');
        if (token) {
            setF(true)
        } else {
            console.log('Token not found');
        }

        const handleResize = () => {
            setIsMobile(window.innerWidth < 700);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function signout() {
        localStorage.removeItem('token');
        setF(false);
        navigate('/login');
    }

    const menuOptions = [
        { text: 'Home', to: '/', icon: <HomeIcon style={{ fontSize: '30px' }} /> },
        !f && { text: 'Login', to: '/login', icon: <MdOutlineLogin style={{ fontSize: '30px' }} /> },
        f && { text: 'Page 1', to: '/page1', icon: <MenuBookIcon style={{ fontSize: '30px' }} /> },
        f && { text: 'Page 2', to: '/page2', icon: <MenuBookIcon style={{ fontSize: '30px' }} /> },
        f && { text: 'Page 3', to: '/page3', icon: <MenuBookIcon style={{ fontSize: '30px' }} /> },
        f && { text: 'Profile', to: '/user-profile', icon: <FaUser style={{ fontSize: '30px' }} /> }
    ].filter(Boolean);

    return (
        <div className="w-100" style={{ backgroundColor: 'black' }}>
            {!isMobile && (
                <div className="container-fluid d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center">
                        <img src={logo} alt="Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                        <h5 className="text-white m-0">Hostelify</h5>
                    </div>
                    <ul className="nav">
                        <li className="nav-item mx-2">
                            <NavLink className="nav-link text-white px-4 py-2" to="/" style={s1}>Home</NavLink>
                        </li>
                        {!f && (
                            <li className="nav-item mx-2">
                                <NavLink className="nav-link text-white px-4 py-2" to="/login" style={s2}>Login</NavLink>
                            </li>
                        )}
                        {f && (
                            <li className="nav-item dropdown mx-2">
                                <span className="nav-link text-white px-4 py-2 dropdown-toggle" style={s3} onClick={() => {
                                    setMenuDropdownOpen(!menuDropdownOpen)
                                    setProfileDropdownOpen(false)
                                    }} role="button">
                                    Menu
                                </span>
                                {menuDropdownOpen && (
                                    <ul className="dropdown-menu show mt-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                                        {userType == 'user' && <li><NavLink className="dropdown-item" to="/room-booking" onClick={() => setMenuDropdownOpen(false)}>Room Booking</NavLink></li>}
                                        {userType == 'admin' && <li><NavLink className="dropdown-item" to="/payment-due" onClick={() => setMenuDropdownOpen(false)}>Fee Payment</NavLink></li>}
                                        {userType=='user'&&<li><NavLink className="dropdown-item" to="/attendance" onClick={() => setMenuDropdownOpen(false)}>Attendance</NavLink></li>}
                                        {userType=='admin'&&<li><NavLink className="dropdown-item" to="/admin-approval" onClick={() => setMenuDropdownOpen(false)}>Leave Requests</NavLink></li>}
                                        <li><NavLink className="dropdown-item" to="/complaint" onClick={() => setMenuDropdownOpen(false)}>Complaint</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/food-menu" onClick={() => setMenuDropdownOpen(false)}>Food Menu</NavLink></li>
                                        {userType=='user'&&<li><NavLink className="dropdown-item" to="/leave-request" onClick={() => setMenuDropdownOpen(false)}>Leave Request</NavLink></li>}
                                        {userType=='user'&&<li><NavLink className="dropdown-item" to="/payment" onClick={() => setMenuDropdownOpen(false)}>Payment</NavLink></li>}
                                        {userType=='user'&&<li><NavLink className="dropdown-item" to="/lost-and-found" onClick={() => setMenuDropdownOpen(false)}>Lost and Found</NavLink></li>}
                                    </ul>
                                )}
                            </li>
                        )}
                        {f && (
                            <>
                                <li className="nav-item dropdown mx-2">
                                    <span
                                        className="nav-link text-white px-3 py-2 dropdown-toggle"
                                        style={s4}
                                        onClick={() => {
                                            setProfileDropdownOpen(!profileDropdownOpen)
                                            setMenuDropdownOpen(false)
                                        }}
                                        role="button"
                                    >
                                        <FaUser />
                                    </span>
                                    {profileDropdownOpen && (
                                        <ul
                                            className="dropdown-menu show mt-2 dropdown-menu-end"
                                            style={{
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '10px',
                                                position: 'absolute',
                                                right: '0',
                                                top: '100%'
                                            }}
                                        >
                                            <li><NavLink className="dropdown-item" to="/user-profile" onClick={() => profileDropdownOpen(false)}>Profile</NavLink></li>
                                            <li><span className="dropdown-item" onClick={signout} style={{ cursor: 'pointer' }}>Signout</span></li>
                                        </ul>
                                    )}
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            )}

            {isMobile && (
                <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="d-flex align-items-center">
                        <img src={logo} alt="Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
                        <h5 className="m-0 fw-bold">Menu</h5>
                    </div>
                    <HiOutlineBars3 style={{ color: '#000', fontSize: '28px' }} onClick={() => setOpenMenu(true)} />
                    <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor='top'>
                        <Box sx={{ width: 250, padding: 2 }} role="presentation" onClick={() => setOpenMenu(false)} onKeyDown={() => setOpenMenu(false)}>
                            <List>
                                {menuOptions.map((item) => (
                                    <ListItem key={item.text} disablePadding>
                                        <ListItemButton onClick={() => item.text === 'Signout' ? signout() : navigate(item.to)}>
                                            <ListItemIcon>{item.icon}</ListItemIcon>
                                            <ListItemText primary={item.text} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                </div>
            )}
        </div>
    );
}

export default Navbar;
