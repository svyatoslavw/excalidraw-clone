import { cn } from '@/lib/utils';
import { Tool } from '@/types';
import {
  CircleIcon,
  GrabIcon,
  MousePointer2Icon,
  PencilIcon,
  SquareIcon,
  TypeIcon,
} from 'lucide-react';
import { Button } from './ui/button';

interface ToolBarProps {
  activeTool: string;
  onChange: (tool: Tool) => void;
}

const ToolBar = ({ activeTool, onChange }: ToolBarProps) => {
  const options = [
    {
      id: Tool.POINTER,
      Icon: MousePointer2Icon,
    },
    {
      id: Tool.GRAB,
      Icon: GrabIcon,
    },
    {
      id: Tool.RECTANGLE,
      Icon: SquareIcon,
    },
    {
      id: Tool.CIRCLE,
      Icon: CircleIcon,
    },
    {
      id: Tool.TEXT,
      Icon: TypeIcon,
    },
    {
      id: Tool.PENCIL,
      Icon: PencilIcon,
    },
  ];

  return (
    <menu className="flex z-20 items-center absolute p-1 top-5 left-1/2 -translate-x-1/2 w-fit gap-1 rounded-lg bg-gradient-to-t from-zinc-800/50 to-zinc-800">
      {options.map(({id, Icon}, i) => {
        return (
          <Button
            onClick={() => onChange(id)}
            className={cn(
              'bg-transparent aspect-square p-1 relative hover:bg-zinc-700/70 text-gray-300',
              {
                'bg-violet-400/30 hover:bg-violet-400/30':
                id === activeTool,
              }
            )}
            key={id}
          >
            <Icon size={18}  />
            <span className="absolute text-xs right-1 bottom-0">{i + 1}</span>
          </Button>
        );
      })}
    </menu>
  );
};

export { ToolBar };

