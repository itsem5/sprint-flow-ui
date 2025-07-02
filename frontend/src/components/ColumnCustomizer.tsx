import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, GripVertical, X, Palette } from "lucide-react";
import { KanbanColumn } from "@/types/project";

interface ColumnCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  columns: KanbanColumn[];
  onUpdateColumns: (columns: KanbanColumn[]) => void;
}

const colorOptions = [
  { name: 'Gray', value: 'bg-gray-100', border: 'border-gray-200' },
  { name: 'Blue', value: 'bg-blue-100', border: 'border-blue-200' },
  { name: 'Green', value: 'bg-green-100', border: 'border-green-200' },
  { name: 'Yellow', value: 'bg-yellow-100', border: 'border-yellow-200' },
  { name: 'Purple', value: 'bg-purple-100', border: 'border-purple-200' },
  { name: 'Red', value: 'bg-red-100', border: 'border-red-200' },
  { name: 'Pink', value: 'bg-pink-100', border: 'border-pink-200' },
  { name: 'Indigo', value: 'bg-indigo-100', border: 'border-indigo-200' },
];

export function ColumnCustomizer({ isOpen, onClose, columns, onUpdateColumns }: ColumnCustomizerProps) {
  const [localColumns, setLocalColumns] = useState<KanbanColumn[]>(columns);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    
    const newColumn: KanbanColumn = {
      id: `custom-${Date.now()}`,
      title: newColumnTitle,
      color: 'bg-gray-100',
      order: localColumns.length
    };
    
    setLocalColumns([...localColumns, newColumn]);
    setNewColumnTitle('');
  };

  const removeColumn = (columnId: string) => {
    setLocalColumns(localColumns.filter(col => col.id !== columnId));
  };

  const updateColumnTitle = (columnId: string, title: string) => {
    setLocalColumns(localColumns.map(col => 
      col.id === columnId ? { ...col, title } : col
    ));
  };

  const updateColumnColor = (columnId: string, color: string) => {
    setLocalColumns(localColumns.map(col => 
      col.id === columnId ? { ...col, color } : col
    ));
  };

  const handleSave = () => {
    onUpdateColumns(localColumns);
    onClose();
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    const updatedColumns = [...localColumns];
    const [movedColumn] = updatedColumns.splice(fromIndex, 1);
    updatedColumns.splice(toIndex, 0, movedColumn);
    
    // Update order
    const reorderedColumns = updatedColumns.map((col, index) => ({
      ...col,
      order: index
    }));
    
    setLocalColumns(reorderedColumns);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Kanban Columns</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add New Column */}
          <div className="flex gap-2">
            <Input
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              placeholder="New column title"
              onKeyPress={(e) => e.key === 'Enter' && addColumn()}
            />
            <Button onClick={addColumn} disabled={!newColumnTitle.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Column
            </Button>
          </div>

          {/* Existing Columns */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Current Columns</h3>
            {localColumns.map((column, index) => (
              <div key={column.id} className="flex items-center gap-3 p-4 border rounded-lg">
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                
                <div className="flex-1">
                  <Input
                    value={column.title}
                    onChange={(e) => updateColumnTitle(column.id, e.target.value)}
                    className="font-medium"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <div className="flex gap-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateColumnColor(column.id, color.value)}
                        className={`w-6 h-6 rounded border-2 ${color.value} ${
                          column.color === color.value ? 'ring-2 ring-blue-500' : ''
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <Badge className={column.color}>
                  Preview
                </Badge>

                {localColumns.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColumn(column.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
