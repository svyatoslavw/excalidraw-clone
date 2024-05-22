import Konva from "konva"
import { KonvaEventObject } from "konva/lib/Node"
import { FC, useEffect, useState } from "react"
import { Ellipse, Line, Rect, Text } from "react-konva"
import { Shape, ShapeType, Tool } from "../types"

interface ShapesProps {
    shapes: Shape[]
    tool: Tool
    onDragEnd: (e: KonvaEventObject<MouseEvent>) => void
    onClick: (e: KonvaEventObject<MouseEvent>) => void
    onTransformEnd: (e: KonvaEventObject<MouseEvent>) => void
    //onTransform: (e: KonvaEventObject<MouseEvent>) => void
}
const createPattern = () => {
    const size = 22
    const stage = new Konva.Stage({
        width: size,
        height: size,
        container: document.createElement("div")
    })

    const layer = new Konva.Layer({
        perfectDrawEnabled: false
    })
    stage.add(layer)

    const line = new Konva.Line({
        points: [0, size, size, 0],
        stroke: "white",
        strokeWidth: 1,
        lineCap: "butt",
        lineJoin: "miter"
    })

    layer.add(line)
    layer.draw()

    const img = new Image()
    img.src = stage.toDataURL({ pixelRatio: 1 })

    return img
}

const Shapes: FC<ShapesProps> = ({ shapes, tool, onDragEnd, onClick, onTransformEnd }) => {
    const [patternImage, setPatternImage] = useState<HTMLImageElement | null>(null)

    useEffect(() => {
        const pattern = createPattern()
        setPatternImage(pattern)
    }, [])

    const common = {
        onDragEnd,
        onClick,
        //onTransform,
        onTransformEnd,
        draggable: tool === Tool.POINTER,
        onMouseOver: (e: KonvaEventObject<MouseEvent>) => {
            const stage = e.target.getStage()
            if (stage) {
                stage.container().style.cursor = "move"
            }
        },
        onMouseLeave: (e: KonvaEventObject<MouseEvent>) => {
            const stage = e.target.getStage()
            if (stage) {
                stage.container().style.cursor = tool === Tool.GRAB ? "grab" : "default"
            }
        }
    }

    return (
        <>
            {shapes.map((shape) => {
                const fill = shape.fillPattern ? { fillPatternImage: patternImage as HTMLImageElement, fillPriority: "pattern" } : {}
                const activeProps = shape.selected ? { shadowColor: "#5b21b6", shadowBlur: 20, shadowOpacity: 100 } : {}
                switch (shape.type) {
                    case ShapeType.TEXT:
                        return <Text key={shape.id} {...fill} {...shape} {...activeProps} strokeWidth={1} {...common} />
                    case ShapeType.CIRCLE:
                        return (
                            <Ellipse
                                key={shape.id}
                                {...fill}
                                {...shape}
                                {...activeProps}
                                {...common}
                                width={shape.radiusX * 2}
                                height={shape.radiusY * 2}
                            />
                        )
                    case ShapeType.RECTANGLE:
                        return <Rect key={shape.id} {...fill} {...shape} {...activeProps} {...common} />
                    case ShapeType.LINE:
                        return <Line key={shape.id} {...fill} {...shape} {...activeProps} {...common} x={0} y={0} />
                    default:
                        return null
                }
            })}
        </>
    )
}

export default Shapes
