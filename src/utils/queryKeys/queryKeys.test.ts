
import { describe, it, expect } from 'vitest';
import { ticketKeys, userKeys, authKeys, getTicketKeys } from './queryKeys';

describe('queryKeys', () => {
    describe('authKeys', () => {
        it('should have correct all key', () => {
            expect(authKeys.all).toEqual(['auth']);
        });

        it('should have correct user key', () => {
            expect(authKeys.user()).toEqual(['auth', 'user']);
        });
    });

    describe('ticketKeys', () => {
        it('should have correct all key', () => {
            expect(ticketKeys.all).toEqual(['tickets']);
        });

        it('should have correct lists keys', () => {
            expect(ticketKeys.lists()).toEqual(['tickets', 'list']);
        });

        it('should have correct list key with filters', () => {
            const filters = { status: 'open' };
            expect(ticketKeys.list(filters)).toEqual(['tickets', 'list', filters]);
        });

        it('should have correct details keys', () => {
            expect(ticketKeys.details()).toEqual(['tickets', 'detail']);
        });

        it('should have correct detail key with id', () => {
            expect(ticketKeys.detail('123')).toEqual(['tickets', 'detail', '123']);
        });
    });

    describe('userKeys', () => {
        it('should have correct all key', () => {
            expect(userKeys.all).toEqual(['users']);
        });

        it('should have correct list key', () => {
            expect(userKeys.list()).toEqual(['users', 'list']);
        });

        it('should have correct profile key', () => {
            expect(userKeys.profile()).toEqual(['users', 'profile']);
        });
    });

    describe('getTicketKeys (Legacy)', () => {
        it('should match ticketKeys for list', () => {
            expect(getTicketKeys.list('open')).toEqual(ticketKeys.list({ status: 'open' }));
        });
    });
});
