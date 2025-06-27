
import { Task } from '@/types/project';

export const generateTicketId = (type: Task['type'], counter: number): string => {
  const prefix = type.toUpperCase().replace('-', '');
  return `${prefix}-${counter.toString().padStart(3, '0')}`;
};

export const parseTicketId = (ticketId: string): { type: string; number: number } => {
  const [type, numberStr] = ticketId.split('-');
  return {
    type: type.toLowerCase(),
    number: parseInt(numberStr, 10)
  };
};

export const getTicketTypeColor = (type: Task['type']): string => {
  const colors = {
    epic: 'bg-purple-100 text-purple-800 border-purple-200',
    story: 'bg-green-100 text-green-800 border-green-200',
    task: 'bg-blue-100 text-blue-800 border-blue-200',
    'sub-task': 'bg-gray-100 text-gray-800 border-gray-200',
    bug: 'bg-red-100 text-red-800 border-red-200',
    issue: 'bg-orange-100 text-orange-800 border-orange-200',
  };
  return colors[type] || colors.task;
};
