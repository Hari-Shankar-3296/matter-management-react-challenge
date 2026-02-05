
import { describe, it, expect } from 'vitest';
import { fetchUsers, fetchUserById, loginUser, mockUsers } from './users';

describe('users service', () => {
    describe('fetchUsers', () => {
        it('should return a list of all users', async () => {
            const users = await fetchUsers();
            expect(users).toEqual(mockUsers);
            expect(users.length).toBeGreaterThan(0);
        });
    });

    describe('fetchUserById', () => {
        it('should return the correct user for a given ID', async () => {
            const firstUser = mockUsers[0];
            const user = await fetchUserById(firstUser.id);
            expect(user).toEqual(firstUser);
        });

        it('should return null for a non-existent user ID', async () => {
            const user = await fetchUserById('non-existent');
            expect(user).toBeNull();
        });
    });

    describe('loginUser', () => {
        it('should return the user if email exists', async () => {
            const firstUser = mockUsers[0];
            const user = await loginUser(firstUser.email);
            expect(user).toEqual(firstUser);
        });

        it('should return null if email does not exist', async () => {
            const user = await loginUser('nonexistent@example.com');
            expect(user).toBeNull();
        });
    });
});
