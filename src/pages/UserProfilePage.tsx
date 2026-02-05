import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUsers } from '../hooks/useUsers';

/**
 * User Profile Page
 * 
 * Note: Unnecessary useMemo/useCallback from TASK 1 have been removed.
 * Simple string operations and event handlers don't need memoization.
 */
const UserProfilePage = () => {
    const { user, logout } = useAuth();
    const { data: users } = useUsers();
    const [showConfirm, setShowConfirm] = useState(false);

    if (!user) {
        return <div className="loading">Loading profile...</div>;
    }

    // Simple derived values - no useMemo needed for basic string operations
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

                <div className="profile-section">
                    <h3>Account Details</h3>
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
                </div>

                <div className="profile-section">
                    <h3>Team Members</h3>
                    <div className="team-list">
                        {users?.filter(u => u.id !== user.id).map((member) => (
                            <div key={member.id} className="team-member">
                                <div className="member-avatar">
                                    {member.firstName[0]}{member.lastName[0]}
                                </div>
                                <div className="member-info">
                                    <span className="member-name">{member.firstName} {member.lastName}</span>
                                    <span className="member-email">{member.email}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

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
