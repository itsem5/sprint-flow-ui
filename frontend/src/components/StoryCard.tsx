import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Story } from "@/api/stories/story";
import { User } from "lucide-react";

interface StoryCardProps {
  story: Story;
}

export const StoryCard = ({ story }: StoryCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-semibold text-green-600">{story.name}</span>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {story.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-600 line-clamp-2">{story.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{story.assignee ? `${story.assignee.firstName} ${story.assignee.lastName}` : 'Unassigned'}</span>
          </div>
          <span>{story.dueDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};