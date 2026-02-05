import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext/AuthContext';
import { useUsers } from '@/hooks/useUsers/useUsers';
import ProfileSection from '@/components/ProfileSection/ProfileSection';
import TeamMemberItem from '@/components/TeamMemberItem/TeamMemberItem';

const UserProfilePage = () => {
    const { user, logout } = useAuth();
    const { data: users } = useUsers();
    const [showConfirm, setShowConfirm] = useState(false);

    if (!user) {
        return <div className="loading">Loading profile...</div>;
    }

    const displayName = `${user.firstName} ${user.lastName}`;
    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

    const handleLogout = () => {
        if (showConfirm) {
            logout();
        } else {
            setShowConfirm(true);
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">{initials}</div>
                    <div className="profile-info">
                        <h1>{displayName}</h1>
                        <p className="profile-email">{user.email}</p>
                    </div>
                </div>

                <ProfileSection title="Account Details">
                    <div className="profile-details">
                        <div className="detail-row">
                            <span className="detail-label">User ID</span>
                            <span className="detail-value">{user.id}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">First Name</span>
                            <span className="detail-value">{user.firstName}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Last Name</span>
                            <span className="detail-value">{user.lastName}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Email</span>
                            <span className="detail-value">{user.email}</span>
                        </div>
                    </div>
                </ProfileSection>

                <ProfileSection title="Team Members">
                    <div className="team-list">
                        {users?.filter(u => u.id !== user.id).map((member) => (
                            <TeamMemberItem key={member.id} member={member} />
                        ))}
                    </div>
                </ProfileSection>

                <div className="profile-actions">
                    {showConfirm ? (
                        <div className="confirm-logout">
                            <span>Are you sure?</span>
                            <button className="btn btn-danger" onClick={handleLogout}>
                                Yes, Logout
                            </button>
                            <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button className="btn btn-secondary" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
