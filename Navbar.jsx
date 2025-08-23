import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { FaUser } from "react-icons/fa";
import { HiOutlineBars3 } from "react-icons/hi2";
import {
    Box, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { MdOutlineLogin } from "react-icons/md";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import logo from '../../assets/hstl_logo.jpg';

function Navbar() {
    const navigate = useNavigate();
    const path = useLocation().pathname;
    const [userType, setUserType] = useState(null);
    const [f, setF] = useState(false); // login flag
    const [openMenu, setOpenMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
    const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const activeStyle = { backgroundColor: '#B235B2', borderRadius: '7px', color: 'white' };
    const inactiveStyle = {};

    const activeTab = useMemo(() => ({
        '/': { s1: activeStyle },
        '/login': { s2: activeStyle },
        '/menu': { s3: activeStyle },
        '/user-profile': { s4: activeStyle }
    }[path] || {}), [path]);

    useEffect(() => {
        setUserType(localStorage.getItem('userType'));
        setF(!!localStorage.getItem('token'));

        const handleResize = () => setIsMobile(window.innerWidth < 700);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function signout() {
        localStorage.removeItem('token');
        setF(false);
        navigate('/login');
    }

    const menuOptions = useMemo(() => [
        { text: 'Home', to: '/', icon: <HomeIcon style={{ fontSize: 30 }} /> },
        !f && { text: 'Login', to: '/login', icon: <MdOutlineLogin style={{ fontSize: 30 }} /> },
        f && { text: 'Page 1', to: '/page1', icon: <MenuBookIcon style={{ fontSize: 30 }} /> },
        f && { text: 'Page 2', to: '/page2', icon: <MenuBookIcon style={{ fontSize: 30 }} /> },
        f && { text: 'Page 3', to: '/page3', icon: <MenuBookIcon style={{ fontSize: 30 }} /> },
        f && { text: 'Profile', to: '/user-profile', icon: <FaUser style={{ fontSize: 30 }} /> }
    ].filter(Boolean), [f]);

    return (
        <div className="w-100" style={{ backgroundColor: 'black' }}>
            {!isMobile ? (
                <div className="container-fluid d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center">
                        <img src={logo} alt="Logo" style={{ width: 40, height: 40, marginRight: 10 }} />
                        <h5 className="text-white m-0">Hostelify</h5>
                    </div>
                    <ul className="nav">
                        <li className="nav-item mx-2">
                            <NavLink className="nav-link text-white px-4 py-2" to="/" style={activeTab.s1 || inactiveStyle}>Home</NavLink>
                        </li>
                        {!f && (
                            <li className="nav-item mx-2">
                                <NavLink className="nav-link text-white px-4 py-2" to="/login" style={activeTab.s2 || inactiveStyle}>Login</NavLink>
                            </li>
                        )}
                        {f && (
                            <li className="nav-item dropdown mx-2">
                                <span
                                    className="nav-link text-white px-4 py-2 dropdown-toggle"
                                    style={activeTab.s3 || inactiveStyle}
                                    onClick={() => { setMenuDropdownOpen(v => !v); setProfileDropdownOpen(false); }}
                                    role="button"
                                >
                                    Menu
                                </span>
                                {menuDropdownOpen && (
                                    <ul className="dropdown-menu show mt-2" style={{ backgroundColor: '#f8f9fa', borderRadius: 10 }}>
                                        {userType === 'user' && <li><NavLink className="dropdown-item" to="/room-booking" onClick={() => setMenuDropdownOpen(false)}>Room Booking</NavLink></li>}
                                        {userType === 'admin' && <li><NavLink className="dropdown-item" to="/payment-due" onClick={() => setMenuDropdownOpen(false)}>Fee Payment</NavLink></li>}
                                        {userType === 'user' && <li><NavLink className="dropdown-item" to="/attendance" onClick={() => setMenuDropdownOpen(false)}>Attendance</NavLink></li>}
                                        {userType === 'admin' && <li><NavLink className="dropdown-item" to="/admin-approval" onClick={() => setMenuDropdownOpen(false)}>Leave Requests</NavLink></li>}
                                        <li><NavLink className="dropdown-item" to="/complaint" onClick={() => setMenuDropdownOpen(false)}>Complaint</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/food-menu" onClick={() => setMenuDropdownOpen(false)}>Food Menu</NavLink></li>
                                        {userType === 'user' && <>
                                            <li><NavLink className="dropdown-item" to="/leave-request" onClick={() => setMenuDropdownOpen(false)}>Leave Request</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="/payment" onClick={() => setMenuDropdownOpen(false)}>Payment</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="/lost-and-found" onClick={() => setMenuDropdownOpen(false)}>Lost and Found</NavLink></li>
                                        </>}
                                    </ul>
                                )}
                            </li>
                        )}
                        {f && (
                            <li className="nav-item dropdown mx-2">
                                <span
                                    className="nav-link text-white px-3 py-2 dropdown-toggle"
                                    style={activeTab.s4 || inactiveStyle}
                                    onClick={() => { setProfileDropdownOpen(v => !v); setMenuDropdownOpen(false); }}
                                    role="button"
                                >
                                    <FaUser />
                                </span>
                                {profileDropdownOpen && (
                                    <ul
                                        className="dropdown-menu show mt-2 dropdown-menu-end"
                                        style={{ backgroundColor: '#f8f9fa', borderRadius: 10, position: 'absolute', right: 0, top: '100%' }}
                                    >
                                        <li><NavLink className="dropdown-item" to="/user-profile" onClick={() => setProfileDropdownOpen(false)}>Profile</NavLink></li>
                                        <li><span className="dropdown-item" onClick={signout} style={{ cursor: 'pointer' }}>Signout</span></li>
                                    </ul>
                                )}
                            </li>
                        )}
                    </ul>
                </div>
            ) : (
                <div className="d-flex justify-content-between align-items-center px-3 py-2" style={{ backgroundColor: '#f8f9fa' }}>
                    <div className="d-flex align-items-center">
                        <img src={logo} alt="Logo" style={{ width: 40, height: 40, marginRight: 10 }} />
                        <h5 className="m-0 fw-bold">Menu</h5>
                    </div>
                    <HiOutlineBars3 style={{ color: '#000', fontSize: 28 }} onClick={() => setOpenMenu(true)} />
                    <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="top">
                        <Box sx={{ width: 250, padding: 2 }} role="presentation" onClick={() => setOpenMenu(false)}>
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
