/* eslint-disable */
import { Globe, Layer, overlayAlpha, path, View } from '@stellar-globe/stellar-globe'
import { useCaptureLayer, useOnGlobeInit } from './Globe'


class PathLayer extends Layer {
  private r: path.Renderer

  constructor(globe: Globe, public alphaFunc: (view: View) => number, public darkenNarrowLine: boolean) {
    super(globe)
    this.r = new path.Renderer(globe.gl)
    this.onRelease(() => this.r.release())
  }

  setPaths(paths: path.Path[]) {
    this.r.setPaths(paths)
  }

  render(view: View): void {
    const alpha = this.alphaFunc(view)
    this.r.darkenNarrowLine = this.darkenNarrowLine
    this.r.render(view, alpha)
  }
}


type PathProps = {
  paths: path.Path[]
  darkenNarrowLine?: boolean
  alphaFunc?: (view: View) => number
}


function alwaysOne(view: View) {
  return 1
}


export function Path({
  paths,
  alphaFunc,
  darkenNarrowLine = false,
}: PathProps) {
  const { layer, captureLayer, element, layerEffect } = useCaptureLayer<PathLayer>()
  useOnGlobeInit(globe => {
    captureLayer(new PathLayer(globe, alwaysOne, darkenNarrowLine))
    layer().setPaths(paths)
    return () => layer().release()
  })
  layerEffect(layer => {
    layer.setPaths(paths)
  }, [paths])
  layerEffect(layer => {
    layer.darkenNarrowLine = darkenNarrowLine
    layer.globe.requestRefresh()
  }, [darkenNarrowLine])
  layerEffect(layer => {
    if (alphaFunc) {
      layer.alphaFunc = alphaFunc
      layer.globe.requestRefresh()
    }
  }, [alphaFunc])
  return element
}

Path.displayName = 'Path'
