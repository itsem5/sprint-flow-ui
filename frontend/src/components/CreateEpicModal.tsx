import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchUsers from './SearchUsers';
import { User } from '@/api/users/user';
import { useAuth } from '@/contexts/AuthContext';

interface CreateEpicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEpic: (epicData: {
    name: string;
    description: string;
    status: string;
    priority: string;
    assigneeId?: string;
    tags?: string[];
    startDate?: string;
    dueDate?: string;
    createdBy?: number; 
  }) => void;
  projectId?: string;
}

export const CreateEpicModal: React.FC<CreateEpicModalProps> = ({ isOpen, onClose, onCreateEpic, projectId }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Not Started');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState<User | null>(null);
  const [tags, setTags] = useState('');
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields (Name, Description).',
        variant: 'destructive',
      });
      return;
    }
    console.log("Creating epic with data:", user);
    

    onCreateEpic({
      name,
      description,
      status,
      priority,
      assigneeId: assignee?.id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
      createdBy: user?.id, // Pass the logged-in user's ID
    });
    setName('');
    setDescription('');
    setStatus('Not Started');
    setPriority('Medium');
    setAssignee(null);
    setTags('');
    setStartDate('');
    setDueDate('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Epic</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignee" className="text-right">
              Assignee
            </Label>
            <div className="col-span-3">
              {assignee ? (
                <div className="flex items-center gap-2">
                  <span>{assignee.firstName} {assignee.lastName}</span>
                  <Button variant="ghost" size="sm" onClick={() => setAssignee(null)}>X</Button>
                </div>
              ) : (
                user && !user.organization ? (
                  <span>Please select an organization to assign users.</span>
                ) : (
                  <SearchUsers onSelectUser={setAssignee} />
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="col-span-3"
              placeholder="Comma-separated tags (e.g., ui, backend)"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Epic</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
