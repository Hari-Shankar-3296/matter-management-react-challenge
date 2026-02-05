import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TERMINOLOGY } from '../constants';

const HomePage = () => {
    const { user, isAuthenticated } = useAuth();

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        {isAuthenticated ? (
                            <>Welcome back, <span className="gradient-text">{user?.firstName}</span>!</>
                        ) : (
                            <>Welcome to <span className="gradient-text">Matter Management</span></>
                        )}
                    </h1>
                    <p className="hero-subtitle">
                        Manage your {TERMINOLOGY.items.toLowerCase()} efficiently with our modern matter management system.
                        Track progress, collaborate with your team, and get things done.
                    </p>
                    <div className="hero-actions">
                        {isAuthenticated ? (
                            <>
                                <Link to={TERMINOLOGY.ROUTES.TICKETS} className="btn btn-primary btn-lg">
                                    View All {TERMINOLOGY.ITEMS}
                                </Link>
                                <Link to={TERMINOLOGY.ROUTES.MY_TICKETS} className="btn btn-secondary btn-lg">
                                    My {TERMINOLOGY.ITEMS}
                                </Link>
                            </>
                        ) : (
                            <Link to="/login" className="btn btn-primary btn-lg">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <section className="features">
                <h2 className="features-title">Features</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📋</div>
                        <h3>{TERMINOLOGY.ITEM} Management</h3>
                        <p>Create, edit, and delete {TERMINOLOGY.items.toLowerCase()} with ease. Track status, priority, and due dates.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Kanban Board</h3>
                        <p>Visualize your workflow with drag-and-drop Kanban board.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Smart Filters</h3>
                        <p>Find {TERMINOLOGY.items.toLowerCase()} quickly with powerful search and filter options.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">👥</div>
                        <h3>Multi-User</h3>
                        <p>Assign {TERMINOLOGY.items.toLowerCase()} to team members and track who's working on what.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
