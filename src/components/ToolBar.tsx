import { cn } from "@/lib/utils"
import { Tool } from "@/types"
import { CircleIcon, GrabIcon, MousePointer2Icon, PencilIcon, SquareIcon, TypeIcon } from "lucide-react"
import { Button } from "./ui/button"

interface ToolBarProps {
    activeTool: string
    onChange: (tool: Tool) => void
}

const ToolBar = ({ activeTool, onChange }: ToolBarProps) => {
    const options = [
        {
            id: Tool.POINTER,
            Icon: MousePointer2Icon
        },
        {
            id: Tool.GRAB,
            Icon: GrabIcon
        },
        {
            id: Tool.RECTANGLE,
            Icon: SquareIcon
        },
        {
            id: Tool.CIRCLE,
            Icon: CircleIcon
        },
        {
            id: Tool.TEXT,
            Icon: TypeIcon
        },
        {
            id: Tool.PENCIL,
            Icon: PencilIcon
        }
    ]

    return (
        <menu className="absolute left-1/2 top-5 z-20 flex w-fit -translate-x-1/2 items-center gap-1 rounded-lg bg-gradient-to-t from-zinc-800/50 to-zinc-800 p-1">
            {options.map(({ id, Icon }, i) => {
                return (
                    <Button
                        onClick={() => onChange(id)}
                        className={cn("relative aspect-square bg-transparent p-1 text-gray-300 hover:bg-zinc-700/70", {
                            "bg-violet-400/30 hover:bg-violet-400/30": id === activeTool
                        })}
                        key={id}
                    >
                        <Icon size={18} />
                        <span className="absolute bottom-0 right-1 text-xs">{i + 1}</span>
                    </Button>
                )
            })}
        </menu>
    )
}

export { ToolBar }
