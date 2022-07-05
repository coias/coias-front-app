// eslint-disable-next-line import/prefer-default-export
export const convertPng2FitsCoords = (pngPosition, FITSSIZES) => {
  const PNGSIZES = {
    x: window.images[0][0].naturalWidth,
    y: window.images[0][0].naturalHeight,
  };

  const pngXRelPos = pngPosition.x / PNGSIZES.x;
  const pngYRelPos = pngPosition.y / PNGSIZES.y;

  const fitsXRelPos = pngXRelPos;
  const fitsYRelPos = 1.0 - pngYRelPos;

  const fitsXPosition = Math.floor(fitsXRelPos * FITSSIZES.x);
  const fitsYPosition = Math.floor(fitsYRelPos * FITSSIZES.y);

  return { x: fitsXPosition, y: fitsYPosition };
};

export const convertFits2PngCoords = (fitsPosition, FITSSIZES) => {
  const PNGSIZES = {
    x: window.images[0][0].naturalWidth,
    y: window.images[0][0].naturalHeight,
  };

  const fitsXRelPos = fitsPosition[0] / FITSSIZES.x;
  const fitsYRelPos = fitsPosition[1] / FITSSIZES.y;

  const pngXRelPos = fitsXRelPos;
  const pngYRelPos = 1.0 - fitsYRelPos;

  const pngXPosition = Math.floor(pngXRelPos * PNGSIZES.x);
  const pngYPosition = Math.floor(pngYRelPos * PNGSIZES.y);

  return { x: pngXPosition, y: pngYPosition };
};
