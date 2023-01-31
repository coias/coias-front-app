/* eslint-disable */
import { Globe, GlobePointerEvent, Layer, MousePicker, path, V3, V4, View } from "@stellar-globe/stellar-globe"
import { GlobeStoppablePointerEvent } from "@stellar-globe/stellar-globe/types/globe/pointer_event"
import { mat3, vec3 } from "gl-matrix"



type Polygon = V3[]
type Style = {
  baseColor: V4
  activeColor?: V4
  hoverColor?: V4
}


export type StyledPolygon = {
  polygon: Polygon
  style: Style
}


export class ClicakblePolygonLayer extends Layer {
  private basePathRenderer: path.Renderer
  private activePathRenderer: path.Renderer

  constructor(
    globe: Globe,
    readonly polygons: StyledPolygon[],
    readonly onClick: (objectIndex: number) => void,
    baseLineWidth: number,
    activeLineWidth: number,
  ) {
    super(globe)
    this.basePathRenderer = new path.Renderer(globe.gl)
    this.basePathRenderer.minWidth = baseLineWidth * globe.camera.canvasPixels
    this.basePathRenderer.darkenNarrowLine = false
    this.basePathRenderer.blendMode = path.BlendMode.NORMAL

    this.activePathRenderer = new path.Renderer(globe.gl)
    this.activePathRenderer.darkenNarrowLine = false
    this.activePathRenderer.minWidth = 1.5 * activeLineWidth * globe.camera.canvasPixels
    this.activePathRenderer.blendMode = path.BlendMode.NORMAL

    this.onRelease(() => {
      this.activePathRenderer.release()
      this.basePathRenderer.release()
    })
    this.basePathRenderer.setPaths(polygons.map(o => ({
      close: true,
      joint: path.JOINT.MITER,
      points: o.polygon.map(position => ({ color: o.style.baseColor, position, size: 0 })),
    })))
    this.mousePickers = polygons.map((o, index) => new PolygonMousePicker(this, index, o.polygon))
  }

  render(view: View): void {
    this.basePathRenderer.render(view)
    this.activePathRenderer.render(view)
  }

  private hoverIndices = new Set<number>()
  private activesIndices = new Set<number>()

  /** @internal */
  onEnter(index: number) {
    if (!this.hoverIndices.has(index)) {
      this.hoverIndices.add(index)
      this.refreshActivePath()
    }
  }

  /** @internal */
  onLeave(index: number) {
    if (this.hoverIndices.has(index)) {
      this.hoverIndices.delete(index)
      this.refreshActivePath()
    }
  }

  /** @internal */
  onPointerDown(index: number) {
    if (!this.activesIndices.has(index)) {
      this.activesIndices.add(index)
      this.refreshActivePath()
    }
  }

  /** @internal */
  onPointerUp(index: number) {
    if (this.activesIndices.has(index)) {
      this.activesIndices.delete(index)
      this.refreshActivePath()
    }
  }

  private refreshActivePath() {
    const hoverPath: path.Path[] = Array.from(this.hoverIndices.values()).map(i => {
      const o = this.polygons[i]
      return ({
        close: true,
        joint: path.JOINT.MITER,
        points: o.polygon.map(position => ({
          color: o.style.hoverColor ?? o.style.baseColor,
          size: 0,
          position,
        }))
      })
    })
    const activePath: path.Path[] = Array.from(this.activesIndices.values()).map(i => {
      const o = this.polygons[i]
      return ({
        close: true,
        joint: path.JOINT.MITER,
        points: o.polygon.map(position => ({
          color: o.style.activeColor ?? o.style.hoverColor ?? o.style.baseColor,
          size: 0,
          position,
        }))
      })
    })
    this.activePathRenderer.setPaths([...hoverPath, ...activePath])
    this.globe.requestRefresh()
  }
}


class PolygonMousePicker extends MousePicker {
  constructor(
    readonly layer: ClicakblePolygonLayer,
    readonly index: number,
    readonly polygon: Polygon,
  ) {
    super()
  }

  onEnter(_e: GlobePointerEvent): void {
    this.layer.onEnter(this.index)
  }

  onLeave(_e: GlobePointerEvent): void {
    this.layer.onLeave(this.index)
  }

  onClick(e: GlobeStoppablePointerEvent): void {
    e.stopPropagation()
    this.layer.onClick(this.index)
  }

  onPointerDown(e: GlobeStoppablePointerEvent): void {
    this.layer.onPointerDown(this.index)
  }

  onPointerUp(e: GlobePointerEvent): void {
    this.layer.onPointerUp(this.index)
  }

  hit(e: GlobePointerEvent): { hit: boolean; passThrough: boolean } {
    const hit = checkPolygonIntersectPoint(this.polygon, e.coord.xyz)
    return {
      hit,
      passThrough: true,
    }
  }
}


function checkPolygonIntersectPoint(polygon: Polygon, p: V3): boolean {
  for (let i = 1; i < polygon.length - 1; ++i) {
    const a = polygon[0]
    const b = polygon[i]
    const c = polygon[i + 1]
    if (checkTriangleIntersectPoint(a, b, c, p)) {
      return true
    }
  }
  return false
}


function checkTriangleIntersectPoint(a: V3, b: V3, c: V3, xyz: V3): boolean {
  const m = mat3.fromValues(
    a[0], a[1], a[2],
    b[0], b[1], b[2],
    c[0], c[1], c[2],
  )
  mat3.invert(m, m)
  const v = vec3.transformMat3(vec3.create(), xyz, m)
  return (
    0 <= v[0] && v[0] <= 1 &&
    0 <= v[1] && v[1] <= 1 &&
    0 <= v[2] && v[2] <= 1
  )
}
