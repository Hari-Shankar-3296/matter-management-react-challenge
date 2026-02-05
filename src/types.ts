// Centralized types for the application

export type TicketStatus = 'open' | 'in-progress' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  reporterId: string;
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTicketInput {
  title: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  dueDate?: string;
}

export interface UpdateTicketInput {
  id: string;
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assigneeId?: string;
  dueDate?: string;
}

export interface TicketFilters {
  search?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  sortBy?: 'date' | 'title' | 'priority' | 'dueDate';
  dueThisWeek?: boolean;
}
