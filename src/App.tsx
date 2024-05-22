import { KonvaEventObject } from "konva/lib/Node"
import { useEffect, useMemo, useState } from "react"
import { Layer, Rect, Stage, Transformer } from "react-konva"
import { OptionsBar } from "./components/OptionsBar"
import Shapes from "./components/Shapes"
import { ToolBar } from "./components/ToolBar"
import { useMouseArea } from "./hooks/useMouseArea"
import { useScale } from "./hooks/useScale"
import { useTool } from "./hooks/useTool"
import { useTransform } from "./hooks/useTransform"
import { SelectionBox, isShapeInSelection } from "./lib/utils"
import { Shape, Tool } from "./types"

export interface ShapeStyle {
    fill: string
    stroke: string
    strokeWidth: number
    fontSize: number
    cornerRadius: number
    text?: string
    dash: [number, number]
    fontFamily?: string
    fillPattern: boolean
}

function App() {
    const [shapes, setShapes] = useState<Shape[]>([])
    console.log("@shapes", shapes)

    const [defaultStyle, setDefaultStyle] = useState<ShapeStyle>({
        fontFamily: "Virgil",
        fontSize: 54,
        fill: "transparent",
        stroke: "white",
        strokeWidth: 3,
        cornerRadius: 10,
        fillPattern: false,
        dash: [0, 0]
    })

    const { tool, setTool } = useTool()
    const { onClick, onTransformEnd, transformRef } = useTransform({ tool, shapes, setShapes })
    const { onWheel, stagePos, stageScale } = useScale()

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

    const unselectShapes = () => {
        setShapes((p) => p.map((shape) => ({ ...shape, selected: false })))
        transformRef?.current?.nodes([])
    }
    useEffect(unselectShapes, [tool, transformRef])

    const shapeDragEnd = (e: KonvaEventObject<MouseEvent>) => {
        const shapeId = e.target.attrs.id

        setShapes((prev) => prev.map((shape) => (shape.id === shapeId ? { ...shape, x: e.target.x(), y: e.target.y() } : shape)))
    }

    const selectShapesInArea = (selectionBox: SelectionBox) => {
        setShapes((prev) => prev.map((shape) => ({ ...shape, selected: isShapeInSelection(shape, selectionBox) })))
    }

    const { selectedArea, layerPreviewRef, ...onMouseHandlers } = useMouseArea({
        tool,
        style: defaultStyle,
        createShape,
        selectShape,
        selectShapesInArea,
        unselectShapes
    })

    const activeShapes = useMemo(() => shapes.filter((shape) => shape.selected), [shapes])

    return (
        <main className="relative w-full bg-zinc-900">
            <ToolBar activeTool={tool} onChange={(tool: Tool) => setTool(tool)} />
            <OptionsBar
                style={defaultStyle}
                deleteShapes={() => {
                    setShapes((p) => p.filter((shape) => !shape.selected))
                    transformRef?.current?.nodes([])
                }}
                onApplyStyles={(style) => {
                    setDefaultStyle((p) => ({ ...p, ...style }))
                    setShapes((p) => p.map((shape) => (shape.selected ? { ...shape, ...style } : shape)))
                }}
                activeShapes={activeShapes}
            />
            <Stage
                draggable={tool === Tool.GRAB}
                style={{ cursor: tool === Tool.GRAB ? "grab" : "default" }}
                onWheel={onWheel}
                {...onMouseHandlers}
                {...stagePos}
                scale={{ x: stageScale, y: stageScale }}
                width={window.innerWidth}
                height={window.innerHeight}
            >
                <Layer>
                    <Shapes onTransformEnd={onTransformEnd} onClick={onClick} onDragEnd={shapeDragEnd} shapes={shapes} tool={tool} />
                    <Transformer
                        boundBoxFunc={(oldBox, newBox) => {
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
                        ref={transformRef}
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
