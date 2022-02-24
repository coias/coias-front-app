import React, {useContext, useEffect, useState} from 'react';
import {
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "react-image-magnifiers";
import { PageContext } from '../App';
import InputSlider from '../component/contrastSlider';
import axios from 'axios';


function ImageEdit() {

	const {currentPage} = useContext(PageContext);

	const [contrastVal, setContrastVal] = useState(100);
	const [brightnessVal, setbrightnessVal] = useState(100);
	const [srcURL, setSrcURL] = useState("");
    const [positions, setPositions] = useState([]);

	const canvas = document.getElementById("canvas");
	//const context = canvas.getContext("2d");


	useEffect(()=>{
		const pageURL = "./images/"+ String(currentPage + 1) +"_disp-coias_nonmask.png";
		setSrcURL(pageURL);
		const getDisp = async () =>{
		    const response = await axios.get("http://127.0.0.1:8000/disp");
            const disp = await response.data.result;
            setPositions(disp);
		} 
		getDisp();
	}, [currentPage]);

/* 	const onLoad = () => {
		const img = new Image();
        img.src = srcURL;
		context.drawImage(img,0,0,img.naturalWidth,img.naturalHeight);
		positions.map(pos=>{
			if(pos[1] === String(currentPage)){
				const x = (parseFloat(pos[2]) )- 20;
				const y = (img.naturalHeight - (parseFloat(pos[3])) ) + 20;
				context.rect(x, y, 40, 40);	
				context.lineWidth = 2;
				context.strokeStyle = "black";
				context.font = "15px serif";
				context.fillStyle = "red";
				context.fillText(pos[0], x-20, y -10);
				context.stroke();
		 	}
		});
	}
 */
	return(
		<div>
			<Magnifier
				imageSrc={srcURL}
				imageAlt="Example"
				mouseActivation={MOUSE_ACTIVATION.DOUBLE_CLICK}
				touchActivation={TOUCH_ACTIVATION.DOUBLE_TAP}
				style={{height: '800px', width: '800px', filter: `contrast(${contrastVal}%) brightness(${brightnessVal}%)`}}
			/>
			<InputSlider
				setSliderVal={setContrastVal}
			/>
			<InputSlider
				setSliderVal={setbrightnessVal}
			/>
		</div>
	)
}

export default ImageEdit;