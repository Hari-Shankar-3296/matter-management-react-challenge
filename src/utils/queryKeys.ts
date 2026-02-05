// TASK 4: This needs to be refactored to use a centralized query key factory
// Current implementation is scattered and not type-safe

export const getTicketKeys = {
  list: (status?: string) => ['tickets', 'list', status] as const,
  detail: (id: string) => ['tickets', 'detail', id] as const,
};
