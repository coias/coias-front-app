/* eslint-disable */
import { Globe, Layer, SkyCoord } from '@stellar-globe/stellar-globe'
import React, { createContext, CSSProperties, forwardRef, ReactNode, RefObject, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"


type LayerKey = object
type LayerInitCallback = (globe: Globe) => () => void


type MakeGlobeContextProps = {
  viewOptions?: NonNullable<ConstructorParameters<typeof Globe>[1]>["viewOptions"]
}


function makeGlobeContext({ viewOptions }: MakeGlobeContextProps) {
  const elRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<Globe>()
  const releaseRequested = useRef(false)
  const [initLayers] = useState((): ((globe: Globe) => [LayerKey, () => void])[] => [])
  const [releaseLayers] = useState(() => new Map<object, () => void>())

  const initGlobe = () => {
    if (elRef.current) {
      if (!globeRef.current) {
        const globe = new Globe(elRef.current, { viewOptions, preserveBuffer: true })
        globeRef.current = globe
      }
      for (const initLayer of initLayers) {
        const [key, releaseLayer] = initLayer(globeRef.current)
        releaseLayers.set(key, releaseLayer)
      }
      initLayers.splice(0)
      sortLayers()
    }
  }

  const sortLayers = () => {
    const globe = globeRef.current!
    globe.layerSorter.setSortFunc(domBasedSortFunc)
  }

  const releaseGlobe = () => {
    releaseRequested.current = false
    globeRef.current!.release()
    globeRef.current = undefined
  }

  const releaseLayer = (key: LayerKey) => {
    // これは Layer.useEffect.release で呼ばれる。
    // Globe.useEffect.release より先に呼ばれる。
    releaseLayers.get(key)!()
    releaseLayers.delete(key)
    if (releaseRequested.current && releaseLayers.size === 0) {
      releaseGlobe()
    }
  }

  const requestReleaseGlobe = () => {
    releaseRequested.current = true
    if (releaseLayers.size === 0) {
      releaseGlobe()
    }
  }

  const registerLayer = (key: LayerKey, initLayer: LayerInitCallback) => {
    initLayers.push(globe => {
      const cleanup = initLayer(globe)
      return [key, cleanup]
    })
    initGlobe()
  }

  useEffect(() => {
    initGlobe()
    return () => requestReleaseGlobe()
  }, [])

  return {
    elRef,
    globeRef,
    registerLayer,
    releaseLayer,
  }
}


export function useOnGlobeInit(initLayer: LayerInitCallback) {
  const { registerLayer, releaseLayer } = assertNonNull(useContext(GlobeContext))
  const [key,] = useState(() => ({}))
  useEffect(() => {
    registerLayer(key, initLayer)
    return () => releaseLayer(key)
  }, [])
}


const GlobeContext = createContext<ReturnType<typeof makeGlobeContext> | undefined>(undefined)


type GlobeProps = {
  children?: ReactNode
  style?: CSSProperties
  retina?: boolean
}


export const StellarGlobe = forwardRef(({ children, style, retina = true }: GlobeProps, ref) => {
  const context = makeGlobeContext({ viewOptions: { retina } })

  useImperativeHandle(ref, () => ({
    globe: () => context.globeRef.current,
  }) as StellarGlobeHandle)

  useEffect(() => {
    if (context.globeRef.current) {
      context.globeRef.current.camera.setRetina(retina)
    }
  }, [retina])

  return (
    <GlobeContext.Provider value={context}>
      <div style={style}>
        <div ref={context.elRef} style={{ height: '100%' }} />
        {children}
      </div>
    </GlobeContext.Provider>
  )
})


export type StellarGlobeHandle = {
  globe: () => Globe
}


export function makePureLayerComponent<Props extends {}, L extends Layer>(factory: (globe: Globe, props: Props) => L) {
  function LayerComponent(props: Props) {
    const { captureLayer, element, layer, layerEffect } = useCaptureLayer()
    useOnGlobeInit(globe => {
      captureLayer(factory(globe, props))
      return () => {
        layer().release()
      }
    })
    layerEffect(layer => {
      layer.release()
      captureLayer(factory(layer.globe, props))
    }, Object.values(props))
    return element
  }
  return React.memo(LayerComponent)
}


function assertNonNull<T>(v: T | undefined): T {
  if (v === undefined) {
    debugger
    throw new Error(`Assert non null Error`)
  }
  return v
}


const layer2dom = new WeakMap<Layer, RefObject<HTMLDivElement>>()


function domBasedSortFunc(a: Layer, b: Layer) {
  const aDom = layer2dom.get(a)?.current
  const bDom = layer2dom.get(b)?.current
  if (aDom && bDom) {
    const mask = aDom.compareDocumentPosition(bDom)
    return (mask & 2) !== 0 ? +1 : (
      (mask & 4) !== 0 ? -1 : 0
    )
  }
  return 0
}


export function useCaptureLayer<L extends Layer>() {
  const elRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<L>()
  const captureLayer = (layer: L) => {
    layerRef.current = layer
    layer2dom.set(layer, elRef)
    layer.globe.addLayer(layer)
    return layer
  }
  const layerEffect = (cb: (layer: L) => void, deps?: unknown[]) => {
    useEffect(() => {
      if (layerRef.current) {
        cb(layerRef.current)
      }
    }, deps)
  }
  const element = <div ref={elRef} />
  return {
    captureLayer,
    element,
    layerEffect,
    layer: () => layerRef.current!,
  }
}


export function useGlobe() {
  const { globeRef } = assertNonNull(useContext(GlobeContext))
  return () => globeRef.current!
}


export function useGlobeReady() {
  const { globeRef } = assertNonNull(useContext(GlobeContext))
  return () => !!globeRef.current
}


export function useGlobeLocation() {
  // TODO: useGlobalLocationが複数回された場合の最適化
  const globe = useGlobe()
  const [location, setLocation] = useState<SkyCoord>(() => globe().camera.center())

  useEffect(() => {
    const off = globe().on('camera-move-end', () => {
      setLocation(globe().camera.center())
    })
    return () => {
      off()
    }
  }, [])

  return location
}


export function GlobeDebug() {
  const style: CSSProperties = {
    position: 'fixed',
    bottom: '1em',
    left: '1em',
    zIndex: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    padding: '0.25em',
    borderRadius: '0.25em'
  }

  const { globeRef } = assertNonNull(useContext(GlobeContext))

  const showLayers = () => {
    const globe = globeRef.current
    if (globe) {
      // @ts-ignore
      console.log(globe.layers.map(l => l.name ?? l.constructor.name).slice(-5))
    }
  }

  return (
    <div style={style}>
      <button onClick={showLayers}>Show Layers</button>
    </div>
  )
}
