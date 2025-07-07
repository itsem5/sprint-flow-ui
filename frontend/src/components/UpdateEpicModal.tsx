import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchUsers from './SearchUsers';
import { User } from '@/api/users/user';
import { Epic } from '@/api/epics/epic';

interface UpdateEpicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateEpic: (epicData: Partial<Epic>) => void;
  epic: Epic;
}

export const UpdateEpicModal: React.FC<UpdateEpicModalProps> = ({ isOpen, onClose, onUpdateEpic, epic }) => {
  const [name, setName] = useState(epic.name);
  const [description, setDescription] = useState(epic.description);
  const [status, setStatus] = useState(epic.status);
  const [priority, setPriority] = useState(epic.priority);
  const [assignee, setAssignee] = useState<User | null>(epic.assigneeUser);
  const [assignedTo, setAssignedTo] = useState<User | null>(epic.assignedToUser);
  const [tags, setTags] = useState(epic.tags.join(', '));
  const [startDate, setStartDate] = useState(epic.startDate.split('T')[0]);
  const [dueDate, setDueDate] = useState(epic.dueDate.split('T')[0]);

  const { toast } = useToast();

  useEffect(() => {
    setName(epic.name);
    setDescription(epic.description);
    setStatus(epic.status);
    setPriority(epic.priority);
    setAssignee(epic.assigneeUser);
    setAssignedTo(epic.assignedToUser);
    setTags(epic.tags.join(', '));
    setStartDate(epic.startDate.split('T')[0]);
    setDueDate(epic.dueDate.split('T')[0]);
  }, [epic]);

  const handleSubmit = () => {
    onUpdateEpic({
      name,
      description,
      status,
      priority,
      assignee: assignee?.id,
      assignedTo: assignedTo?.id,
      tags: tags.split(',').map(tag => tag.trim()),
      startDate,
      dueDate,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update Epic</DialogTitle>
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
                <SearchUsers onSelectUser={setAssignee} />
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedTo" className="text-right">
              Assigned To
            </Label>
            <div className="col-span-3">
              {assignedTo ? (
                <div className="flex items-center gap-2">
                  <span>{assignedTo.firstName} {assignedTo.lastName}</span>
                  <Button variant="ghost" size="sm" onClick={() => setAssignedTo(null)}>X</Button>
                </div>
              ) : (
                <SearchUsers onSelectUser={setAssignedTo} />
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
          <Button onClick={handleSubmit}>Update Epic</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};