import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
/* eslint-disable no-unused-vars */
import {
  angle,
  easing,
  Globe,
  path,
  SkyCoord,
} from '@stellar-globe/stellar-globe';
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved, import/extensions, no-unused-vars */
import {
  CelestialText,
  Constellation,
  Ecliptic,
  EsoMilkyWay,
  Grid,
  HipparcosCatalog,
  Patch,
  PatchSelector,
  Path,
  PrettyPictures,
  RingsTract,
  SspData,
  SspOutline,
  StellarGlobe,
  Tract,
  TractSelector,
} from '../../component/StellarGlobe';
/* eslint-disable import/no-unresolved, import/extensions, no-unused-vars */

function DataSelector() {
  const globeRef = useRef(null);
  /** @type { () => Globe } */
  const globe = () => globeRef.current.globe();

  // 画像領域1へカメラ移動
  const goRegion1 = useCallback(() => {
    globe().camera.jumpTo(
      {
        fovy: angle.deg2rad(25), // 画角 (radian)
      },
      {
        coord: SkyCoord.fromDeg(5, 0), // 移動先座標
        duration: 400, // 移動時間
        easingFunction: easing.fastStart4, // 移動easing関数
      },
    );
  }, []);

  // 画像領域2へカメラ移動
  const goRegion2 = useCallback(() => {
    globe().camera.jumpTo(
      {
        fovy: angle.deg2rad(35), // 画角 (radian)
      },
      {
        coord: SkyCoord.fromDeg(177, 0), // 移動先座標
        duration: 400, // 移動時間
        easingFunction: easing.fastStart4, // 移動easing関数
      },
    );
  }, []);

  // 画像領域3へカメラ移動
  const goRegion3 = useCallback(() => {
    globe().camera.jumpTo(
      {
        fovy: angle.deg2rad(15), // 画角 (radian)
      },
      {
        coord: SkyCoord.fromDeg(225, 45), // 移動先座標
        duration: 400, // 移動時間
        easingFunction: easing.fastStart4, // 移動easing関数
      },
    );
  }, []);

  // tract, patct関係
  const [showTract, setShowTract] = useState(true);
  const tractIds = useMemo(() => [9470, 9471, 9472, 8742, 10675], []);
  const [selectedTractId, setSelectedTractId] = useState(undefined);
  const [selectedPatchId, setSelectedPatchId] = useState(undefined);
  const ringsTract = new RingsTract();
  const tractStyle = useMemo(
    () => ({
      baseColor: [1, 0, 0, 0.5],
      hoverColor: [1, 0, 0, 0.8],
      activeColor: [1, 0, 0, 1],
    }),
    [],
  );
  const selectedColor = useMemo(() => [1, 0, 1, 1]);
  const tractOnClick = useCallback((tractIndex) => {
    setSelectedTractId(tractIndex);

    const [a, d] = ringsTract.index2ad(tractIndex);
    globe().camera.jumpTo(
      {
        fovy: angle.deg2rad(1),
      },
      {
        coord: SkyCoord.fromRad(a, d),
        duration: 400,
        easingFunction: easing.fastStart4,
      },
    );
  }, []);
  const patchOnClick = useCallback((patchId) => {
    setSelectedPatchId(patchId);
  }, []);

  // xyz軸表示
  const [showAxis, setShowAxis] = useState(true);
  // eslint-disable-next-line no-use-before-define
  const axisPaths = useMemo(generageAxisPaths, []);

  // 視野中心座標表示
  const [centerCoord, setCenterCoord] = useState('');
  useEffect(() => {
    globe().on('camera-move', () => {
      const { camera } = globe();
      setCenterCoord(
        JSON.stringify(
          {
            coord: camera.center().toString(),
            fieldOfViewY: camera.fovy.toFixed(2), // radian
          },
          null,
          2,
        ),
      );
    });
  }, []);

  // クリック座標履歴表示
  const [clickedHistory, setClickedHistory] = useState([]);
  useEffect(() => {
    globe().on('pointer-down', (e) => {
      setClickedHistory((_) => [e.coord.toString(), ..._].slice(0, 10));
    });
  }, []);

  // eslint-disable-next-line no-unused-vars
  const sspDataUrl = useMemo(() => {
    const ssl = window.location.protocol === 'https';
    return `${
      ssl ? 'https' : 'http'
    }://hscmap.mtk.nao.ac.jp/hscMap4/data/pdr3_wide`;
  }, []);

  // 文字を配置
  /** @type {import('../../component/StellarGlobe/layers').CelestialTextProps} */
  const textProp = useMemo(
    () => ({
      billboardTexts: [
        // { position: SkyCoord.fromDeg(0, 90).xyz, text: '天の北極' },
        // { position: SkyCoord.fromDeg(0, 0).xyz, text: '春分点', color: 'red' },
        /* {
          position: SkyCoord.fromDeg(180, 0).xyz,
          text: '秋分点',
          color: 'green',
        }, */
        // { position: SkyCoord.fromDeg(0, -90).xyz, text: '天の南極' },
        {
          position: SkyCoord.fromDeg(90, 23.4).xyz,
          text: '黄道',
          color: 'orange',
        },
        {
          position: SkyCoord.fromDeg(5, 10).xyz,
          text: '画像領域1',
          color: 'magenta',
          font: '35px serif',
        },
        {
          position: SkyCoord.fromDeg(177, 10).xyz,
          text: '画像領域2',
          color: 'magenta',
          font: '35px serif',
        },
        {
          position: SkyCoord.fromDeg(225, 48).xyz,
          text: '画像領域3',
          color: 'magenta',
          font: '35px serif',
        },
        // { position: SkyCoord.fromDeg(90, 0).xyz, text: '赤道', color: 'red' },
      ],
      defaultColor: 'white',
      defaultFont: '25px serif', // https://developer.mozilla.org/ja/docs/Web/CSS/font の書式で
      alpha: 1, // 不透明度
    }),
    [],
  );

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        {/* ビューワー関係はここから */}
        <StellarGlobe ref={globeRef} style={{ height: '100%' }}>
          {/* M31などの綺麗な画像 */}
          {/* <PrettyPictures /> */}

          {/* HSCの画像 */}
          <SspData baseUrl={sspDataUrl} outline={false} />

          {/* HSCの画像データの枠 */}
          <SspOutline
            url="//hscmap.mtk.nao.ac.jp/hscMap4/data/pdr3_wide/area.json"
            color={[1, 0, 1, 0.5]}
          />

          {/* 背景の天の川 */}
          <EsoMilkyWay />

          {/* 星 */}
          <HipparcosCatalog />

          {/* グリッド */}
          {/* <Grid /> */}

          {/* 星座 */}
          <Constellation lang="Hiragana" showNames />

          {/* 黄道 */}
          <Ecliptic />

          {/* XYZ軸 */}
          {/* showAxis && <Path paths={axisPaths} /> */}

          {/* Tract, Patch枠関係 */}
          {showTract && (
            <>
              {/* Tract選択肢 */}
              <TractSelector
                tractIds={tractIds}
                style={tractStyle}
                onClick={tractOnClick}
              />
              {selectedTractId !== undefined && (
                <>
                  {/* Tractがどれか選択されていたら選択中のTractを強調表示 */}
                  <Tract tractId={selectedTractId} color={selectedColor} />
                  {/* Patch選択肢 */}
                  <PatchSelector
                    tractId={selectedTractId}
                    style={tractStyle}
                    onClick={patchOnClick}
                  />
                  {selectedPatchId !== undefined && (
                    // Patchがどれか選択されていたら選択中のPatchを強調表示
                    <Patch
                      tractId={selectedTractId}
                      patchId={selectedPatchId}
                      color={selectedColor}
                    />
                  )}
                </>
              )}
            </>
          )}
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <CelestialText {...textProp} />
          {/* <GlobeDebug /> */}
        </StellarGlobe>
        {/* ビューワー関係はここまで */}
      </div>
      <div
        style={{
          backgroundColor: '#eee',
          padding: '0.5em 1em',
          minWidth: '300px',
        }}
      >
        <dl>
          <dt>移動</dt>
          <dd>
            <ul>
              <li>
                <button type="button" onClick={goRegion1}>
                  画像領域1
                </button>
              </li>
              <li>
                <button type="button" onClick={goRegion2}>
                  画像領域2
                </button>
              </li>
              <li>
                <button type="button" onClick={goRegion3}>
                  画像領域3
                </button>
              </li>
            </ul>
          </dd>
          <dt>Tract枠</dt>
          <dd>
            <ul style={{ listStyle: 'none' }}>
              <li>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label>
                  <input
                    type="checkbox"
                    checked={showTract}
                    onChange={(e) => setShowTract(e.target.checked)}
                  />
                  表示
                </label>
              </li>
              <li>
                選択中: {selectedTractId}/{selectedPatchId}
              </li>
            </ul>
          </dd>
          <dt>中心座標</dt>
          <dd>
            <pre style={{ whiteSpace: 'pre' }}>{centerCoord}</pre>
          </dd>
        </dl>
      </div>
    </div>
  );
}

export default React.memo(DataSelector);

function generageAxisPaths() {
  /** @type {path.Path[]} */
  const paths = [
    {
      // x軸
      points: [
        { position: [0, 0, 0], color: [1, 0, 0, 1], size: 0 },
        { position: [1, 0, 0], color: [1, 0, 0, 1], size: 0 },
      ],
      close: false,
      joint: path.JOINT.MITER,
    },
    {
      // y軸
      points: [
        { position: [0, 0, 0], color: [0, 1, 0, 1], size: 0 },
        { position: [0, 1, 0], color: [0, 1, 0, 1], size: 0 },
      ],
      close: false,
      joint: path.JOINT.MITER,
    },
    {
      // z軸
      points: [
        { position: [0, 0, 0], color: [0, 0, 1, 1], size: 0 },
        { position: [0, 0, 1], color: [0, 0, 1, 1], size: 0 },
      ],
      close: false,
      joint: path.JOINT.MITER,
    },
  ];
  return paths;
}
