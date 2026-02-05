import { Ticket } from '../types';

interface TicketDetailProps {
  ticketDetail: Ticket | null | undefined;
}

const TicketDetail = ({ ticketDetail }: TicketDetailProps) => {
  if (!ticketDetail) {
    return <div>Loading ticket details...</div>;
  }

  return (
    <div>
      <h2>{ticketDetail.title}</h2>
      <div style={{ marginTop: '20px' }}>
        <p><strong>Status:</strong> {ticketDetail.status}</p>
        <p><strong>Created:</strong> {new Date(ticketDetail.createdAt).toLocaleString()}</p>
        <p><strong>Description:</strong></p>
        <p>{ticketDetail.description || 'No description available'}</p>
      </div>
    </div>
  );
};

export default TicketDetail;
