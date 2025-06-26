
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Settings, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Sprint {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'completed';
  tasks: string[];
}

interface SprintManagerProps {
  isOpen: boolean;
  onClose: () => void;
  sprints: Sprint[];
  onCreateSprint: (sprint: Omit<Sprint, 'id' | 'tasks'>) => void;
  onUpdateSprint: (sprintId: string, updates: Partial<Sprint>) => void;
  currentSprint: Sprint | null;
  onSprintChange: (sprintId: string) => void;
}

export function SprintManager({ 
  isOpen, 
  onClose, 
  sprints, 
  onCreateSprint, 
  onUpdateSprint,
  currentSprint,
  onSprintChange
}: SprintManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSprint, setNewSprint] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planning' as const
  });

  const handleCreateSprint = () => {
    if (newSprint.name && newSprint.startDate && newSprint.endDate) {
      onCreateSprint(newSprint);
      setNewSprint({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'planning'
      });
      setIsCreateModalOpen(false);
    }
  };

  const getStatusColor = (status: Sprint['status']) => {
    switch (status) {
      case 'planning': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Sprint Management</span>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Sprint
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sprints.map((sprint) => (
                <div 
                  key={sprint.id} 
                  className={`p-4 rounded-lg border ${
                    currentSprint?.id === sprint.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{sprint.name}</h3>
                      <Badge className={getStatusColor(sprint.status)}>
                        {sprint.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{sprint.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {sprint.tasks.length} tasks
                      </span>
                      <div className="flex gap-2">
                        {currentSprint?.id !== sprint.id && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onSprintChange(sprint.id)}
                          >
                            Select
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Sprint</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Sprint Name</label>
              <Input
                value={newSprint.name}
                onChange={(e) => setNewSprint({ ...newSprint, name: e.target.value })}
                placeholder="e.g., Sprint 24"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newSprint.description}
                onChange={(e) => setNewSprint({ ...newSprint, description: e.target.value })}
                placeholder="Sprint goals and description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={newSprint.startDate}
                  onChange={(e) => setNewSprint({ ...newSprint, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={newSprint.endDate}
                  onChange={(e) => setNewSprint({ ...newSprint, endDate: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSprint}>
                Create Sprint
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
