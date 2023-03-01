/* eslint-disable */
import { angle, overlayAlpha, path, V3, V4 } from '@stellar-globe/stellar-globe'
import { vec3 } from 'gl-matrix'
import React, { useMemo } from 'react'
import { Path } from "./path"

type EclipticProps = {
  nSteps?: number
  size?: number
  color?: V4
}


const defaultColor: V4 = [1, 0.75, 0, 1.]


export const Ecliptic = React.memo(({
  nSteps = 360,
  size = 0.01,
  color = defaultColor,
}: EclipticProps) => {
  const paths = useMemo<path.Path[]>(() => [
    {
      points: (() => {
        const a: path.Point[] = []
        for (let i = 0; i < nSteps; ++i) {
          const t = 2 * Math.PI * i / nSteps
          const v0: V3 = [Math.cos(t), Math.sin(t), 0]
          const v1 = vec3.rotateX(vec3.create(), v0, [0, 0, 0,], angle.Angle.fromDeg(23.4).rad)
          a.push({ color, size, position: v1 as V3 })
        }
        return a
      })(),
      close: true,
      joint: path.JOINT.MITER,
    }
  ], [nSteps])
  return <Path paths={paths} darkenNarrowLine alphaFunc={overlayAlpha} />
})


Ecliptic.displayName = 'Ecliptic'
