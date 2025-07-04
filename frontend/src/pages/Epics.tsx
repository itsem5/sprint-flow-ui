import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CreateEpicModal } from '@/components/CreateEpicModal';
import { createEpic, getAllEpics } from '@/api/epics/epic';
import { useProject } from '@/contexts/ProjectContext';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Epics = () => {
  const [isCreateEpicModalOpen, setIsCreateEpicModalOpen] = useState(false);
  const { selectedProject } = useProject();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: epics, isLoading, isError } = useQuery({
    queryKey: ['epics'],
    queryFn: getAllEpics,
  });

  const handleCreateEpic = async (epicData: {
    name: string;
    description: string;
    status: string;
    priority: string;
    assignedTo?: string;
    tags?: string[];
    startDate?: string;
    dueDate?: string;
    createdBy?: number; // Assuming createdBy is a string representing user ID
  }) => {
    if (!selectedProject) {
      toast({
        title: 'Error',
        description: 'No project selected. Please select a project to create an epic.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await createEpic({ ...epicData, projectId: selectedProject.id, createdBy: epicData.createdBy });
      toast({
        title: 'Success',
        description: 'Epic created successfully.',
      });
      setIsCreateEpicModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['epics'] });
    } catch (error) {
      console.error('Failed to create epic:', error);
      toast({
        title: 'Error',
        description: 'Failed to create epic.',
        variant: 'destructive',
      });
    }
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {epics?.map((epic: any) => (
          <Card key={epic.id}>
            <CardHeader>
              <CardTitle>{epic.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{epic.description}</p>
              <p className="text-sm text-muted-foreground mt-2">Status: {epic.status}</p>
              <p className="text-sm text-muted-foreground">Priority: {epic.priority}</p>
              {epic.assignedTo && <p className="text-sm text-muted-foreground">Assigned To: {epic.assignedTo}</p>}
              {epic.tags && epic.tags.length > 0 && (
                <p className="text-sm text-muted-foreground">Tags: {epic.tags.join(', ')}</p>
              )}
              {epic.startDate && <p className="text-sm text-muted-foreground">Start Date: {new Date(epic.startDate).toLocaleDateString()}</p>}
              {epic.dueDate && <p className="text-sm text-muted-foreground">Due Date: {new Date(epic.dueDate).toLocaleDateString()}</p>}
              <p className="text-sm text-muted-foreground mt-2">Project ID: {epic.projectId}</p>
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
    </div>
  );
};

export default Epics;