/**
 * LEGACY CODE - This is intentionally messy!
 * 
 * Your task: Refactor this to follow modern patterns:
 * 1. Move to pages/ directory structure
 * 2. Remove unnecessary useMemo/useCallback
 * 3. Fix useEffect circular dependencies
 * 4. Set up proper React Query key management
 * 5. Extract shareable hooks and utilities
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import TicketList from '../../components/TicketList';
import TicketDetail from '../../components/TicketDetail';
import { fetchTickets, fetchTicketById } from '../../utils/api';

const TicketsPage = () => {
  const { ticketId } = useParams<{ ticketId?: string }>();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  // Unnecessary useMemo - this is just a string
  const memoizedSearchQuery = useMemo(() => {
    return searchQuery.trim().toLowerCase();
  }, [searchQuery]);

  // Unnecessary useCallback - this is passed to a regular component, not memoized
  const handleTicketSelect = useCallback((id: string) => {
    setSelectedTicketId(id);
  }, []);

  // Unnecessary useCallback
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Unnecessary useCallback
  const handleFilterChange = useCallback((status: string) => {
    setFilterStatus(status);
  }, []);

  // Unnecessary useCallback
  const handleSortChange = useCallback((sort: 'date' | 'title') => {
    setSortBy(sort);
  }, []);

  // Circular dependency issue - this useEffect depends on data that changes
  const { data: ticketsData, isLoading, refetch } = useQuery({
    queryKey: ['tickets', searchQuery, filterStatus, sortBy],
    queryFn: () => fetchTickets({ search: searchQuery, status: filterStatus, sortBy }),
  });

  // Unnecessary useMemo - simple array operations don't need memoization
  const filteredTickets = useMemo(() => {
    if (!ticketsData) return [];
    
    let filtered = ticketsData;
    
    if (memoizedSearchQuery) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(memoizedSearchQuery)
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === filterStatus);
    }
    
    if (sortBy === 'date') {
      filtered = [...filtered].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return filtered;
  }, [ticketsData, memoizedSearchQuery, filterStatus, sortBy]);

  // Circular dependency - useEffect that depends on query result and triggers refetch
  useEffect(() => {
    if (ticketsData && ticketsData.length === 0 && searchQuery) {
      // This creates a circular dependency
      refetch();
    }
  }, [ticketsData, searchQuery, refetch]);

  // Another unnecessary useEffect - could use onSuccess callback instead
  useEffect(() => {
    if (ticketId && ticketId !== selectedTicketId) {
      setSelectedTicketId(ticketId);
    }
  }, [ticketId, selectedTicketId]);

  // Unnecessary useMemo for selected ticket (unused - candidate should remove)
  // const selectedTicket = useMemo(() => {
  //   if (!selectedTicketId) return null;
  //   return filteredTickets.find(t => t.id === selectedTicketId) || null;
  // }, [selectedTicketId, filteredTickets]);

  // Fetch ticket detail separately - should be using React Query properly
  const { data: ticketDetail } = useQuery({
    queryKey: ['ticket', selectedTicketId],
    queryFn: () => fetchTicketById(selectedTicketId!),
    enabled: !!selectedTicketId,
  });

  // Another unnecessary useEffect - handling success in useEffect instead of onSuccess
  useEffect(() => {
    if (ticketDetail) {
      console.log('Ticket loaded:', ticketDetail.id);
      // Some side effect that could be in onSuccess callback
    }
  }, [ticketDetail]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '40%', borderRight: '1px solid #ccc', padding: '20px' }}>
        <h1>Tickets</h1>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as 'date' | 'title')}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <TicketList
            tickets={filteredTickets}
            onSelect={handleTicketSelect}
            selectedId={selectedTicketId}
          />
        )}
      </div>
      <div style={{ width: '60%', padding: '20px' }}>
        {selectedTicketId ? (
          <TicketDetail ticketId={selectedTicketId} ticketDetail={ticketDetail} />
        ) : (
          <div>Select a ticket to view details</div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;
