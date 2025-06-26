
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Task } from "@/components/TaskCard";

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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'task' as Task['type'],
    status: defaultStatus as Task['status'],
    priority: 'medium' as Task['priority'],
    storyPoints: 1,
    assignee: developers[0].name,
    labels: [] as string[],
    newLabel: ''
  });

  const handleSubmit = () => {
    if (!formData.title.trim()) return;

    const assignee = developers.find(dev => dev.name === formData.assignee) || developers[0];
    
    const newTask: Omit<Task, 'id'> = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      status: formData.status,
      priority: formData.priority,
      storyPoints: formData.storyPoints,
      assignee: {
        name: assignee.name,
        initials: assignee.initials
      },
      reporter: {
        name: 'Current User',
        initials: 'CU'
      },
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString().split('T')[0],
      labels: formData.labels
    };

    onAddTask(newTask);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'task',
      status: defaultStatus as Task['status'],
      priority: 'medium',
      storyPoints: 1,
      assignee: developers[0].name,
      labels: [],
      newLabel: ''
    });
    
    onClose();
  };

  const addLabel = () => {
    if (formData.newLabel.trim() && !formData.labels.includes(formData.newLabel.trim())) {
      setFormData({
        ...formData,
        labels: [...formData.labels, formData.newLabel.trim()],
        newLabel: ''
      });
    }
  };

  const removeLabel = (labelToRemove: string) => {
    setFormData({
      ...formData,
      labels: formData.labels.filter(label => label !== labelToRemove)
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter task title"
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
            <Select value={formData.assignee} onValueChange={(value) => setFormData({...formData, assignee: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {developers.map(dev => (
                  <SelectItem key={dev.name} value={dev.name}>{dev.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Labels</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={formData.newLabel}
                onChange={(e) => setFormData({...formData, newLabel: e.target.value})}
                placeholder="Add label"
                onKeyPress={(e) => e.key === 'Enter' && addLabel()}
              />
              <Button onClick={addLabel} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.labels.map(label => (
                <Badge key={label} variant="outline" className="flex items-center gap-1">
                  {label}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeLabel(label)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!formData.title.trim()}>
              Add Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
