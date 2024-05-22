import { Shape, ShapeType, Tool } from "@/types"
import Konva from "konva"
import { KonvaEventObject } from "konva/lib/Node"
import { Dispatch, SetStateAction, useRef } from "react"

interface useTransformProps {
    tool: Tool
    shapes: Shape[]
    setShapes: Dispatch<SetStateAction<Shape[]>>
}

export const useTransform = ({ tool, shapes, setShapes }: useTransformProps) => {
    const transformRef = useRef<Konva.Transformer>(null)

    const onClick = (e: KonvaEventObject<MouseEvent>) => {
        if (tool !== Tool.POINTER && !transformRef) return
        const target = e.currentTarget
        transformRef.current?.nodes([target])
    }

    const onTransformEnd = () => {
        if (!transformRef.current) return

        const nodes = transformRef.current?.nodes()
        if (!nodes) return

        const transformed = shapes.map((shape: Shape) => {
            const node = nodes.find((n) => n.id() === shape.id)
            if (node) {
                const scaleX = node.scaleX()
                const scaleY = node.scaleY()

                node.scaleX(1)
                node.scaleY(1)

                if (shape.type === ShapeType.CIRCLE) {
                    return {
                        ...shape,
                        x: node.x(),
                        y: node.y(),
                        radiusX: Math.max((node.width() / 2) * scaleX),
                        radiusY: Math.max((node.height() / 2) * scaleY)
                    }
                } else if (shape.type === ShapeType.LINE) {
                    return {
                        ...shape,
                        points: shape.points.map((point, index) => {
                            if (index % 2 === 0) {
                                return point * scaleX
                            } else {
                                return point * scaleY
                            }
                        })
                    }
                } else {
                    return {
                        ...shape,
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(node.width() * scaleX),
                        height: Math.max(node.height() * scaleY)
                    }
                }
            }
            return shape
        })

        setShapes(transformed)
    }

    return { transformRef, onClick, onTransformEnd }
}
