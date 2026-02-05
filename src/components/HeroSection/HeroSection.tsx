import { Link } from 'react-router-dom';
import { TERMINOLOGY } from '@/constants';
import { User } from '@/types';

interface HeroSectionProps {
    user: User | null;
    isAuthenticated: boolean;
}

const HeroSection = ({ user, isAuthenticated }: HeroSectionProps) => {
    return (
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
    );
};

export default HeroSection;
