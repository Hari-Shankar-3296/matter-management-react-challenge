import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { TERMINOLOGY } from '@/constants';
import HeroSection from '@/components/HeroSection/HeroSection';
import FeatureCard from '@/components/FeatureCard/FeatureCard';

const HomePage = () => {
    const { user, isAuthenticated } = useAuth();

    const features = [
        {
            icon: '📋',
            title: `${TERMINOLOGY.ITEM} Management`,
            description: `Create, edit, and delete ${TERMINOLOGY.items.toLowerCase()} with ease. Track status, priority, and due dates.`
        },
        {
            icon: '📊',
            title: 'Kanban Board',
            description: 'Visualize your workflow with drag-and-drop Kanban board.'
        },
        {
            icon: '🔍',
            title: 'Smart Filters',
            description: `Find ${TERMINOLOGY.items.toLowerCase()} quickly with powerful search and filter options.`
        },
        {
            icon: '👥',
            title: 'Multi-User',
            description: `Assign ${TERMINOLOGY.items.toLowerCase()} to team members and track who's working on what.`
        }
    ];

    return (
        <div className="home-page">
            <HeroSection user={user} isAuthenticated={isAuthenticated} />

            <section className="features">
                <h2 className="features-title">Features</h2>
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
