import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <header className="header">
            <div className="header-container">
                <NavLink to="/" className="header-logo">
                    <span className="logo-icon">✅</span>
                    <span className="logo-text">Matter Management</span>
                </NavLink>

                {isAuthenticated && (
                    <nav className="header-nav">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/tickets"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            Tickets
                        </NavLink>
                        <NavLink
                            to="/kanban"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            Kanban Board
                        </NavLink>
                        <NavLink
                            to="/my-tickets"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            My Tickets
                        </NavLink>
                        <NavLink
                            to="/profile"
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            Profile
                        </NavLink>
                    </nav>
                )}

                <div className="header-actions">
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>

                    {isAuthenticated && user && (
                        <div className="user-menu">
                            <span className="user-name">{user.firstName}</span>
                            <button className="btn btn-secondary btn-sm" onClick={logout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
