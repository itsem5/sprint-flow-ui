import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { getAllEpicsByProject } from '@/api/epics/epic';

interface Epic {
  id: string;
  name: string;
}

interface SearchEpicsProps {
  projectId: string;
  onSelectEpic: (epic: Epic) => void;
}

const SearchEpics = ({ projectId, onSelectEpic }: SearchEpicsProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: searchResults = [] } = useQuery<Epic[]>({
    queryKey: ['epics', projectId, searchQuery],
    queryFn: () => getAllEpicsByProject(projectId, searchQuery),
    enabled: !!projectId && searchQuery.trim().length > 0,
  });

  const handleSelect = (epic: Epic) => {
    onSelectEpic(epic);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search for an epic..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-48 overflow-y-auto shadow">
          {searchResults.length > 0 ? (
            searchResults.map((epic) => (
              <li
                key={epic.id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelect(epic)}
              >
                {epic.name}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchEpics;
