/* eslint-disable */
import { ClicakblePolygonLayer, StyledPolygon } from './ClickablePolygonLayer';
import { makePureLayerComponent } from './Globe';

type ClickablePolygonProps = {
  polygons: StyledPolygon[];
  onClick: (index: number) => void;
  baseLineWidth?: number;
  activeLineWidth?: number;
};

export const ClickablePolygon = makePureLayerComponent(
  (
    globe,
    {
      polygons,
      onClick,
      baseLineWidth = 5,
      activeLineWidth = 8,
    }: ClickablePolygonProps,
  ) =>
    new ClicakblePolygonLayer(
      globe,
      polygons,
      onClick,
      baseLineWidth,
      activeLineWidth,
    ),
);

ClickablePolygon.displayName = 'ClickablePolygon';
