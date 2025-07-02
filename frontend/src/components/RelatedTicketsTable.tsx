
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, ExternalLink } from "lucide-react";
import { TaskWithDetails } from "@/hooks/useStaticData";
import { getTicketTypeColor } from "@/utils/ticketUtils";
import { cn } from "@/lib/utils";

interface RelatedTicketsTableProps {
  tickets: TaskWithDetails[];
  title: string;
  onCreateNew?: () => void;
  onTicketClick?: (ticket: TaskWithDetails) => void;
  createButtonText?: string;
}

const statusColors = {
  'todo': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'review': 'bg-yellow-100 text-yellow-800',
  'done': 'bg-green-100 text-green-800',
};

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

export function RelatedTicketsTable({ 
  tickets, 
  title, 
  onCreateNew, 
  onTicketClick,
  createButtonText = "Create" 
}: RelatedTicketsTableProps) {
  if (tickets.length === 0 && !onCreateNew) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title} ({tickets.length})</h3>
        {onCreateNew && (
          <Button onClick={onCreateNew} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {createButtonText}
          </Button>
        )}
      </div>

      {tickets.length > 0 ? (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Story Points</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={cn("text-xs", getTicketTypeColor(ticket.type))}>
                        {ticket.ticketId}
                      </Badge>
                      <div className={cn("w-2 h-2 rounded-full", priorityColors[ticket.priority])} />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{ticket.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn("text-xs", statusColors[ticket.status])}>
                      {ticket.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm capitalize">{ticket.priority}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={ticket.assignee.avatar} />
                        <AvatarFallback className="text-xs">{ticket.assignee.initials}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{ticket.assignee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {ticket.storyPoints} pts
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {onTicketClick && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTicketClick(ticket)}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-lg">
          <p className="text-sm">No {title.toLowerCase()} yet</p>
          {onCreateNew && (
            <Button variant="ghost" size="sm" onClick={onCreateNew} className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Create first {createButtonText.toLowerCase()}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
