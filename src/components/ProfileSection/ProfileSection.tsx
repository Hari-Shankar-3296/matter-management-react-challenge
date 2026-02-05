interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

const ProfileSection = ({ title, children }: ProfileSectionProps) => {
  return (
    <div className="profile-section">
      <h3>{title}</h3>
      {children}
    </div>
  );
};

export default ProfileSection;
