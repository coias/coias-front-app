/* eslint-disable */
/*
 * Tractはとある方法で天球を正方形領域で分割した時の１つの正方形
 * 天の南極から天の北極に向かって採番
 * 同じ赤緯では赤経に沿ってtract番号が増加
 * 参考:
 * https://hsc-release.mtk.nao.ac.jp/rsrc/pdr3/tract_patches/full/tracts_patches_W_autumn_HSC-G.png
 *
 * PatchはTractを10x10の正方形領域で分割した時の１つの正方形
 * Patch番号は `${x},${y}` の２つの整数の組み合わせ
 * yは赤緯の増加とともに増加
 * xは赤経の逆向きに増加
 */
import { angle, V3 } from '@stellar-globe/stellar-globe';
import { mat3, vec3 } from 'gl-matrix';
import React from 'react';
import { ClickablePolygon } from './ClickablePolygon';
import { StyledPolygon } from './ClickablePolygonLayer';
import { RingsTract } from './RingsTract';

const ringsTract = new RingsTract();
const noop = () => {};

type Polygon = V3[];
type Style = StyledPolygon['style'];

type TractProps = {
  tractId: number;
  style: Style;
  baseLineWidth?: number;
  activeLineWidth?: number;
};

export const Tract = React.memo(
  ({ tractId, style, baseLineWidth = 3, activeLineWidth = 3 }: TractProps) => {
    const tract: TractSelectorTract = {
      id: tractId,
      style,
    };
    return (
      <TractSelector
        tracts={[tract]}
        onClick={noop}
        baseLineWidth={baseLineWidth}
        activeLineWidth={activeLineWidth}
      />
    );
  },
);

Tract.displayName = 'Tract';

type PatchProps = {
  tractId: number;
  patchId: string;
  style: Style;
};

export const Patch = React.memo(({ tractId, patchId, style }: PatchProps) => {
  const [j, i] = patchId.split(',').map((s) => Number.parseInt(s)) as [
    number,
    number,
  ];
  const patch: StyledPolygon = {
    polygon: patchPolygon(tractId, [j, i]),
    style,
  };
  return <ClickablePolygon polygons={[patch]} onClick={noop} />;
});

Patch.displayName = 'Patch';

export type TractSelectorTract = {
  id: number;
  style: Style;
};

export type TractSelectorProps = {
  tracts: TractSelectorTract[];
  baseLineWidth?: number;
  activeLineWidth?: number;
  onClick?: (index: number) => void;
};

export const TractSelector = React.memo(
  ({
    tracts,
    baseLineWidth,
    activeLineWidth,
    onClick = noop,
  }: TractSelectorProps) => {
    const polygons = tracts.map(({ id, style }): StyledPolygon => {
      return {
        style,
        polygon: tractId2polygon(id),
      };
    });
    const nativeOnClick = (objectIndex: number) => {
      onClick(tracts[objectIndex].id);
    };
    return (
      <ClickablePolygon
        polygons={polygons}
        onClick={nativeOnClick}
        baseLineWidth={baseLineWidth}
        activeLineWidth={activeLineWidth}
      />
    );
  },
);

TractSelector.displayName = 'TractSelector';

export type PatchSelectorProps = {
  tractId: number;
  defaultStyle: StyledPolygon['style'];
  patchStyle?: { [patchId: string]: Style | undefined };
  validPatchIds: number[][];
  onClick?: (patchId: string) => void;
};

export function patchId({ j, i }: { j: number; i: number }) {
  return `${j},${i}`;
}

export const PatchSelector = React.memo(
  ({
    tractId,
    defaultStyle,
    patchStyle = {},
    validPatchIds,
    onClick = noop,
  }: PatchSelectorProps) => {
    // for (let i = 0; i < nPatchesDec; ++i) {  // 赤緯方向
    //   for (let j = 0; j < nPatchesRA; ++j) {  // 赤経方向
    //   }
    // }
    const polygons: StyledPolygon[] = [];
    validPatchIds.map((validPatchId) => {
      const j = validPatchId[0];
      const i = validPatchId[1];
      polygons.push({
        style: patchStyle[patchId({ j, i })] ?? defaultStyle,
        polygon: patchPolygon(tractId, [j, i]),
      });
    });
    const nativeOnClick = (objectIndex: number) => {
      const j = objectIndex % nPatchesRA;
      const i = Math.floor(objectIndex / nPatchesDec);
      onClick(patchId({ j, i }));
    };
    return <ClickablePolygon polygons={polygons} onClick={nativeOnClick} />;
  },
);

PatchSelector.displayName = 'PatchSelector';

function tractId2polygon(tractId: number): Polygon {
  const [a, d] = ringsTract.index2ad(tractId);
  const m = rotate(a, d);
  const pixelScale = 0.168; // arcsec / pixel
  const tractSize = 31200; // in pixels
  const s = 0.5 * tractSize * angle.deg2rad(pixelScale / 3600); // half tract size
  const v0: V3 = [1, -s, -s];
  const v1: V3 = [1, -s, +s];
  const v2: V3 = [1, +s, +s];
  const v3: V3 = [1, +s, -s];
  return [
    vec3.transformMat3(vec3.create(), v0, m) as V3,
    vec3.transformMat3(vec3.create(), v1, m) as V3,
    vec3.transformMat3(vec3.create(), v2, m) as V3,
    vec3.transformMat3(vec3.create(), v3, m) as V3,
  ];
}

const nPatchesDec = 9;
const nPatchesRA = 9;

function patchPolygon(tractId: number, patchId: [number, number]): Polygon {
  const [j, i] = patchId;
  const [t10, _t11, t01, t00] = tractId2polygon(tractId);
  const y0 = (i + 0.05) / nPatchesDec;
  const y1 = (i + 0.95) / nPatchesDec;
  // t00 + x * (t10 - t00) + y * (t01 - t00)
  // == (1 - x - y) * t00 + x * t10 + y * t01
  const x0 = (j + 0.05) / nPatchesRA;
  const x1 = (j + 0.95) / nPatchesRA;
  const patchCorners = [
    [x0, y0],
    [x1, y0],
    [x1, y1],
    [x0, y1],
  ].map(([x, y]) => {
    const p = vec3.create();
    vec3.scaleAndAdd(p, p, t00, 1 - x - y);
    vec3.scaleAndAdd(p, p, t10, x);
    vec3.scaleAndAdd(p, p, t01, y);
    return p as V3;
  });
  return patchCorners;
}

function rotate(a: number, d: number) {
  const cA = Math.cos(a);
  const sA = Math.sin(a);
  const cD = Math.cos(d);
  const sD = -Math.sin(d);
  return mat3.fromValues(
    cA * cD,
    cD * sA,
    -sD,
    -sA,
    cA,
    0,
    cA * sD,
    sA * sD,
    cD,
  );
}
