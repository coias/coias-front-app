import React, { useState, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaHandPaper, FaMousePointer } from 'react-icons/fa';
import { ImZoomIn, ImZoomOut } from 'react-icons/im';
import axios from 'axios';
import PanZoom from '../component/PanZoom';
import PlayMenu from '../component/PlayMenu';

function COIAS() {
  const [isGrab, setIsGrab] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isZoomOut, setIsZoomOut] = useState(false);
  const [imageNames, setImageNames] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const reactApiUri = process.env.REACT_APP_API_URI;
  const nginxApiUri = process.env.REACT_APP_NGINX_API_URI;

  const findActiveTool = () => {
    if (isGrab) setIsGrab(!isGrab);
    else if (isScroll) setIsScroll(!isScroll);
    else if (isZoomIn) setIsZoomIn(!isZoomIn);
    else if (isZoomOut) setIsZoomOut(!isZoomOut);
  };

  // 初回のみのAPIの読み込み
  useMemo(() => {
    // nginxにある画像を全て取得
    const getImages = async () => {
      const response = await axios.put(`${reactApiUri}copy`);
      const dataList = await response.data.result.sort();
      const nameList = dataList.filter((element) => {
        const b = element.endsWith('disp-coias_nonmask.png');
        return b;
      });
      const urlList = nameList.map((e) => nginxApiUri + e);
      setImageNames(nameList);
      setImageURLs(urlList);
    };
    getImages();
  }, []);

  return (
    <div>
      <PlayMenu imageNames={imageNames} />
      <Container fluid>
        <Row>
          <Col>
            <div
              className="flex-column"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <FaHandPaper
                size={30}
                color={isGrab ? 'red' : 'black'}
                onClick={() => {
                  findActiveTool();
                  setIsGrab(!isGrab);
                }}
              />
              <FaMousePointer
                size={30}
                color={isScroll ? 'red' : 'black'}
                onClick={() => {
                  findActiveTool();
                  setIsScroll(!isScroll);
                }}
              />
              <ImZoomIn
                size={30}
                color={isZoomIn ? 'red' : 'black'}
                onClick={() => {
                  findActiveTool();
                  setIsZoomIn(!isZoomIn);
                }}
              />
              <ImZoomOut
                size={30}
                color={isZoomOut ? 'red' : 'black'}
                onClick={() => {
                  findActiveTool();
                  setIsZoomOut(!isZoomOut);
                }}
              />
            </div>
          </Col>
          <Col md={11}>
            <PanZoom
              isGrab={isGrab}
              isScroll={isScroll}
              imageURLs={imageURLs}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default COIAS;
