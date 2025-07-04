import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useSearchUsersInOrganization } from '@/api/users/user';
import { useAuth } from '@/contexts/AuthContext';

interface SearchUsersProps {
  onSelectUser: (user: any) => void;
}

const SearchUsers = ({ onSelectUser }: SearchUsersProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults } = useSearchUsersInOrganization(user?.organization?.id, searchQuery);

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search for a user..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchResults && searchResults.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto">
          {searchResults.map((user) => (
            <li
              key={user.id}
              className="p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onSelectUser(user);
                setSearchQuery('');
              }}
            >
              {user.firstName} {user.lastName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchUsers;