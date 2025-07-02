
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagSelector } from "@/components/TagSelector";
import { Task } from "@/types/project";
import { useProject } from "@/contexts/ProjectContext";
import { generateTicketId } from "@/utils/ticketUtils";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  defaultStatus?: string;
}

const developers = [
  { name: 'John Doe', initials: 'JD' },
  { name: 'Jane Smith', initials: 'JS' },
  { name: 'Bob Wilson', initials: 'BW' },
  { name: 'Alice Brown', initials: 'AB' },
];

export function AddTaskModal({ isOpen, onClose, onAddTask, defaultStatus = 'todo' }: AddTaskModalProps) {
  const { selectedProject } = useProject();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'task' as Task['type'],
    status: defaultStatus as Task['status'],
    priority: 'medium' as Task['priority'],
    storyPoints: 1,
    assigneeId: 'user-1',
    reporterId: 'current-user',
    labels: [] as string[]
  });

  const handleSubmit = () => {
    if (!formData.name.trim() || !selectedProject) return;
    
    // Generate ticket ID based on type and current counter
    const ticketId = generateTicketId(formData.type, selectedProject.ticketCounter[formData.type] + 1);
    
    const newTask: Omit<Task, 'id'> = {
      ticketId,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      status: formData.status,
      priority: formData.priority,
      storyPoints: formData.storyPoints,
      assigneeId: formData.assigneeId,
      reporterId: formData.reporterId,
      projectId: selectedProject.id,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString().split('T')[0],
      labels: formData.labels,
      attachments: [],
      subTasks: [],
      relatedTickets: []
    };

    onAddTask(newTask);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      type: 'task',
      status: defaultStatus as Task['status'],
      priority: 'medium',
      storyPoints: 1,
      assigneeId: 'user-1',
      reporterId: 'current-user',
      labels: []
    });
    
    onClose();
  };

  if (!selectedProject) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>No Project Selected</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground">Please select a project first to add tasks.</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Task - {selectedProject.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter task name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe the task"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select value={formData.type} onValueChange={(value: Task['type']) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="sub-task">Sub-task</SelectItem>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="issue">Issue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <Select value={formData.priority} onValueChange={(value: Task['priority']) => setFormData({...formData, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select value={formData.status} onValueChange={(value: Task['status']) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Story Points</label>
              <Select value={formData.storyPoints.toString()} onValueChange={(value) => setFormData({...formData, storyPoints: parseInt(value)})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 5, 8, 13, 21].map(point => (
                    <SelectItem key={point} value={point.toString()}>{point}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Assignee</label>
            <Select value={formData.assigneeId} onValueChange={(value) => setFormData({...formData, assigneeId: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {developers.map((dev, index) => (
                  <SelectItem key={`user-${index + 1}`} value={`user-${index + 1}`}>{dev.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <TagSelector
              value={formData.labels}
              onChange={(labels) => setFormData({...formData, labels})}
              placeholder="Select or add tags"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
              Add Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
