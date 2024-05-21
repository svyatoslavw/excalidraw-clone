import { KonvaEventObject } from "konva/lib/Node"
import { useCallback, useState } from "react"

export const getLimitedScale = (currScale: number, min: number, max: number) => Math.max(min, Math.min(max, currScale))

const SCALE_SPEED = 1.1

export const useScale = () => {
    const [scaleBorders] = useState({ min: 0.1, max: 1 })
    const [stagePos, setStagePos] = useState({ x: 0, y: 0 })
    const [stageScale, setStageScale] = useState<number>(1)

    const onWheel = useCallback(
        (e: KonvaEventObject<MouseEvent>) => {
            e.evt.preventDefault()
            const stage = e.target.getStage()
            if (!stage) return
            const oldScale = stage.scaleX()

            const pointerPosition = stage?.getPointerPosition()
            if (!pointerPosition) return

            const mousePointTo = {
                x: (pointerPosition.x - stage.x()) / oldScale,
                y: (pointerPosition.y - stage.y()) / oldScale
            }

            const newScale = e.evt.deltaY < 0 ? oldScale * SCALE_SPEED : oldScale / SCALE_SPEED

            const finalScale = getLimitedScale(newScale, scaleBorders.min, scaleBorders.max)

            setStageScale(finalScale)
            setStagePos({
                x: pointerPosition.x - mousePointTo.x * finalScale,
                y: pointerPosition.y - mousePointTo.y * finalScale
            })
        },
        [scaleBorders.max, scaleBorders.min]
    )

    return { stagePos, stageScale, onWheel }
}
