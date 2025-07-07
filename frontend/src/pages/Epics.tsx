import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Target, Flag, Tag, User, Calendar, ArrowRight, Clock, Edit, Trash2 } from 'lucide-react';
import { CreateEpicModal } from '@/components/CreateEpicModal';
import { UpdateEpicModal } from '@/components/UpdateEpicModal'; // Assuming you have this component
import { createEpic, getAllEpics, updateEpic, deleteEpic, Epic } from '@/api/epics/epic';
import { useProject } from '@/contexts/ProjectContext';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';




const Epics = () => {
  const [isCreateEpicModalOpen, setIsCreateEpicModalOpen] = useState(false);
  const [isUpdateEpicModalOpen, setIsUpdateEpicModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);

  const { selectedProject } = useProject();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: epics, isLoading, isError } = useQuery<Epic[]>({
    queryKey: ['epics', selectedProject?.id],
    queryFn: () => getAllEpics(selectedProject?.id || ''),
    enabled: !!selectedProject,
  });

  const createEpicMutation = useMutation({
    mutationFn: createEpic,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Epic created successfully.' });
      queryClient.invalidateQueries({ queryKey: ['epics'] });
      setIsCreateEpicModalOpen(false);
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateEpicMutation = useMutation({
    mutationFn: (data: { id: string; epicData: Partial<Epic> }) => updateEpic(data.id, data.epicData),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Epic updated successfully.' });
      queryClient.invalidateQueries({ queryKey: ['epics'] });
      setIsUpdateEpicModalOpen(false);
      setSelectedEpic(null);
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteEpicMutation = useMutation({
    mutationFn: deleteEpic,
    onSuccess: () => {
      toast({ title: 'Success', description: 'Epic deleted successfully.' });
      queryClient.invalidateQueries({ queryKey: ['epics'] });
      setIsDeleteConfirmOpen(false);
      setSelectedEpic(null);
    },
    onError: (error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleCreateEpic = (epicData: Omit<Epic, 'id' | 'project' | 'creator' | 'assigneeUser' | 'assignedToUser' | 'stories'>) => {
    if (!selectedProject) {
      toast({ title: 'Error', description: 'No project selected.', variant: 'destructive' });
      return;
    }
    createEpicMutation.mutate({ ...epicData, projectId: selectedProject.id });
  };

  const handleUpdateEpic = (epicData: Partial<Epic>) => {
    if (!selectedEpic) return;
    updateEpicMutation.mutate({ id: selectedEpic.id, epicData });
  };

  const handleDeleteConfirm = () => {
    if (!selectedEpic) return;
    deleteEpicMutation.mutate(selectedEpic.id);
  };

  const openUpdateModal = (epic: Epic) => {
    setSelectedEpic(epic);
    setIsUpdateEpicModalOpen(true);
  };

  const openDeleteConfirm = (epic: Epic) => {
    setSelectedEpic(epic);
    setIsDeleteConfirmOpen(true);
  };

  if (isLoading) return <div>Loading epics...</div>;
  if (isError) return <div>Error loading epics.</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Epics Board</h1>
        <Button onClick={() => setIsCreateEpicModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Epic
        </Button>
      </div>

      <div className="space-y-4">
        {epics?.map((epic) => (
          <Card key={epic.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                      {epic.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {epic.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity ml-4 flex-shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openUpdateModal(epic)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteConfirm(epic)} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
            {/* Status and Priority Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border rounded-full ${getStatusColor(epic.status)}`}>
                {epic.status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border rounded-full ${getPriorityColor(epic.priority)}`}>
                <Flag className="w-3 h-3 mr-1" />
                {epic.priority}
              </span>
            </div>

            {/* Tags */}
            {epic.tags && epic.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-gray-500" />
                {epic.tags.map((tag, index) => (
                 <span 
                 key={index} 
                 className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 rounded-full"
               >
                 {tag}
               </span>
                ))}
              </div>
            )}

            <Separator />

           {/* User Information Table */}
           <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-4 py-2 text-xs font-semibold text-gray-700 text-center">Assignee</th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-700 text-center">Assigned To</th>
                    <th className="px-4 py-2 text-xs font-semibold text-gray-700 text-center">Creator</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <UserCell user={epic.assigneeUser} label="Assignee" />
                    <UserCell user={epic.assignedToUser} label="Assigned To" />
                    <UserCell user={epic.creator} label="Creator" />
                  </tr>
                </tbody>
              </table>
            </div>

               {/* Bottom Row - Assignee and Dates */}
               <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-500">
                {epic.startDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(epic.startDate)}</span>
                  </div>
                )}
                {epic.startDate && epic.dueDate && (
                  <ArrowRight className="w-3 h-3" />
                )}
                {epic.dueDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDate(epic.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Project Name */}
            <div className="text-xs text-gray-400 pt-2 border-t">
              Project: {epic.project?.name}
            </div>
          </CardContent>
          </Card>
        ))}
      </div>

      <CreateEpicModal
        isOpen={isCreateEpicModalOpen}
        onClose={() => setIsCreateEpicModalOpen(false)}
        onCreateEpic={handleCreateEpic}
        projectId={selectedProject?.id}
      />

      {selectedEpic && (
        <UpdateEpicModal
          isOpen={isUpdateEpicModalOpen}
          onClose={() => {
            setIsUpdateEpicModalOpen(false);
            setSelectedEpic(null);
          }}
          onUpdateEpic={handleUpdateEpic}
          epic={selectedEpic}
        />
      )}

      <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the epic.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedEpic(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const UserCell = ({
  user,
  label,
}: {
  user?: { firstName: string; lastName: string };
  label: string;
}) => {
  if (!user) {
    return (
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-xs text-gray-500">Unassigned</span>
        </div>
      </td>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const initials = getInitials(user.firstName, user.lastName);
  const avatarColor = getUserAvatarColor(fullName);

  return (
    <td className="px-4 py-3 text-center">
      <div className="flex items-center justify-center gap-2">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${avatarColor}`}
        >
          {initials}
        </div>
        <span className="text-xs font-medium text-gray-900">{fullName}</span>
      </div>
    </td>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in  ':
    case 'active':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
    case 'done':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
    case 'todo':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'blocked':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const getUserAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-100 text-blue-700 border-blue-200',
    'bg-purple-100 text-purple-700 border-purple-200',
    'bg-green-100 text-green-700 border-green-200',
    'bg-orange-100 text-orange-700 border-orange-200',
    'bg-pink-100 text-pink-700 border-pink-200',
    'bg-indigo-100 text-indigo-700 border-indigo-200',
  ];
  
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

export default Epics;