// Mock API - in real app this would use axios or fetch

// Mock API - in real app this would be your actual API
export interface Ticket {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'closed';
  createdAt: string;
  description?: string;
}

export const fetchTickets = async (params?: {
  search?: string;
  status?: string;
  sortBy?: 'date' | 'title';
}): Promise<Ticket[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data - in real app this would be an actual API call
  const mockTickets: Ticket[] = [
    {
      id: '1',
      title: 'Fix login bug',
      status: 'open',
      createdAt: '2024-01-15T10:00:00Z',
      description: 'Users cannot log in with their credentials',
    },
    {
      id: '2',
      title: 'Update dashboard UI',
      status: 'in-progress',
      createdAt: '2024-01-14T14:30:00Z',
      description: 'Redesign the dashboard to match new brand guidelines',
    },
    {
      id: '3',
      title: 'Add dark mode',
      status: 'closed',
      createdAt: '2024-01-10T09:15:00Z',
      description: 'Implement dark mode theme across the application',
    },
    {
      id: '4',
      title: 'Optimize database queries',
      status: 'open',
      createdAt: '2024-01-12T11:20:00Z',
      description: 'Improve performance of slow database queries',
    },
  ];

  let filtered = [...mockTickets];

  if (params?.search) {
    filtered = filtered.filter(ticket =>
      ticket.title.toLowerCase().includes(params.search!.toLowerCase())
    );
  }

  if (params?.status && params.status !== 'all') {
    filtered = filtered.filter(ticket => ticket.status === params.status);
  }

  if (params?.sortBy === 'date') {
    filtered.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } else if (params?.sortBy === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  return filtered;
};

export const fetchTicketById = async (id: string): Promise<Ticket> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const mockTickets: Ticket[] = [
    {
      id: '1',
      title: 'Fix login bug',
      status: 'open',
      createdAt: '2024-01-15T10:00:00Z',
      description: 'Users cannot log in with their credentials. This is a critical issue affecting multiple users.',
    },
    {
      id: '2',
      title: 'Update dashboard UI',
      status: 'in-progress',
      createdAt: '2024-01-14T14:30:00Z',
      description: 'Redesign the dashboard to match new brand guidelines. Include new color scheme and typography.',
    },
    {
      id: '3',
      title: 'Add dark mode',
      status: 'closed',
      createdAt: '2024-01-10T09:15:00Z',
      description: 'Implement dark mode theme across the application. Ensure all components support both themes.',
    },
    {
      id: '4',
      title: 'Optimize database queries',
      status: 'open',
      createdAt: '2024-01-12T11:20:00Z',
      description: 'Improve performance of slow database queries. Add proper indexing and optimize joins.',
    },
  ];

  const ticket = mockTickets.find(t => t.id === id);
  if (!ticket) {
    throw new Error('Ticket not found');
  }
  return ticket;
};
