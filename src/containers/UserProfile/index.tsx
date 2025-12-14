import { useMemo, useCallback, useState } from 'react';
import { useGetUserProfile } from './hooks/useGetUserProfile';

/**
 * TASK 1: Review this component and remove unnecessary useMemo/useCallback
 * 
 * Many of these optimizations are premature and don't provide actual benefits.
 * Remove the ones that aren't needed and explain why in comments.
 */
const UserProfile = () => {
  const { data: user, isLoading } = useGetUserProfile();
  const [localCounter, setLocalCounter] = useState(0);

  // This is memoized but only used in render - is this necessary?
  const userName = useMemo(() => {
    if (!user) return 'Loading...';
    return `${user.firstName} ${user.lastName}`;
  }, [user]);

  // This callback is passed to a native element - is memoization needed?
  const handleClick = useCallback(() => {
    setLocalCounter((prev) => prev + 1);
  }, []);

  // This is a simple string concatenation - does it need memoization?
  const displayName = useMemo(() => {
    return user ? `${user.firstName} ${user.lastName}` : 'Guest';
  }, [user]);

  // This is memoized but the dependency is stable - is this needed?
  const userInitials = useMemo(() => {
    if (!user) return '??';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }, [user?.firstName, user?.lastName]);

  // This callback is only used once and not passed as prop - needed?
  const handleNameClick = useCallback(() => {
    console.log('Name clicked:', displayName);
  }, [displayName]);

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Profile</h1>
      <div>
        <p>Name: {userName}</p>
        <p>Display Name: {displayName}</p>
        <p>Initials: {userInitials}</p>
        <button onClick={handleClick}>Counter: {localCounter}</button>
        <button onClick={handleNameClick}>Log Name</button>
      </div>
    </div>
  );
};

export default UserProfile;
