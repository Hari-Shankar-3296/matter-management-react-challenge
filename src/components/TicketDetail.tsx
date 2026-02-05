import { useEffect, useState } from 'react';

interface TicketDetailProps {
  ticketId: string;
  ticketDetail: any;
}

const TicketDetail = ({ ticketId, ticketDetail }: TicketDetailProps) => {
  const [localData, setLocalData] = useState<any>(null);

  // Unnecessary useEffect - just use ticketDetail directly TODO: 
  useEffect(() => {
    if (ticketDetail) {
      setLocalData(ticketDetail);
    }
  }, [ticketDetail]);

  // Another unnecessary useEffect TODO: 
  useEffect(() => {
    if (ticketId) {
      console.log('Viewing ticket:', ticketId);
    }
  }, [ticketId]);

  if (!localData) {
    return <div>Loading ticket details...</div>;
  }

  return (
    <div>
      <h2>{localData.title}</h2>
      <div style={{ marginTop: '20px' }}>
        <p><strong>Status:</strong> {localData.status}</p>
        <p><strong>Created:</strong> {new Date(localData.createdAt).toLocaleString()}</p>
        <p><strong>Description:</strong></p>
        <p>{localData.description || 'No description available'}</p>
      </div>
    </div>
  );
};

export default TicketDetail;
