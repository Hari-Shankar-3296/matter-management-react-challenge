import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUsers } from '../../hooks/useUsers';

/**
 * TASK 1: Fixed - Removed unnecessary useMemo/useCallback
 * 
 * Changes made:
 * 1. Removed useMemo for userName - simple string concat doesn't need memoization
 * 2. Removed useCallback for handleClick - passed to native element, no need
 * 3. Removed useMemo for displayName - redundant with userName
 * 4. Removed useMemo for userInitials - simple string operation
 * 5. Removed useCallback for handleNameClick - only used once, not passed as prop
 * 
 * Rule of thumb: Only use useMemo/useCallback when:
 * - The computation is expensive (not string operations)
 * - The value is passed to a memoized child component
 * - The callback is a dependency of useEffect or other hooks
 */
const UserProfile = () => {
  const { user } = useAuth();
  const { data: users } = useUsers();
  const [localCounter, setLocalCounter] = useState(0);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  // Simple string operations - no memoization needed
  const userName = `${user.firstName} ${user.lastName}`;
  const displayName = userName || 'Guest';
  const userInitials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  // Simple handlers - no useCallback needed for native elements
  const handleClick = () => {
    setLocalCounter((prev) => prev + 1);
  };

  const handleNameClick = () => {
    // Direct usage, no need for useCallback
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Profile</h1>
      <div>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#10b981',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          marginBottom: '16px',
        }}>
          {userInitials}
        </div>
        <p>Name: {userName}</p>
        <p>Display Name: {displayName}</p>
        <p>Email: {user.email}</p>
        <button onClick={handleClick}>Counter: {localCounter}</button>
        <button onClick={handleNameClick} style={{ marginLeft: '8px' }}>Log Name</button>
      </div>

      {users && users.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3>Team Members</h3>
          {users.filter(u => u.id !== user.id).map((member) => (
            <div key={member.id} style={{ padding: '8px 0' }}>
              {member.firstName} {member.lastName} - {member.email}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
