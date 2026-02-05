import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUsers } from '@/hooks/useUsers/useUsers';
import { useUpdateTicket } from '@/hooks/useTickets/useTickets';

interface AssigneeSelectorProps {
  ticketId: string;
  currentAssigneeId?: string;
  readonly?: boolean;
  onUpdate?: () => void;
}

const AssigneeSelector = ({
  ticketId,
  currentAssigneeId,
  readonly = false,
  onUpdate,
}: AssigneeSelectorProps) => {
  const { data: users } = useUsers();
  const updateTicket = useUpdateTicket();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const currentAssignee = users?.find((u) => u.id === currentAssigneeId);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Check if click is inside the portal dropdown
        const portalElement = document.getElementById(`assignee-dropdown-${ticketId}`);
        if (portalElement && portalElement.contains(event.target as Node)) {
          return;
        }
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', () => setIsOpen(false)); // Close on resize for simplicity
      window.addEventListener('scroll', () => setIsOpen(false), true); // Close on scroll
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', () => setIsOpen(false));
      window.removeEventListener('scroll', () => setIsOpen(false), true);
    };
  }, [isOpen, ticketId]);

  const handleSelect = (userId: string) => {
    updateTicket.mutate(
      { id: ticketId, assigneeId: userId },
      {
        onSuccess: () => {
          setIsOpen(false);
          if (onUpdate) onUpdate();
        },
      }
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (readonly) {
    if (!currentAssignee) return <span className="text-muted">Unassigned</span>;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'var(--primary-500)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 'bold',
          }}
        >
          {getInitials(currentAssignee.firstName, currentAssignee.lastName)}
        </div>
        <span>
          {currentAssignee.firstName} {currentAssignee.lastName}
        </span>
      </div>
    );
  }

  const dropdownContent = (
    <div
      id={`assignee-dropdown-${ticketId}`}
      style={{
        position: 'absolute',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 9999, // High z-index to sit on top of everything
        width: '240px',
        maxHeight: '300px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          padding: '8px',
          borderBottom: '1px solid var(--border-color)',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          color: 'var(--text-secondary)',
        }}
      >
        Assign to...
      </div>
      {users?.map((user) => (
        <div
          key={user.id}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect(user.id);
          }}
          style={{
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            background: currentAssigneeId === user.id ? 'var(--bg-secondary)' : 'transparent',
            transition: 'background 0.2s',
          }}
          className="dropdown-item hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--primary-500)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}
          >
            {getInitials(user.firstName, user.lastName)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              {user.firstName} {user.lastName}
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.email}
            </span>
          </div>
          {currentAssigneeId === user.id && (
            <span style={{ marginLeft: 'auto', color: 'var(--primary-500)' }}>✓</span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 8px',
          borderRadius: '4px',
          transition: 'background-color 0.2s',
        }}
        className="assignee-trigger hover:bg-slate-100 dark:hover:bg-slate-800"
        title="Click to assign"
      >
        {currentAssignee ? (
          <>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--primary-500)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                flexShrink: 0,
              }}
            >
              {getInitials(currentAssignee.firstName, currentAssignee.lastName)}
            </div>
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '120px',
              }}
            >
              {currentAssignee.firstName} {currentAssignee.lastName}
            </span>
          </>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
            + Assign
          </span>
        )}
      </div>

      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default AssigneeSelector;
