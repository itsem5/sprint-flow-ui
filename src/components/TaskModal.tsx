
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Clock, User, Calendar, Tag } from "lucide-react";
import { Task } from "./TaskCard";
import { cn } from "@/lib/utils";

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: 'John Doe',
    content: 'I think we should approach this differently. What if we break it down into smaller subtasks?',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    author: 'Jane Smith',
    content: 'Good point! I\'ll create the subtasks and update the story points accordingly.',
    timestamp: '1 hour ago',
  },
];

const developers = [
  { name: 'John Doe', initials: 'JD', email: 'john@example.com' },
  { name: 'Jane Smith', initials: 'JS', email: 'jane@example.com' },
  { name: 'Bob Wilson', initials: 'BW', email: 'bob@example.com' },
  { name: 'Alice Brown', initials: 'AB', email: 'alice@example.com' },
];

const typeColors = {
  epic: 'bg-purple-100 text-purple-800 border-purple-200',
  story: 'bg-green-100 text-green-800 border-green-200',
  task: 'bg-blue-100 text-blue-800 border-blue-200',
  'sub-task': 'bg-gray-100 text-gray-800 border-gray-200',
};

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

export function TaskModal({ task, isOpen, onClose, onUpdate }: TaskModalProps) {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (!task) return null;

  const currentTask = editingTask || task;

  const handleSave = () => {
    if (editingTask) {
      onUpdate(editingTask);
      setEditingTask(null);
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  const handleEdit = () => {
    setEditingTask({ ...task });
  };

  const handleFieldChange = (field: keyof Task, value: any) => {
    if (editingTask) {
      setEditingTask({ ...editingTask, [field]: value });
    }
  };

  const handleAssigneeChange = (newAssignee: string) => {
    const developer = developers.find(dev => dev.name === newAssignee);
    if (developer && editingTask) {
      setEditingTask({
        ...editingTask,
        assignee: {
          name: developer.name,
          initials: developer.initials,
        }
      });
    }
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Current User',
        content: newComment,
        timestamp: 'Just now',
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    const updatedTask = { ...currentTask, likes: isLiked ? currentTask.likes - 1 : currentTask.likes + 1 };
    onUpdate(updatedTask);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Task Details</DialogTitle>
            <div className="flex items-center gap-2">
              {!editingTask ? (
                <Button onClick={handleEdit} variant="outline">Edit</Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm">Save</Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">Cancel</Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Description */}
            <div className="space-y-4">
              {editingTask ? (
                <Input
                  value={editingTask.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  className="text-xl font-semibold"
                />
              ) : (
                <h2 className="text-xl font-semibold">{currentTask.title}</h2>
              )}

              {editingTask ? (
                <Textarea
                  value={editingTask.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground">{currentTask.description}</p>
              )}
            </div>

            <Separator />

            {/* Comments Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
              </div>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback className="text-xs">
                        {comment.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                />
                <Button onClick={addComment} className="self-end">
                  Post
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Task Meta Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span className="font-medium">Type & Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={typeColors[currentTask.type]}>
                  {currentTask.type.toUpperCase()}
                </Badge>
                <div className={cn("w-3 h-3 rounded-full", priorityColors[currentTask.priority])} />
                <span className="text-sm capitalize">{currentTask.priority}</span>
              </div>
            </div>

            <Separator />

            {/* Story Points */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Story Points</span>
              </div>
              {editingTask ? (
                <Select
                  value={editingTask.storyPoints.toString()}
                  onValueChange={(value) => handleFieldChange('storyPoints', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 8, 13, 21].map(point => (
                      <SelectItem key={point} value={point.toString()}>{point}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className="text-2xl font-bold text-blue-600">{currentTask.storyPoints}</span>
              )}
            </div>

            <Separator />

            {/* Assignee */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">Assignee</span>
              </div>
              {editingTask ? (
                <Select
                  value={editingTask.assignee.name}
                  onValueChange={handleAssigneeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {developers.map(dev => (
                      <SelectItem key={dev.name} value={dev.name}>{dev.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentTask.assignee.avatar} />
                    <AvatarFallback>{currentTask.assignee.initials}</AvatarFallback>
                  </Avatar>
                  <span>{currentTask.assignee.name}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Reporter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">Reporter</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentTask.reporter.avatar} />
                  <AvatarFallback>{currentTask.reporter.initials}</AvatarFallback>
                </Avatar>
                <span>{currentTask.reporter.name}</span>
              </div>
            </div>

            <Separator />

            {/* Engagement */}
            <div className="space-y-2">
              <span className="font-medium">Engagement</span>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLike}
                  className={cn(
                    "flex items-center gap-1",
                    isLiked && "text-red-500"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                  {currentTask.likes}
                </Button>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageCircle className="w-4 h-4" />
                  {comments.length}
                </div>
              </div>
            </div>

            <Separator />

            {/* Dates */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Created</span>
              </div>
              <span className="text-sm text-muted-foreground">{currentTask.createdAt}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
