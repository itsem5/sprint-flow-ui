
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import SearchEpics from "./SearchEpics";
import SearchUsers from "./SearchUsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStory } from "@/api/stories/story";
import { useToast } from "./ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/api/users/user";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

export function CreateStoryModal({ isOpen, onClose, projectId }: CreateStoryModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEpic, setSelectedEpic] = useState<{ id: string; name: string } | null>(null);
  const [status, setStatus] = useState('To Do');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState<User | null>(null);
  const [assignedTo, setAssignedTo] = useState<User | null>(null);
  const [tags, setTags] = useState('');
  const [storyPoints, setStoryPoints] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createStoryMutation = useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      toast({ title: "Success", description: "Story created successfully." });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      setName('');
      setDescription('');
      setSelectedEpic(null);
      setStatus('To Do');
      setPriority('Medium');
      setAssignee(null);
      setAssignedTo(null);
      setTags('');
      setStoryPoints(0);
      setStartDate('');
      setDueDate('');
      onClose();
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim() && selectedEpic) {
      createStoryMutation.mutate({
        name: name.trim(),
        description: description.trim(),
        epicId: selectedEpic.id,
        projectId: projectId,
        status,
        priority,
        createdById: user.id,
        assigneeId: assignee?.id,
        assignedTo: assignedTo?.id,
        tags: tags.split(',').map(tag => tag.trim()),
        storyPoints,
        startDate,
        dueDate,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Story</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="epic-search">Epic</Label>
            {projectId && <SearchEpics projectId={projectId} onSelectEpic={setSelectedEpic} />}
            {selectedEpic && <p>Selected Epic: {selectedEpic.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="story-name">Story Name</Label>
            <Input
              id="story-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter story name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="story-description">Description</Label>
            <Textarea
              id="story-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter story description"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              {assignee ? (
                <div className="flex items-center gap-2">
                  <span>{assignee.firstName} {assignee.lastName}</span>
                  <Button variant="ghost" size="sm" onClick={() => setAssignee(null)}>X</Button>
                </div>
              ) : (
                <SearchUsers onSelectUser={setAssignee} />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
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

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="story-points">Story Points</Label>
            <Input
              id="story-points"
              type="number"
              value={storyPoints}
              onChange={(e) => setStoryPoints(parseInt(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Story</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
