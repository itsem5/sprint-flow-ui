
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: {
    id: string;
    ticketId: string;
    title: string;
    description: string;
    type: 'epic' | 'story' | 'task' | 'sub-task' | 'bug' | 'issue';
    status: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    storyPoints: number;
    assignee: {
      name: string;
      initials: string;
      avatar?: string | null;
    };
    reporter: {
      name: string;
      initials: string;
      avatar?: string | null;
    };
    createdAt: string;
    labels: string[];
    onMove?: () => void;
  };
  onClick?: () => void;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

const typeColors = {
  epic: 'bg-purple-100 text-purple-800 border-purple-200',
  story: 'bg-green-100 text-green-800 border-green-200',
  task: 'bg-blue-100 text-blue-800 border-blue-200',
  'sub-task': 'bg-gray-100 text-gray-800 border-gray-200',
  bug: 'bg-red-100 text-red-800 border-red-200',
  issue: 'bg-orange-100 text-orange-800 border-orange-200',
};

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

export function TaskCard({ task, onClick, isDragging, onDragStart }: TaskCardProps) {
  return (
    <Card 
      draggable
      onDragStart={onDragStart}
      className={cn(
        "cursor-pointer hover:shadow-md transition-all duration-200 group",
        isDragging && "opacity-50 transform rotate-2"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className={cn("text-xs", typeColors[task.type])}>
                {task.ticketId}
              </Badge>
              <div className={cn("w-2 h-2 rounded-full", priorityColors[task.priority])} />
            </div>
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{task.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={task.assignee.avatar || undefined} />
              <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {task.storyPoints} pts
            </Badge>
            {task.onMove && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  task.onMove?.();
                }}
              >
                <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.slice(0, 3).map((label, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {label}
              </Badge>
            ))}
            {task.labels.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{task.labels.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{task.createdAt}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{task.reporter.initials}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
