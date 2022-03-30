import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaHandPaper, FaMousePointer } from 'react-icons/fa';
import { AiOutlineReload } from 'react-icons/ai';
import axios from 'axios';
import PanZoom from '../component/PanZoom';
import PlayMenu from '../component/PlayMenu';
import ContrastBar from '../component/ContrastBar';
import BrightnessBar from '../component/BrightnessBar';

function COIAS() {
  const [isGrab, setIsGrab] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [isReload, setIsReload] = useState(false);
  const [brightnessVal, setBrightnessVal] = useState(150);
  const [contrastVal, setContrastVal] = useState(150);
  const [imageURLs, setImageURLs] = useState([]);
  const reactApiUri = process.env.REACT_APP_API_URI;
  const nginxApiUri = process.env.REACT_APP_NGINX_API_URI;

  // 初回のみのAPIの読み込み
  useMemo(() => {
    setIsGrab(true);
    // nginxにある画像を全て取得
    const getImages = async () => {
      const response = await axios.put(`${reactApiUri}copy`);
      const dataList = await response.data.result.sort();

      const toObjectArray = [];
      dataList.forEach((data) => {
        const idx = data.slice(0, 2);
        const o =
          toObjectArray.filter((obj) => obj.name.startsWith(idx))[0] ?? {};
        if (toObjectArray.indexOf(o) === -1) {
          toObjectArray.push(o);
        }
        if (data.endsWith('disp-coias.png')) {
          o.name = data;
          o.mask = nginxApiUri + data;
        } else {
          o.nomask = nginxApiUri + data;
        }
        o.visible = true;
        o.nomasked = false;
      });
      setImageURLs(toObjectArray);
    };
    getImages();
  }, []);

  return (
    <div className="coias-view-main">
      <PlayMenu imageNames={imageURLs} setImageURLs={setImageURLs} />
      <Container fluid>
        <Row>
          <Col>
            <div
              className="flex-column"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Button
                id="grabButton"
                data-active={isGrab}
                variant={isGrab ? 'danger' : 'light'}
                onClick={() => {
                  setIsSelect(false);
                  setIsGrab(!isGrab);
                }}
              >
                <FaHandPaper size={30} />
              </Button>
              <Button
                id="selectButton"
                data-active={isSelect}
                variant={isSelect ? 'danger' : 'light'}
                onClick={() => {
                  setIsGrab(false);
                  setIsSelect(!isSelect);
                }}
              >
                <FaMousePointer size={30} />
              </Button>
              <Button
                id="reloadButton"
                variant="light"
                onClick={() => {
                  setIsGrab(false);
                  setIsSelect(false);
                  setIsReload(!isReload);
                }}
              >
                <AiOutlineReload size={30} />
              </Button>
              <BrightnessBar val={brightnessVal} set={setBrightnessVal} />
              <ContrastBar val={contrastVal} set={setContrastVal} />
            </div>
          </Col>
          <Col md={11} className="h-100">
            <PanZoom
              imageURLs={imageURLs}
              isReload={isReload}
              brightnessVal={brightnessVal}
              contrastVal={contrastVal}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default COIAS;
