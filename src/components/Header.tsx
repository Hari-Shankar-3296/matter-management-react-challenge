import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import CheckBoxLogo from '../assets/images/CheckBoxLogo.svg';
import { APP_NAME, ROUTES } from '../constants';

const Header = () => {
    const { toggleTheme } = useTheme();
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        navigate(ROUTES.LOGIN);
    };

    const userInitials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : '';

    return (
        <header className="header">
            <div className="header-container">
                <NavLink to={ROUTES.DASHBOARD} className="header-logo">
                    <div style={{ height: '50px', width: '220px', backgroundColor: '#afafafff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
                        <img src={CheckBoxLogo} alt="Logo" style={{ height: '40px', width: '200px' }} />
                    </div>
                    <span className="logo-text">{APP_NAME}</span>
                </NavLink>

                {isAuthenticated && (
                    <nav className="header-nav">
                        <NavLink
                            to={ROUTES.DASHBOARD}
                            end
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to={ROUTES.TICKETS}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            Matters
                        </NavLink>
                        <NavLink
                            to={ROUTES.KANBAN}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            Kanban Board
                        </NavLink>
                        <NavLink
                            to={ROUTES.MY_TICKETS}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            My Matters
                        </NavLink>
                    </nav>
                )}

                <div className="header-actions">
                    <div className="theme-switch" onClick={toggleTheme}>
                        <span className="theme-switch-icon light">☀️</span>
                        <span className="theme-switch-icon dark">🌙</span>
                        <div className="theme-switch-handle" />
                    </div>

                    {isAuthenticated && user && (
                        <div className="user-menu-container" ref={dropdownRef}>
                            <button
                                className={`avatar-circle user-avatar-btn ${isDropdownOpen ? 'active' : ''}`}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                title={`${user.firstName} ${user.lastName}`}
                            >
                                {userInitials}
                            </button>

                            {isDropdownOpen && (
                                <div className="user-dropdown">
                                    <div className="user-dropdown-header">
                                        <span className="dropdown-name">{user.firstName} {user.lastName}</span>
                                        <span className="dropdown-email">{user.email}</span>
                                    </div>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            navigate(ROUTES.PROFILE);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <span>👤</span> Profile
                                    </button>
                                    <button className="dropdown-item danger" onClick={handleLogout}>
                                        <span>🚪</span> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
