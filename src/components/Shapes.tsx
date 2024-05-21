import { KonvaEventObject } from "konva/lib/Node"
import { FC } from "react"
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

const Shapes: FC<ShapesProps> = ({ shapes, tool, onDragEnd, onClick, onTransformEnd }) => {
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
                const activeProps = shape.selected ? { shadowColor: "#5b21b6", shadowBlur: 20, shadowOpacity: 100 } : {}
                // const props = { ...shape, ...common, ...activeProps }
                switch (shape.type) {
                    case ShapeType.TEXT:
                        return <Text key={shape.id} {...shape} {...activeProps} strokeWidth={1} {...common} />
                    case ShapeType.CIRCLE:
                        return <Ellipse key={shape.id} {...shape} {...activeProps} {...common} width={shape.radiusX * 2} height={shape.radiusY * 2} />
                    case ShapeType.RECTANGLE:
                        return <Rect key={shape.id} {...shape} {...activeProps} {...common} />
                    case ShapeType.LINE:
                        return <Line key={shape.id} {...shape} {...activeProps} {...common} x={0} y={0} />
                    default:
                        return null
                }
            })}
        </>
    )
}

export default Shapes
