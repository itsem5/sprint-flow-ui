
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TaskWithDetails } from "@/hooks/useStaticData";
import { Sprint } from "./SprintManager";
import { ArrowRight, Calendar, List } from "lucide-react";

interface TaskMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskWithDetails | null;
  sprints: Sprint[];
  currentSprint: Sprint | null;
  onMoveTask: (taskId: string, targetSprintId: string | null) => void;
}

export function TaskMoveModal({ 
  isOpen, 
  onClose, 
  task, 
  sprints, 
  currentSprint,
  onMoveTask 
}: TaskMoveModalProps) {
  const [selectedDestination, setSelectedDestination] = useState<string>('');

  const handleMove = () => {
    if (task && selectedDestination) {
      const targetSprintId = selectedDestination === 'backlog' ? null : selectedDestination;
      onMoveTask(task.id, targetSprintId);
      onClose();
      setSelectedDestination('');
    }
  };

  if (!task) return null;

  const availableDestinations = [
    { id: 'backlog', name: 'Product Backlog', type: 'backlog' },
    ...sprints.filter(sprint => sprint.id !== currentSprint?.id).map(sprint => ({
      id: sprint.id,
      name: sprint.name,
      type: 'sprint' as const
    }))
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Move Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <p className="font-medium text-sm">{task.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Currently in:</span>
            {currentSprint ? (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Calendar className="w-3 h-3 mr-1" />
                {currentSprint.name}
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                <List className="w-3 h-3 mr-1" />
                Product Backlog
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Move to:</span>
          </div>

          <Select value={selectedDestination} onValueChange={setSelectedDestination}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {availableDestinations.map((destination) => (
                <SelectItem key={destination.id} value={destination.id}>
                  <div className="flex items-center gap-2">
                    {destination.type === 'backlog' ? (
                      <List className="w-4 h-4" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}
                    {destination.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleMove} disabled={!selectedDestination}>
              Move Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
