/* eslint-disable */
import PropTypes from 'prop-types';

import { StellarGlobe } from './Globe';

StellarGlobe.propTypes = {
  // @ts-ignore
  children: PropTypes.node,
  style: PropTypes.object,
  retina: PropTypes.bool,
};

import { CelestialText, Constellation, HipsSimpleImage } from './layers';

// @ts-ignore
Constellation.propTypes = {
  showLines: PropTypes.bool,
  showNames: PropTypes.bool,
  lang: PropTypes.oneOf(['English', 'Hiragana', 'Kanji']),
};

// @ts-ignore
HipsSimpleImage.propTypes = {
  baseUrl: PropTypes.string.isRequired,
};

function makeVectorValidator({
  size,
  isRequired,
}: {
  size: number;
  isRequired: boolean;
}) {
  return (props: any, propName: string, componentName: string) => {
    const value = props[propName];
    if (isRequired || value === undefined) {
      return null;
    }
    if (
      Array.isArray(value) &&
      value.length === size &&
      value.every((c) => typeof c === 'number')
    ) {
      return null;
    }
    return new Error(
      `invalid prop "${propName}" on ${componentName}. actual value=${JSON.stringify(
        value,
      )}`,
    );
  };
}

const V3Type = makeVectorValidator({ size: 3, isRequired: false });
const V3TypeIsRequired = makeVectorValidator({ size: 3, isRequired: true });
const V4Type = makeVectorValidator({ size: 4, isRequired: false });
const V4TypeIsRequired = makeVectorValidator({ size: 4, isRequired: true });

const BillboardTextType = PropTypes.shape({
  text: PropTypes.string.isRequired,
  position: V3TypeIsRequired,
  font: PropTypes.string,
  color: PropTypes.string,
});

// @ts-ignore
CelestialText.propTypes = {
  billboardTexts: PropTypes.arrayOf(BillboardTextType).isRequired,
  defaultFont: PropTypes.string.isRequired,
  defaultColor: PropTypes.string.isRequired,
  alpha: PropTypes.number,
};

import { Path } from './path';

const PointType = PropTypes.shape({
  position: V3TypeIsRequired,
  color: V4TypeIsRequired,
  size: PropTypes.number.isRequired,
});

const PathType = PropTypes.shape({
  points: PropTypes.arrayOf(PointType).isRequired,
  close: PropTypes.bool.isRequired,
  joint: PropTypes.oneOf([0, 1]).isRequired,
});

// @ts-ignore
Path.propTypes = {
  paths: PropTypes.arrayOf(PathType).isRequired,
  darkenNarrowLine: PropTypes.bool,
  alphaFunc: PropTypes.func,
};

import { Patch, PatchSelector, Tract, TractSelector } from './TractPatch';

const PolygonType = PropTypes.arrayOf(V3TypeIsRequired);

const StyleType = PropTypes.shape({
  baseColor: V4TypeIsRequired,
  activeColor: V4Type,
  hoverColor: V4Type,
});

// @ts-ignore
Tract.propTypes = {
  tractId: PropTypes.number.isRequired,
  style: StyleType.isRequired,
  baseLineWidth: PropTypes.number,
  activeLineWidth: PropTypes.number,
};

// @ts-ignore
Patch.propTypes = {
  tractId: PropTypes.number.isRequired,
  patchId: PropTypes.number.isRequired,
  style: StyleType.isRequired,
};

const TractSelectorTract = PropTypes.shape({
  id: PropTypes.number.isRequired,
  style: StyleType.isRequired,
});

// @ts-ignore
TractSelector.propTypes = {
  tracts: PropTypes.arrayOf(TractSelectorTract).isRequired,
  baseLineWidth: PropTypes.number,
  activeLineWidth: PropTypes.number,
  onClick: PropTypes.func,
};

// @ts-ignore
PatchSelector.propTypes = {
  tractId: PropTypes.number.isRequired,
  defaultStyle: StyleType.isRequired,
  patchStyle: PropTypes.objectOf(StyleType),
  validPatchIds: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.number).isRequired,
  ).isRequired,
  onClick: PropTypes.func,
};

import { SspData } from './SspData';

// @ts-ignore
SspData.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  colorParams: PropTypes.object,
  lodBias: PropTypes.number,
  clearAllTilesOnParamsChagne: PropTypes.bool,
  outline: PropTypes.bool,
};

import { SspOutline } from './SspOutline';

// @ts-ignore
SspOutline.propTypes = {
  url: PropTypes.string.isRequired,
  color: V4Type,
};

import { Ecliptic } from './Ecliptic';

// @ts-ignore
Ecliptic.propTypes = {
  nSteps: PropTypes.number,
  size: PropTypes.number,
  color: V4Type,
};

import { ClickablePolygon } from './ClickablePolygon';

const StyledPolygonType = PropTypes.shape({
  polygon: PolygonType.isRequired,
  style: StyleType.isRequired,
});

// @ts-ignore
ClickablePolygon.propTypes = {
  polygons: PropTypes.arrayOf(StyledPolygonType).isRequired,
  onClick: PropTypes.func,
  baseLineWidth: PropTypes.number,
  activeLineWidth: PropTypes.number,
};
