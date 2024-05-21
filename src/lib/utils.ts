import { Placement2D, Shape, Size } from "@/types"
import { clsx, type ClassValue } from "clsx"
import Konva from "konva"
import { twMerge } from "tailwind-merge"

export type SelectionBox = Placement2D & Size

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getPointerPosition(node: Konva.Stage | null) {
    if (!node) return null

    const transform = node.getAbsoluteTransform().copy()
    transform.invert()
    const pos = node.getStage().getPointerPosition()

    if (!pos) return null

    return transform.point(pos)
}

export function getNewSelectAreaSize(start: Placement2D, end: Placement2D) {
    const width = Math.abs(start.x - end.x)
    const height = Math.abs(start.y - end.y)
    const x = (start.x + end.x) / 2
    const y = (start.y + end.y) / 2

    return { width, height, x, y }
}

export const shapeSize = {
    getRectSize: ({ height, width }: Size, { x, y }: Placement2D) => ({
        width,
        height,
        x: x - width / 2,
        y: y - height / 2
    }),
    getEllipseSize: ({ height, width }: Size, { x, y }: Placement2D) => ({
        radiusX: width / 2,
        radiusY: height / 2,
        x,
        y
    })
}

export function isShapeInSelection(shape: Shape, selectionBox: SelectionBox) {
    return (
        shape.x >= selectionBox.x &&
        shape.x <= selectionBox.x + selectionBox.width &&
        shape.y >= selectionBox.y &&
        shape.y <= selectionBox.y + selectionBox.height
    )
}
