import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaHandPaper, FaMousePointer } from 'react-icons/fa';
import axios from 'axios';
import PanZoom from '../component/PanZoom';
import PlayMenu from '../component/PlayMenu';

function COIAS() {
  const [isGrab, setIsGrab] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [imageNames, setImageNames] = useState([]);
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
      const nameList = dataList.filter((element) => {
        const b = element.endsWith('disp-coias.png');
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
            </div>
          </Col>
          <Col md={11}>
            <div>
              Alt
              キーを押しながらスクロール操作で、ズームイン・ズームアウトできます。
            </div>
            <PanZoom imageURLs={imageURLs} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default COIAS;
