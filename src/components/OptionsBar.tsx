import { cn } from "@/lib/utils"
import { CircleSlash2Icon, Trash2Icon } from "lucide-react"
import { ShapeStyle } from "../App"
import { Shape, ShapeType, Text } from "../types"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface ShapeOptionsProps {
    style: ShapeStyle
    onApplyStyles: (styles: Partial<ShapeStyle>) => void
    activeShapes: Shape[]
    deleteShapes: () => void
}

const strokeColors = ["white", "black", "gray", "purple"]
const backgroundColors = [...strokeColors, "transparent"]
const cornerRadius = [0, 10, 20]
const strokeWidth = [1, 3, 5]
const patterns = [false, true]
const dashes: [number, number][] = [
    [0, 0],
    [2, 2],
    [10, 10]
]

const OptionsBar = ({ onApplyStyles, activeShapes, style, deleteShapes }: ShapeOptionsProps) => {
    const textShape = activeShapes.find((shape) => shape.type === ShapeType.TEXT) as Text | undefined

    const options: {
        title: string
        options: ShapeStyle[keyof ShapeStyle][]
        key: keyof ShapeStyle
        type: "color" | "text" | "radius" | "stroke" | "pattern" | "dash"
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
            type: "radius"
        },
        {
            title: "Stroke Width",
            options: strokeWidth,
            key: "strokeWidth",
            type: "stroke"
        },
        {
            title: "Dash",
            options: dashes,
            key: "dash",
            type: "dash"
        },
        {
            title: "Pattern",
            options: patterns,
            key: "fillPattern",
            type: "pattern"
        }
    ]

    return (
        <menu className="absolute left-5 top-24 z-50 flex w-fit flex-col items-center gap-1 rounded-lg bg-gradient-to-t from-zinc-800/50 to-zinc-800 p-4 font-monseratt font-medium">
            <div className="flex flex-col gap-5">
                {options.map((option) => (
                    <div key={option.title} className="flex flex-col items-start">
                        <h4 className="text-sm text-zinc-100">{option.title}</h4>
                        <div className="flex gap-1.5">
                            {option.options.map((opt) => (
                                <Button
                                    className={cn("relative aspect-square bg-zinc-800/70 p-1 text-gray-300 hover:bg-zinc-700/70", {
                                        "bg-violet-400/30 hover:bg-violet-400/30": style[option.key] === opt,
                                        "w-fit p-2": option.type !== "color"
                                    })}
                                    onClick={() => onApplyStyles({ [option.key]: opt })}
                                    key={opt?.toString()}
                                >
                                    {option.type === "color" ? (
                                        opt === "transparent" ? (
                                            <div
                                                style={{ backgroundColor: opt as string }}
                                                className="flex h-6 w-6 items-center justify-center rounded border-gray-100"
                                            >
                                                <CircleSlash2Icon />
                                            </div>
                                        ) : (
                                            <div style={{ backgroundColor: opt as string }} className="h-6 w-6 rounded" />
                                        )
                                    ) : option.type === "dash" && Array.isArray(opt) ? (
                                        <div
                                            className={cn("h-6 w-6 rounded border-2 border-dashed bg-transparent", {
                                                "border-double bg-transparent": opt[0] === 0,
                                                "border-dotted bg-transparent": opt[1] === 2
                                            })}
                                        />
                                    ) : option.type === "pattern" ? (
                                        <div className={cn("h-6 w-6 rounded bg-white", { "bg-hatch-pattern": opt })} />
                                    ) : option.type === "radius" ? (
                                        <div
                                            className={cn(`h-6 w-6 rounded-none border-l-2 border-t-2 bg-zinc-500/60`, {
                                                "rounded-sm": opt === cornerRadius[1],
                                                rounded: opt === cornerRadius[2]
                                            })}
                                        />
                                    ) : option.type === "stroke" ? (
                                        <div
                                            className={cn(`h-1px w-6 rounded-none border-l-2 border-t-2 bg-zinc-500/60`, {
                                                "h-1": opt === strokeWidth[1],
                                                "h-2": opt === strokeWidth[2]
                                            })}
                                        />
                                    ) : (
                                        opt
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {textShape && (
                <>
                    <h4 className="mt-4 w-full text-start text-sm text-zinc-100">Text</h4>
                    <Input className="mt-2 w-full rounded p-2" value={textShape.text} onChange={(e) => onApplyStyles({ text: e.target.value })} />
                    <h4 className="mt-4 w-full text-start text-sm text-zinc-100">Font size</h4>
                    <Input
                        placeholder="Font size"
                        type="number"
                        value={textShape.fontSize}
                        onChange={(e) => onApplyStyles({ fontSize: Number(e.target.value) })}
                        className="mt-2 w-full rounded   p-2"
                        max={150}
                        min={0}
                        step={5}
                    />
                </>
            )}

            {activeShapes.length > 0 && (
                <Button
                    onClick={deleteShapes}
                    className="mr-auto mt-6 flex aspect-square gap-1 bg-violet-400/30 p-1 px-3 text-xs hover:bg-violet-600/30"
                >
                    <Trash2Icon size={18} /> Delete
                </Button>
            )}
        </menu>
    )
}

export { OptionsBar }
