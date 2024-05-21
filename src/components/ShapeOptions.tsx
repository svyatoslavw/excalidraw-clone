import { cn } from "@/lib/utils"
import { CircleSlash2Icon, Trash2Icon } from "lucide-react"
import { FC } from "react"
import { ShapeStyle } from "../App"
import { Shape, ShapeType, Text } from "../types"
import { Button } from "./ui/button"

interface ShapeOptionsProps {
    style: ShapeStyle
    onApplyStyles: (styles: Partial<ShapeStyle>) => void
    activeShapes: Shape[]
    deleteShapes: () => void
}

const strokeColors = ["white", "red", "black", "blue"]
const backgroundColors = [...strokeColors, "transparent"]
const cornerRadius = [0, 5, 10, 15, 20]

const ShapeOptions: FC<ShapeOptionsProps> = ({ onApplyStyles, activeShapes, style, deleteShapes }) => {
    const textShape = activeShapes.find((shape) => shape.type === ShapeType.TEXT) as Text | undefined

    const options: {
        title: string
        options: ShapeStyle[keyof ShapeStyle][]
        key: keyof ShapeStyle
        type: "color" | "text"
    }[] = [
        {
            title: "Background",
            options: backgroundColors,
            key: "fill",
            type: "color"
        },
        {
            title: "Stroke",
            options: strokeColors,
            key: "stroke",
            type: "color"
        },
        {
            title: "Corner radius",
            options: cornerRadius,
            key: "cornerRadius",
            type: "text"
        }
    ]

    return (
        <menu className="font-monseratt absolute left-5 top-24 z-20 flex w-fit flex-col items-center gap-1 rounded-lg bg-zinc-800/40 p-4 font-medium">
            <div className="flex flex-col gap-5">
                {options.map((option) => (
                    <div key={option.title} className="flex flex-col items-start">
                        <h4 className="text-sm text-zinc-100">{option.title}</h4>
                        <div className="flex gap-1">
                            {option.options.map((opt) => {
                                return (
                                    <Button
                                        className={cn("relative aspect-square bg-transparent p-1 text-gray-300 hover:bg-zinc-700/70", {
                                            "bg-violet-400/30 hover:bg-violet-400/30": style[option.key] === opt,
                                            "w-fit p-2": option.type !== "color"
                                        })}
                                        onClick={() => onApplyStyles({ [option.key]: opt })}
                                        key={opt}
                                    >
                                        {option.type === "color" ? (
                                            opt === "transparent" ? (
                                                <div
                                                    style={{ backgroundColor: opt as string }}
                                                    className="flex h-7 w-7 items-center justify-center rounded border-gray-100"
                                                >
                                                    <CircleSlash2Icon />
                                                </div>
                                            ) : (
                                                <div style={{ backgroundColor: opt as string }} className="border-3 h-7 w-7 rounded " />
                                            )
                                        ) : (
                                            opt
                                        )}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {textShape && (
                <>
                    <h4 className="mt-4 w-full text-start text-sm text-zinc-100">Text</h4>
                    <input className="mt-2 w-full rounded p-2" value={textShape.text} onChange={(e) => onApplyStyles({ text: e.target.value })} />
                    <h4 className="mt-4 w-full text-start text-sm text-zinc-100">Font size</h4>
                    <input
                        type="number"
                        value={textShape.fontSize}
                        onChange={(e) => onApplyStyles({ fontSize: Number(e.target.value) })}
                        className="mt-2 w-full rounded p-2"
                        max={100}
                        min={0}
                        step={5}
                    />
                </>
            )}

            {activeShapes.length > 0 && (
                <Button onClick={deleteShapes} className="mr-auto mt-6 aspect-square bg-violet-400/30 p-1 hover:bg-red-600">
                    <Trash2Icon size={20} />
                </Button>
            )}
        </menu>
    )
}

export default ShapeOptions
