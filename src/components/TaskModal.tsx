import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Clock, User, Calendar, Tag, Paperclip, Upload, X } from "lucide-react";
import { TaskWithDetails, User as UserType, Attachment } from "@/hooks/useStaticData";
import { cn } from "@/lib/utils";
import { useStaticData } from "@/hooks/useStaticData";
import { RelatedTicketsTable } from "@/components/RelatedTicketsTable";
import { getTicketTypeColor } from "@/utils/ticketUtils";

interface TaskModalProps {
  task: TaskWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (task: TaskWithDetails) => void;
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
  const [editingTask, setEditingTask] = useState<TaskWithDetails | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>(task?.attachments || []);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateSubTaskModalOpen, setIsCreateSubTaskModalOpen] = useState(false);
  const [isCreateBugModalOpen, setIsCreateBugModalOpen] = useState(false);
  const data = useStaticData();

  if (!task) return null;

  const currentTask = editingTask || task;

  const handleSave = () => {
    if (editingTask) {
      onUpdate({ ...editingTask, attachments });
      setEditingTask(null);
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
    setAttachments(task.attachments);
  };

  const handleEdit = () => {
    setEditingTask({ ...task });
    setAttachments(task.attachments);
  };

  const handleFieldChange = (field: keyof TaskWithDetails, value: any) => {
    if (editingTask) {
      setEditingTask({ ...editingTask, [field]: value });
    }
  };

  const handleAssigneeChange = (newAssigneeId: string) => {
    const assignee = data?.users.find(user => user.id === newAssigneeId);
    if (assignee && editingTask) {
      setEditingTask({ ...editingTask, assignee });
    }
  };

  const handleReporterChange = (newReporterId: string) => {
    const reporter = data?.users.find(user => user.id === newReporterId);
    if (reporter && editingTask) {
      setEditingTask({ ...editingTask, reporter });
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const newAttachment: Attachment = {
          id: `attachment-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'current-user'
        };
        setAttachments(prev => [...prev, newAttachment]);
      });
    }
  };

  const removeAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get related tickets (tasks under story, subtasks/bugs under task)
  const getRelatedTasks = () => {
    if (!data?.tasks) return [];
    
    if (currentTask.type === 'story') {
      return data.tasks.filter(t => t.storyId === currentTask.id);
    } else if (currentTask.type === 'task') {
      return data.tasks.filter(t => t.parentTaskId === currentTask.id);
    }
    return [];
  };

  const relatedTasks = getRelatedTasks();

  const handleCreateTask = () => {
    setIsCreateTaskModalOpen(true);
  };

  const handleCreateSubTask = () => {
    setIsCreateSubTaskModalOpen(true);
  };

  const handleCreateBug = () => {
    setIsCreateBugModalOpen(true);
  };

  const handleRelatedTicketClick = (ticket: TaskWithDetails) => {
    onUpdate(ticket);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className={getTicketTypeColor(currentTask.type)}>
                {currentTask.ticketId}
              </Badge>
              <DialogTitle className="text-2xl font-bold">{currentTask.name}</DialogTitle>
            </div>
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
                  value={editingTask.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="text-xl font-semibold"
                />
              ) : (
                <h2 className="text-xl font-semibold">{currentTask.name}</h2>
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

            {/* Related Tasks/Subtasks Section */}
            {(currentTask.type === 'story' || currentTask.type === 'task') && (
              <>
                <RelatedTicketsTable
                  tickets={relatedTasks}
                  title={currentTask.type === 'story' ? 'Tasks' : 'Sub-tasks & Bugs'}
                  onCreateNew={currentTask.type === 'story' ? handleCreateTask : handleCreateSubTask}
                  onTicketClick={handleRelatedTicketClick}
                  createButtonText={currentTask.type === 'story' ? 'Create Task' : 'Create Sub-task'}
                />
                
                {currentTask.type === 'task' && (
                  <div className="flex gap-2">
                    <Button onClick={handleCreateBug} variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Report Bug
                    </Button>
                  </div>
                )}
                
                <Separator />
              </>
            )}

            {/* Attachments Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Attachments ({attachments.length})</h3>
                {editingTask && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                )}
              </div>

              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />

              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {editingTask && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
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
                <Badge variant="secondary" className={getTicketTypeColor(currentTask.type)}>
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
                  value={editingTask.assignee.id}
                  onValueChange={handleAssigneeChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.users.map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
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
              {editingTask ? (
                <Select
                  value={editingTask.reporter.id}
                  onValueChange={handleReporterChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.users.map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentTask.reporter.avatar} />
                    <AvatarFallback>{currentTask.reporter.initials}</AvatarFallback>
                  </Avatar>
                  <span>{currentTask.reporter.name}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Dates */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Created</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(currentTask.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
