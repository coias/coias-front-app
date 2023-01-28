/* eslint-disable */
import { path, V3, V4 } from '@stellar-globe/stellar-globe'
import { useEffect, useRef, useState } from 'react'
import { Path } from './path'


type AreaLayerProps = {
  url: string
  color?: V4
}

function SspOutline({
  url,
  color = [0.25, 0.5, 1, 0.5],
}: AreaLayerProps) {
  const [paths, setPaths] = useState<path.Path[]>([])
  const isMounted = useIsMounted()

  useEffect(() => {
    loadPaths(url, color).then(paths => {
      if (isMounted()) {
        setPaths(paths)
      }
    })
  }, [url])

  return (
    <Path paths={paths} />
  )
}


async function loadPaths(url: string, color: V4): Promise<path.Path[]> {
  console.log(await (await fetch(url)).json())

  const { $any: region }: { $any: V3[][] } = await (await fetch(url)).json().catch(e => [])
  const width = 0.01
  const paths: path.Path[] = []
  for (const piece of region) {
    const p: path.Path = { joint: path.JOINT.MITER, close: true, points: piece.map(v => ({ position: v, color, size: width })) }
    paths.push(p)
  }
  return paths
}


function useIsMounted() {
  const isMounted = useRef(false)
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])
  return () => isMounted.current
}


export { SspOutline }
