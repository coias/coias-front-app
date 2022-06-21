// eslint-disable-next-line import/prefer-default-export
export const convertPng2FitsCoords = (pngPosition, FITSSIZES) => {
  const PNGSIZES = {
    x: window.images[0][0].naturalWidth,
    y: window.images[0][0].naturalHeight,
  };

  if (pngPosition.x > PNGSIZES[0] || pngPosition.y > PNGSIZES[1]) {
    console.log('no');
  }

  const pngXRelPos = pngPosition.x / PNGSIZES.x;
  const pngYRelPos = pngPosition.y / PNGSIZES.y;

  const fitsXRelPos = pngXRelPos;
  const fitsYRelPos = 1.0 - pngYRelPos;

  const fitsXPosition = Math.floor(fitsXRelPos * FITSSIZES[0]);
  const fitsYPosition = Math.floor(fitsYRelPos * FITSSIZES[1]);

  return { x: fitsXPosition, y: fitsYPosition };
};
