
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useStaticData } from "@/hooks/useStaticData";

interface CreateSubTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSubTask: (subTask: {
    name: string;
    description: string;
    taskId: string;
  }) => void;
  storyId?: string;
}

export function CreateSubTaskModal({ isOpen, onClose, onCreateSubTask, storyId }: CreateSubTaskModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const data = useStaticData();

  const availableTasks = data?.tasks.filter(task => 
    !storyId || task.storyId === storyId
  ) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim() && selectedTaskId) {
      onCreateSubTask({
        name: name.trim(),
        description: description.trim(),
        taskId: selectedTaskId
      });
      setName('');
      setDescription('');
      setSelectedTaskId('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Sub-Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-select">Task</Label>
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId} required>
              <SelectTrigger id="task-select">
                <SelectValue placeholder="Select a task" />
              </SelectTrigger>
              <SelectContent>
                {availableTasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtask-name">Sub-Task Name</Label>
            <Input
              id="subtask-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter sub-task name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtask-description">Description</Label>
            <Textarea
              id="subtask-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter sub-task description"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Sub-Task</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
