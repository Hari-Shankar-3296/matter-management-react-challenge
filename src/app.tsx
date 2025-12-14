import { Routes, Route } from 'react-router-dom';
import TicketsPage from './containers/TicketsPage';
import TicketList from './containers/TicketList';
import TicketFilters from './containers/TicketFilters';
import UserProfile from './containers/UserProfile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TicketsPage />} />
      <Route path="/tickets" element={<TicketsPage />} />
      <Route path="/tickets/:ticketId" element={<TicketsPage />} />
      <Route path="/ticket-list" element={<TicketList />} />
      <Route path="/ticket-filters" element={<TicketFilters />} />
      <Route path="/user-profile" element={<UserProfile />} />
    </Routes>
  );
}

export default App;
