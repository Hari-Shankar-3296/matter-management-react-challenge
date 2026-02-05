// Mock API with in-memory store for CRUD operations

import { Ticket, CreateTicketInput, UpdateTicketInput, TicketFilters, TicketPriority } from '@/types';

// Helper to get current user ID from localStorage
const getCurrentUserId = (): string => {
  try {
    const stored = localStorage.getItem('matter-management-user');
    if (stored) {
      const user = JSON.parse(stored);
      return user.id;
    }
  } catch {
    // Ignore parse errors
  }
  return 'user-1'; // Default user
};

// In-memory store for mock data persistence
const mockTickets: Ticket[] = [
  {
    id: 'ticket-1',
    title: 'Fix login bug',
    status: 'open',
    priority: 'high',
    createdAt: '2024-01-15T10:00:00Z',
    description: 'Users cannot log in with their credentials. This is a critical issue affecting multiple users.',
    reporterId: 'user-1',
    assigneeId: 'user-2',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now (this week)
  },
  {
    id: 'ticket-2',
    title: 'Update dashboard UI',
    status: 'in-progress',
    priority: 'medium',
    createdAt: '2024-01-14T14:30:00Z',
    description: 'Redesign the dashboard to match new brand guidelines. Include new color scheme and typography.',
    reporterId: 'user-2',
    assigneeId: 'user-1',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  },
  {
    id: 'ticket-3',
    title: 'Add dark mode',
    status: 'closed',
    priority: 'low',
    createdAt: '2024-01-10T09:15:00Z',
    description: 'Implement dark mode theme across the application. Ensure all components support both themes.',
    reporterId: 'user-1',
    assigneeId: 'user-3',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
  },
  {
    id: 'ticket-4',
    title: 'Optimize database queries',
    status: 'open',
    priority: 'critical',
    createdAt: '2024-01-12T11:20:00Z',
    description: 'Improve performance of slow database queries. Add proper indexing and optimize joins.',
    reporterId: 'user-3',
    assigneeId: 'user-1',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow (this week)
  },
  {
    id: 'ticket-5',
    title: 'Implement user settings page',
    status: 'open',
    priority: 'medium',
    createdAt: '2024-01-16T08:00:00Z',
    description: 'Create a user settings page for profile management and preferences.',
    reporterId: 'user-2',
    assigneeId: 'user-4',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
  },
];

let nextId = 6;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTickets = async (params?: TicketFilters): Promise<Ticket[]> => {
  await delay(300);

  let filtered = [...mockTickets];

  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(ticket =>
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.description?.toLowerCase().includes(searchLower)
    );
  }

  if (params?.status && params.status !== 'all') {
    filtered = filtered.filter(ticket => ticket.status === params.status);
  }

  if (params?.priority && params.priority !== 'all') {
    filtered = filtered.filter(ticket => ticket.priority === params.priority);
  }

  if (params?.assigneeId) {
    filtered = filtered.filter(ticket => ticket.assigneeId === params.assigneeId);
  }

  if (params?.dueThisWeek) {
    const now = new Date();
    // Start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // End of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    filtered = filtered.filter(ticket => {
      if (!ticket.dueDate) return false;
      const dueDate = new Date(ticket.dueDate);
      return dueDate >= startOfWeek && dueDate <= endOfWeek;
    });
  }

  // Sorting
  if (params?.sortBy === 'date') {
    filtered.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (params?.sortBy === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (params?.sortBy === 'priority') {
    const priorityOrder: Record<TicketPriority, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };
    filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (params?.sortBy === 'dueDate') {
    filtered.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  return filtered;
};

export const fetchTicketById = async (id: string): Promise<Ticket> => {
  await delay(200);

  const ticket = mockTickets.find(t => t.id === id);
  if (!ticket) {
    throw new Error('Ticket not found');
  }
  return ticket;
};

export const createTicket = async (input: CreateTicketInput): Promise<Ticket> => {
  await delay(300);

  const newTicket: Ticket = {
    id: `ticket-${nextId++}`,
    title: input.title,
    description: input.description || '',
    status: input.status || 'open',
    priority: input.priority || 'medium',
    reporterId: getCurrentUserId(),
    assigneeId: input.assigneeId,
    dueDate: input.dueDate,
    createdAt: new Date().toISOString(),
  };

  mockTickets.push(newTicket);
  return newTicket;
};

export const updateTicket = async (input: UpdateTicketInput): Promise<Ticket> => {
  await delay(300);

  const index = mockTickets.findIndex(t => t.id === input.id);
  if (index === -1) {
    throw new Error('Ticket not found');
  }

  const updatedTicket: Ticket = {
    ...mockTickets[index],
    ...(input.title !== undefined && { title: input.title }),
    ...(input.description !== undefined && { description: input.description }),
    ...(input.status !== undefined && { status: input.status }),
    ...(input.priority !== undefined && { priority: input.priority }),
    ...(input.assigneeId !== undefined && { assigneeId: input.assigneeId }),
    ...(input.dueDate !== undefined && { dueDate: input.dueDate }),
    updatedAt: new Date().toISOString(),
  };

  mockTickets[index] = updatedTicket;
  return updatedTicket;
};

export const deleteTicket = async (id: string): Promise<void> => {
  await delay(200);

  const index = mockTickets.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Ticket not found');
  }

  mockTickets.splice(index, 1);
};

// Get tickets for current user
export const fetchMyTickets = async (): Promise<{ assigned: Ticket[]; reported: Ticket[] }> => {
  await delay(300);
  const userId = getCurrentUserId();

  return {
    assigned: mockTickets.filter(t => t.assigneeId === userId),
    reported: mockTickets.filter(t => t.reporterId === userId),
  };
};

// Get ticket statistics
export const fetchTicketStats = async (): Promise<{
  total: number;
  open: number;
  inProgress: number;
  closed: number;
  byPriority: Record<TicketPriority, number>;
}> => {
  await delay(200);

  return {
    total: mockTickets.length,
    open: mockTickets.filter(t => t.status === 'open').length,
    inProgress: mockTickets.filter(t => t.status === 'in-progress').length,
    closed: mockTickets.filter(t => t.status === 'closed').length,
    byPriority: {
      critical: mockTickets.filter(t => t.priority === 'critical').length,
      high: mockTickets.filter(t => t.priority === 'high').length,
      medium: mockTickets.filter(t => t.priority === 'medium').length,
      low: mockTickets.filter(t => t.priority === 'low').length,
    },
  };
};
