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
import { angle, V3, V4 } from '@stellar-globe/stellar-globe';
import { mat3, vec3 } from 'gl-matrix';
import React from 'react';
import { ClickablePolygon } from './ClickablePolygon';
import { RingsTract } from './RingsTract';

const ringsTract = new RingsTract();
const noop = () => {};

type Polygon = V3[];
type Style = Parameters<typeof ClickablePolygon>[0]['style'];

type TractProps = {
  tractId: number;
  color?: V4;
};

export const Tract = React.memo(({ tractId, color }: TractProps) => {
  const style: Style = {
    baseColor: color ?? [1, 1, 1, 1],
  };
  return <TractSelector tractIds={[tractId]} onClick={noop} style={style} />;
});

type PatchProps = {
  tractId: number;
  patchId: string;
  color?: V4;
};

export const Patch = React.memo(({ tractId, patchId, color }: PatchProps) => {
  const [j, i] = patchId.split(',').map((s) => Number.parseInt(s)) as [
    number,
    number,
  ];
  const polygons = [patchPolygon(tractId, [j, i])];
  const style: Style = {
    baseColor: color ?? [1, 0, 0, 1],
  };
  return <ClickablePolygon polygons={polygons} onClick={noop} style={style} />;
});

type TractSelectorProps = {
  tractIds: number[];
  style: Style;
  onClick?: (index: number) => void;
};

export const TractSelector = React.memo(
  ({ tractIds, style, onClick = noop }: TractSelectorProps) => {
    const polygons = tractIds.map(tractId2polygon);
    const nativeOnClick = (polygonIndex: number) => {
      onClick(tractIds[polygonIndex]);
    };
    return (
      <ClickablePolygon
        polygons={polygons}
        style={style}
        onClick={nativeOnClick}
      />
    );
  },
);

type PatchSelectorProps = {
  tractId: number;
  style: Parameters<typeof ClickablePolygon>[0]['style'];
  validPatchIds: number[][];
  onClick?: (patchId: string) => void;
};

export const PatchSelector = React.memo(
  ({ tractId, style, validPatchIds, onClick = noop }: PatchSelectorProps) => {
    const polygons = tractId2patchPolygons(tractId, validPatchIds);
    const nativeOnClick = (polygonIndex: number) => {
      const j = polygonIndex % nPatchesRA;
      const i = Math.floor(polygonIndex / nPatchesDec);
      onClick(`${j},${i}`);
    };
    return (
      <ClickablePolygon
        polygons={polygons}
        style={style}
        onClick={nativeOnClick}
      />
    );
  },
);

function tractId2polygon(tractId: number): Polygon {
  const [a, d] = ringsTract.index2ad(tractId);
  const m = rotate(a, d);
  const pixelScale = 0.168; // arcsec / pixel
  const tractSize = 36000; // in pixels
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

const nPatchesDec = 10;
const nPatchesRA = 10;

function tractId2patchPolygons(tractId: number, validPatchIds: number[][]) {
  const polygons: Polygon[] = [];
  validPatchIds.map((patchId) => {
    const j = patchId[0];
    const i = patchId[1];
    polygons.push(patchPolygon(tractId, [j, i]));
  });
  return polygons;
}

function patchPolygon(tractId: number, patchId: [number, number]): Polygon {
  const [j, i] = patchId;
  const [t10, _t11, t01, t00] = tractId2polygon(tractId);
  const y0 = i / nPatchesDec;
  const y1 = (i + 1) / nPatchesDec;
  // t00 + x * (t10 - t00) + y * (t01 - t00)
  // == (1 - x - y) * t00 + x * t10 + y * t01
  const x0 = j / nPatchesRA;
  const x1 = (j + 1) / nPatchesRA;
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
