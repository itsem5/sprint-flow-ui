
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MessageCircle, Heart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'epic' | 'story' | 'task' | 'sub-task';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  storyPoints: number;
  assignee: {
    name: string;
    avatar?: string;
    initials: string;
  };
  reporter: {
    name: string;
    avatar?: string;
    initials: string;
  };
  likes: number;
  comments: number;
  createdAt: string;
  dueDate?: string;
  labels: string[];
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  isDragging?: boolean;
}

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

export function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4",
        isDragging && "opacity-50 transform rotate-2",
        `border-l-${priorityColors[task.priority]}`
      )}
      onClick={onClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={typeColors[task.type]}>
              {task.type.toUpperCase()}
            </Badge>
            <div className={cn("w-2 h-2 rounded-full", priorityColors[task.priority])} />
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-3 h-3" />
            {task.storyPoints}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm leading-5 mb-1">{task.title}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        </div>

        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.map((label) => (
              <Badge key={label} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={task.assignee.avatar} />
              <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {task.likes}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {task.comments}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
