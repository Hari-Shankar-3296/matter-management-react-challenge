import { User } from '@/types';

interface TeamMemberItemProps {
  member: User;
}

const TeamMemberItem = ({ member }: TeamMemberItemProps) => {
  return (
    <div className="team-member">
      <div className="member-avatar">
        {member.firstName[0]}
        {member.lastName[0]}
      </div>
      <div className="member-info">
        <span className="member-name">
          {member.firstName} {member.lastName}
        </span>
        <span className="member-email">{member.email}</span>
      </div>
    </div>
  );
};

export default TeamMemberItem;
