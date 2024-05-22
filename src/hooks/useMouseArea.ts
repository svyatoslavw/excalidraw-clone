import { SelectionBox, getNewSelectAreaSize, getPointerPosition, shapeSize } from "@/lib/utils"
import { CommonStyle, Shape, ShapeType, Tool } from "@/types"
import Konva from "konva"
import { KonvaEventObject } from "konva/lib/Node"
import { useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"

interface MouseAreaProps {
    tool: Tool
    style: CommonStyle
    createShape: (shape: Shape) => void
    selectShape: (shapeId: string) => void
    unselectShapes: () => void
    selectShapesInArea: (SelectionBox: SelectionBox) => void
}

const INITIAL_AREA = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    startX: 0,
    startY: 0,
    visible: false
}

export const useMouseArea = ({ tool, createShape, selectShape, selectShapesInArea, style, unselectShapes }: MouseAreaProps) => {
    const [selectedArea, setSelectedArea] = useState(INITIAL_AREA)

    const layerPreviewRef = useRef<Konva.Layer>(null)
    const shapePreviewRef = useRef<Shape | null>(null)
    const mouseDownRef = useRef(false)
    const shapeDragRef = useRef(false)

    const onMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (tool === Tool.GRAB) return

        mouseDownRef.current = true
        const stage = e.target.getStage()
        const pos = getPointerPosition(stage)

        if (e.target !== stage) {
            const shapeId = e.target.attrs.id
            selectShape(shapeId)
            shapeDragRef.current = true
        } else {
            unselectShapes()
        }

        if (!pos) return

        const shapeId = uuidv4()

        if (tool === Tool.TEXT) {
            const shape: Shape = {
                id: uuidv4(),
                type: ShapeType.TEXT,
                x: pos.x,
                y: pos.y,
                text: "Some Text",
                ...style
            }
            createShape(shape)
        }

        const selectedArea = {
            startX: pos.x,
            startY: pos.y,
            width: 0,
            height: 0,
            visible: true,
            ...style,
            ...pos
        }
        setSelectedArea(selectedArea)

        let newSnape: Shape | null = null

        if (tool === Tool.RECTANGLE) {
            newSnape = {
                id: shapeId,
                type: ShapeType.RECTANGLE,
                ...style,
                ...selectedArea
            }
        }

        if (tool === Tool.CIRCLE) {
            newSnape = {
                id: shapeId,
                type: ShapeType.CIRCLE,
                radiusX: 0,
                radiusY: 0,
                ...style,
                ...selectedArea
            }
        }

        if (tool === Tool.PENCIL) {
            newSnape = {
                id: shapeId,
                type: ShapeType.LINE,
                fill: "transparent",
                fillPattern: false,
                stroke: "white",
                strokeWidth: 2,
                points: [pos.x, pos.y],
                ...pos
            }
        }

        if (!newSnape) return
        shapePreviewRef.current = newSnape

        switch (tool) {
            case Tool.RECTANGLE:
                layerPreviewRef.current?.add(new Konva.Rect(newSnape))
                break
            case Tool.CIRCLE:
                layerPreviewRef.current?.add(new Konva.Ellipse({ ...newSnape, radiusX: 0, radiusY: 0 }))
                break
            case Tool.PENCIL:
                layerPreviewRef.current?.add(new Konva.Line({ ...newSnape, x: 0, y: 0, width: 0, height: 0 }))
                break
            default:
                break
        }
    }

    const onMouseMove = (e: KonvaEventObject<MouseEvent>) => {
        console.log("onMouseMove")

        if (!mouseDownRef.current || shapeDragRef.current) return
        const stage = e.target.getStage()
        const pos = getPointerPosition(stage)
        if (!pos) return

        const { height, width, x, y } = getNewSelectAreaSize(pos, { x: selectedArea.startX, y: selectedArea.startY })

        const rectSelection = shapeSize.getRectSize({ height, width }, { x, y })
        const circleSelection = shapeSize.getEllipseSize({ height, width }, { x, y })

        if (tool === Tool.POINTER) {
            setSelectedArea({ ...selectedArea, ...rectSelection })
            selectShapesInArea(rectSelection)
            return
        }

        const newShape = shapePreviewRef?.current

        const shapeToEdit = layerPreviewRef.current?.findOne(`#${newShape?.id}`)

        if (newShape && tool === Tool.RECTANGLE) {
            shapeToEdit?.setAttrs(rectSelection)
            shapePreviewRef.current = { ...newShape, ...rectSelection }
        }

        if (newShape && tool === Tool.CIRCLE) {
            shapeToEdit?.setAttrs(circleSelection)
            shapePreviewRef.current = { ...newShape, ...circleSelection }
        }

        if (newShape && tool === Tool.PENCIL && newShape.type === ShapeType.LINE) {
            const points = newShape.points.concat([pos.x, pos.y])
            newShape.points = points
            shapeToEdit?.setAttrs({ points })
        }

        layerPreviewRef.current?.batchDraw()
    }

    const onMouseUp = () => {
        mouseDownRef.current = false
        shapeDragRef.current = false
        if (tool !== Tool.POINTER && tool !== Tool.GRAB) {
            const newShape = shapePreviewRef.current
            if (!newShape) return

            const shapeToEdit = layerPreviewRef.current?.findOne(`#${newShape?.id}`)
            shapeToEdit?.destroy()
            layerPreviewRef.current?.batchDraw()
            createShape(newShape)
            shapePreviewRef.current = null
        }
        setSelectedArea(INITIAL_AREA)
    }

    return { selectedArea, layerPreviewRef, onMouseDown, onMouseMove, onMouseUp }
}
