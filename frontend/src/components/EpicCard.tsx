import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Epic } from "@/api/epics/epic";
import { User } from "lucide-react";

interface EpicCardProps {
  epic: Epic;
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const EpicCard = ({ epic }: EpicCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-semibold text-purple-600">{epic.name}</span>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {epic.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2">{epic.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{epic.assigneeUser ? `${epic.assigneeUser.firstName} ${epic.assigneeUser.lastName}` : 'Unassigned'}</span>
          </div>
          <span>{epic.dueDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};