
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isDueThisWeek, isOverdue, formatDate, formatDateForInput } from './dateUtils';

describe('dateUtils', () => {
    beforeEach(() => {
        // Set system time to a fixed date: Wednesday, Oct 25, 2023
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2023, 9, 25));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('isDueThisWeek', () => {
        it('should return true if date is within the current week (Sun-Sat)', () => {
            // Current week: Oct 22 (Sun) to Oct 28 (Sat)
            expect(isDueThisWeek('2023-10-22')).toBe(true);
            expect(isDueThisWeek('2023-10-25')).toBe(true);
            expect(isDueThisWeek('2023-10-28')).toBe(true);
        });

        it('should return false if date is outside the current week', () => {
            expect(isDueThisWeek('2023-10-21')).toBe(false); // Last Sat
            expect(isDueThisWeek('2023-10-29')).toBe(false); // Next Sun
        });

        it('should return false if date is undefined', () => {
            expect(isDueThisWeek(undefined)).toBe(false);
        });
    });

    describe('isOverdue', () => {
        it('should return true if date is before today', () => {
            expect(isOverdue('2023-10-24')).toBe(true);
        });

        it('should return false if date is today', () => {
            expect(isOverdue('2023-10-25')).toBe(false);
        });

        it('should return false if date is in the future', () => {
            expect(isOverdue('2023-10-26')).toBe(false);
        });

        it('should return false if date is undefined', () => {
            expect(isOverdue(undefined)).toBe(false);
        });
    });

    describe('formatDate', () => {
        it('should format date string to "MMM D, YYYY"', () => {
            expect(formatDate('2023-10-25')).toBe('Oct 25, 2023');
        });
    });

    describe('formatDateForInput', () => {
        it('should format date string to "YYYY-MM-DD"', () => {
            expect(formatDateForInput('2023-10-25T14:30:00Z')).toBe('2023-10-25');
        });

        it('should return empty string if date is undefined', () => {
            expect(formatDateForInput(undefined)).toBe('');
        });
    });
});
