import Konva from "konva"
import { KonvaEventObject } from "konva/lib/Node"
import { useEffect, useMemo, useRef, useState } from "react"
import { Layer, Rect, Stage, Transformer } from "react-konva"
import ShapeOptions from "./components/ShapeOptions"
import Shapes from "./components/Shapes"
import { ToolBar } from "./components/ToolBar"
import { useMouseArea } from "./hooks/useMouseArea"
import { useScale } from "./hooks/useScale"
import { useTool } from "./hooks/useTool"
import { useTransformer } from "./hooks/useTransformer"
import { SelectionBox, isShapeInSelection } from "./lib/utils"
import { Shape, Tool } from "./types"
export interface ShapeStyle {
    fill: string
    stroke: string
    strokeWidth: number
    fontSize: number
    cornerRadius: number
    text?: string
    fontFamily?: string
}
function App() {
    const [shapes, setShapes] = useState<Shape[]>([])
    console.log("@shapes", shapes)

    const [defaultStyle, setDefaultStyle] = useState<ShapeStyle>({
        fill: "transparent",
        stroke: "white",
        strokeWidth: 3,
        fontSize: 54,
        cornerRadius: 10,
        fontFamily: "Virgil"
    })

    const { tool, setTool } = useTool()

    const createShape = (shape: Shape) => {
        setShapes((prev) => [...prev, shape])
    }

    const selectShape = (id: string) => {
        setShapes((prev) =>
            prev.map((shape) => {
                if (shape.id === id) {
                    return { ...shape, selected: !shape.selected }
                }
                return { ...shape, selected: shape.id === id }
            })
        )
    }
    const transformerRef = useRef<Konva.Transformer>(null)

    const unselectShapes = () => {
        setShapes((p) => p.map((shape) => ({ ...shape, selected: false })))
        transformerRef?.current?.nodes([])
    }
    useEffect(unselectShapes, [tool])

    const shapeDragEnd = (e: KonvaEventObject<MouseEvent>) => {
        const shapeId = e.target.attrs.id

        setShapes((prev) => prev.map((shape) => (shape.id === shapeId ? { ...shape, x: e.target.x(), y: e.target.y() } : shape)))
    }

    const selectShapesInArea = (selectionBox: SelectionBox) => {
        setShapes((prev) => prev.map((shape) => ({ ...shape, selected: isShapeInSelection(shape, selectionBox) })))
    }

    const { onWheel, stagePos, stageScale } = useScale()
    const { selectedArea, layerPreviewRef, ...onMouseHandlers } = useMouseArea({
        tool,
        style: defaultStyle,
        createShape,
        selectShape,
        selectShapesInArea,
        unselectShapes
    })
    const { layerRef, stageRef, transformerRef: groupRef } = useTransformer({ shapes })

    function onClick(e: KonvaEventObject<MouseEvent>) {
        if (tool !== Tool.POINTER && !transformerRef) return
        const target = e.currentTarget
        transformerRef.current?.nodes([target])
    }

    const activeShapes = useMemo(() => shapes.filter((shape) => shape.selected), [shapes])

    const handleTransformEnd = (e: KonvaEventObject<Event>) => {
        const nodes = transformerRef.current?.nodes()
        if (!nodes) return

        const updatedShapes = shapes.map((shape: Shape) => {
            const node = nodes.find((n) => n.id() === shape.id)
            if (node) {
                const scaleX = node.scaleX()
                const scaleY = node.scaleY()

                node.scaleX(1)
                node.scaleY(1)

                return {
                    ...shape,
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(node.width() * scaleX),
                    height: Math.max(node.height() * scaleY)
                }
            }
            return shape
        })
        setShapes(updatedShapes)
    }

    // const handleTransform = (e: KonvaEventObject<Event>) => {
    //     const nodes = transformerRef.current?.nodes()
    //     if (!nodes) return

    //     setShapes((prev) =>
    //         prev.map((shape) => {
    //             const node = nodes.find((n) => n.id() === shape.id)
    //             if (node) {
    //                 return {
    //                     ...shape,
    //                     x: node.x(),
    //                     y: node.y(),
    //                     width: node.width() * node.scaleX(),
    //                     height: node.height() * node.scaleY(),
    //                     strokeWidth: shape.strokeWidth
    //                 }
    //             }
    //             return shape
    //         })
    //     )
    // }

    return (
        <main className="relative w-full bg-zinc-900">
            <ToolBar activeTool={tool} onChange={(tool: Tool) => setTool(tool)} />
            <ShapeOptions
                style={defaultStyle}
                deleteShapes={() => {
                    setShapes((p) => p.filter((shape) => !shape.selected))
                    transformerRef?.current?.nodes([])
                }}
                onApplyStyles={(style) => {
                    setDefaultStyle((p) => ({ ...p, ...style }))
                    setShapes((p) => p.map((shape) => (shape.selected ? { ...shape, ...style } : shape)))
                }}
                activeShapes={activeShapes}
            />
            <Stage
                ref={stageRef}
                draggable={tool === Tool.GRAB}
                style={{ cursor: tool === Tool.GRAB ? "grab" : "default" }}
                onWheel={onWheel}
                {...onMouseHandlers}
                {...stagePos}
                scale={{ x: stageScale, y: stageScale }}
                width={window.innerWidth}
                height={window.innerHeight}
            >
                <Layer ref={layerRef}>
                    <Shapes onTransformEnd={handleTransformEnd} onClick={onClick} onDragEnd={shapeDragEnd} shapes={shapes} tool={tool} />
                    <Transformer
                        boundBoxFunc={(oldBox, newBox) => {
                            // limit resize
                            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                                return oldBox
                            }
                            return newBox
                        }}
                        anchorSize={8}
                        keepRatio
                        padding={4}
                        rotateLineVisible={false}
                        flipEnabled={false}
                        anchorFill="#6b21a8"
                        borderStroke="#8b5cf6"
                        borderStrokeWidth={2}
                        anchorStroke="#6b21a8"
                        anchorStrokeWidth={2}
                        anchorCornerRadius={2}
                        ref={transformerRef}
                    />
                </Layer>
                <Layer ref={layerPreviewRef}></Layer>
                <Layer>
                    {selectedArea.visible && (
                        <Rect {...selectedArea} opacity={0.4} fill="#27272a" cornerRadius={0} stroke={"#9333ea"} strokeWidth={2} />
                    )}
                </Layer>
            </Stage>
        </main>
    )
}

export default App
