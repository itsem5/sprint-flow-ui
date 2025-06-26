
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useStaticData, EpicWithDetails } from "@/hooks/useStaticData";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateStory: (story: {
    name: string;
    description: string;
    epicId: string;
  }) => void;
  projectId?: string;
}

export function CreateStoryModal({ isOpen, onClose, onCreateStory, projectId }: CreateStoryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedEpicId, setSelectedEpicId] = useState('');
  const data = useStaticData();

  const availableEpics = data?.epics.filter(epic => 
    !projectId || epic.projectId === projectId
  ) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim() && selectedEpicId) {
      onCreateStory({
        name: name.trim(),
        description: description.trim(),
        epicId: selectedEpicId
      });
      setName('');
      setDescription('');
      setSelectedEpicId('');
      onClose();
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
            <Label htmlFor="epic-select">Epic</Label>
            <Select value={selectedEpicId} onValueChange={setSelectedEpicId} required>
              <SelectTrigger id="epic-select">
                <SelectValue placeholder="Select an epic" />
              </SelectTrigger>
              <SelectContent>
                {availableEpics.map((epic) => (
                  <SelectItem key={epic.id} value={epic.id}>
                    {epic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Story</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
