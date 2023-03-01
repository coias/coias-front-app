/* eslint-disable */
import { SspTileLayer } from "@stellar-globe/stellar-globe"
import React from "react"
import { useCaptureLayer, useOnGlobeInit } from "./Globe"

type ColorParams = NonNullable<ConstructorParameters<typeof SspTileLayer>[1]["colorParams"]>
type SspDataProps = {
  baseUrl: string
  colorParams?: ColorParams
  lodBias?: number
  clearAllTilesOnParamsChagne?: boolean
  outline?: boolean
}

const defaultParams = SspTileLayer.defaultParams()

export const SspData = React.memo(({
  baseUrl, colorParams = defaultParams, lodBias, clearAllTilesOnParamsChagne = false, outline = true,
}: SspDataProps) => {
  const { captureLayer, element, layer, layerEffect } = useCaptureLayer<SspTileLayer>()
  useOnGlobeInit(globe => {
    captureLayer(new SspTileLayer(globe, { baseUrl, colorParams, outline }))
    return () => {
      layer().release()
    }
  })
  layerEffect(() => {
    layer().setParams(colorParams, { lodBias, clearAll: clearAllTilesOnParamsChagne })
    layer().globe.requestRefresh()
  }, [colorParams])
  return element
})

SspData.displayName = 'SspData'
