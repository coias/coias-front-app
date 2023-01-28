/* eslint-disable */
import { V3, V4 } from "@stellar-globe/stellar-globe"
import { ClicakblePolygonLayer } from './ClickablePolygonLayer'
import { makePureLayerComponent } from "./Globe"


type Polygon = V3[]

type Style = {
  baseColor: V4
  activeColor?: V4
  hoverColor?: V4
  lineWidth?: number
}


type ClickablePolygonProps = {
  style: Style
  polygons: Polygon[]
  onClick: (index: number) => void
}


export const ClickablePolygon = makePureLayerComponent(
  (globe, { style, polygons, onClick }: ClickablePolygonProps) =>
    new ClicakblePolygonLayer(globe, polygons, style, onClick)
)
