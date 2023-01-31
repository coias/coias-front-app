/* eslint-disable */

import { BeautifulObjectLayer, BillboardText, ConstellationLayer, EsoMilkyWayLayer, Globe, GridLayer, HipparcosCatalogLayer, hips, TextLayer } from "@stellar-globe/stellar-globe"
import { createElement, Fragment } from "react"
import { makePureLayerComponent } from "./Globe"



type LayerProps<T> = NonNullable<T extends new (globe: Globe, props: infer R) => unknown ? R : never>
export const Constellation = makePureLayerComponent((globe, props: LayerProps<typeof ConstellationLayer>) => new ConstellationLayer(globe, props))
Constellation.displayName = 'Constellation'

export const HipparcosCatalog = makePureLayerComponent(globe => new HipparcosCatalogLayer(globe))
HipparcosCatalog.displayName = 'HipparcosCatalog'

export const EsoMilkyWay = makePureLayerComponent(globe => new EsoMilkyWayLayer(globe))
EsoMilkyWay.displayName = 'EsoMilkyWay'

export const Grid = makePureLayerComponent(globe => new GridLayer(globe))
Grid.displayName = 'Grid'

export const HipsSimpleImage = makePureLayerComponent((globe, _: { baseUrl: string }) => new hips.SimpleImageLayer(globe, _.baseUrl))
HipsSimpleImage.displayName = 'HipsSimpleImage'

type BeautifulObjectWhich = ConstructorParameters<typeof BeautifulObjectLayer>[1]
const BeautifulObject = makePureLayerComponent((globe, { which }: { which: BeautifulObjectWhich }) => new BeautifulObjectLayer(globe, which))
BeautifulObject.displayName = 'BeautifulObject'
export function PrettyPictures() {
  return createElement(Fragment, null,
    createElement(BeautifulObject, { which: 'm31' }),
    createElement(BeautifulObject, { which: 'm42' }),
    createElement(BeautifulObject, { which: 'm45' }),
    createElement(BeautifulObject, { which: "m101" }),
    createElement(BeautifulObject, { which: "perseus" }),
  )
}


export type CelestialTextProps = {
  billboardTexts: BillboardText[],
  defaultFont: string
  defaultColor: string
  alpha?: number
}

export const CelestialText = makePureLayerComponent<CelestialTextProps, TextLayer>(
  (globe, {
    billboardTexts,
    defaultFont,
    defaultColor,
    alpha = 1,
  }: CelestialTextProps) =>
    new TextLayer(globe,
      billboardTexts,
      defaultFont,
      defaultColor,
      alpha,
    )
)

CelestialText.displayName = 'CelestialText'
