
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Tag } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";

interface TagSelectorProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagSelector({ value, onChange, placeholder = "Select tags" }: TagSelectorProps) {
  const { projectTags, addProjectTag } = useProject();
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !projectTags.includes(newTag.trim())) {
      addProjectTag(newTag.trim());
      onChange([...value, newTag.trim()]);
      setNewTag("");
      setIsAddingTag(false);
    }
  };

  const handleTagSelect = (tag: string) => {
    if (!value.includes(tag)) {
      onChange([...value, tag]);
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <Select onValueChange={handleTagSelect}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {projectTags.filter(tag => !value.includes(tag)).map((tag) => (
            <SelectItem key={tag} value={tag}>
              <div className="flex items-center gap-2">
                <Tag className="w-3 h-3" />
                {tag}
              </div>
            </SelectItem>
          ))}
          <div className="border-t pt-2">
            {!isAddingTag ? (
              <div
                className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm"
                onClick={() => setIsAddingTag(true)}
              >
                <Plus className="w-3 h-3" />
                Add new tag
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Tag name"
                  className="h-6 text-xs"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button size="sm" onClick={handleAddTag} className="h-6 px-2">
                  Add
                </Button>
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
      
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map(tag => (
            <div
              key={tag}
              className="flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-sm text-xs cursor-pointer hover:bg-secondary/80"
              onClick={() => handleTagRemove(tag)}
            >
              {tag}
              <span className="ml-1">×</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
