import React, { useRef, useEffect, useContext, useState} from 'react';
import Draggable from 'react-draggable';
import * as R from 'ramda'
import _ from 'lodash'
import panzoom from 'panzoom'
import { PageContext } from '../App';
import axios from 'axios';

const canvasSize = 1050;
const halfSize = canvasSize / 2;

const createShadow = (size) => `${size}px ${size}px 10px #ccc inset`;
const shadowSize = 8;

const zoomBy = 0.1;

const _bg = {
  direction: 45,
  color: {
    dark: '#ccc',
    light: 'transparent',
  },
  size: 20,
  span: 100 / 4
}

const bg = { ..._bg, doubleSize: _bg.size * 2, rest: 100 - _bg.span }

const PanZoom = () => {
  const z_p_canvasRef = useRef(null)
  const canvasRef = useRef(null)
  const [positions, setPositions] = useState([]);
  const [loaded,setLoaded] = useState(false);
	const {currentPage} = useContext(PageContext);  

  useEffect(() => {
    const z_p_canvas = panzoom(z_p_canvasRef.current, {
      // maxZoom: 10,
      // minZoom: 1,
      // autocenter: true,
    })

    return () => {
      z_p_canvas.dispose()
    }
  }, []);

  useEffect(()=>{
		const getDisp = async () =>{
		    const response = await axios.get("http://127.0.0.1:8000/disp");
        const disp = await response.data.result;
        setPositions(disp);
		} 
		getDisp();
	},[currentPage]); 


  useEffect(() => {    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if(context && positions.length > 0){
      const storedTransform = context.getTransform();
      context.canvas.width = context.canvas.width;
      context.setTransform(storedTransform);
      const img = new Image();
      img.src = "./images/"+String(currentPage + 1)+"_disp-coias_nonmask.png";

      img.onload = () => {
        context.drawImage(img,0,0,img.naturalWidth,img.naturalHeight);
        positions.forEach(pos=>{
            if(pos[1] === String(currentPage)){
              const x = (parseFloat(pos[2]) )- 20;
              const y = (img.naturalHeight - (parseFloat(pos[3])) ) + 20;
              console.log(pos[0], pos[1],currentPage, x,y);
              context.lineWidth = 2;
              context.strokeStyle = "black";
              context.rect(x, y, 40, 40);	

              context.font = "15px serif";
              context.fillStyle = "red";
              context.fillText(pos[0], x-20, y -10);
              context.stroke();
              setLoaded(true);
            }
        }); 
      }
    }
  }, [positions]);

  return (
    <div
      style={{
        marginTop: '80px',
        width: '70vw',
        height: '70vh',
        overflow: 'hidden',
      }}
    >
      <div
        ref={z_p_canvasRef}
      >
        <canvas
          ref={canvasRef} 
          width="1050px"
          height="1050px"
        />
      </div>

    </div>
  );
}

export default PanZoom;