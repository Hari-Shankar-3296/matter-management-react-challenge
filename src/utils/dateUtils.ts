/**
 * Check if a date is due this week
 */
export const isDueThisWeek = (dueDate: string | undefined): boolean => {
    if (!dueDate) return false;

    const now = new Date();
    const due = new Date(dueDate);

    // Get start of current week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // Get end of current week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return due >= startOfWeek && due <= endOfWeek;
};

/**
 * Check if a date is overdue
 */
export const isOverdue = (dueDate: string | undefined): boolean => {
    if (!dueDate) return false;

    const now = new Date();
    const due = new Date(dueDate);
    now.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < now;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * Format date for input field
 */
export const formatDateForInput = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};
