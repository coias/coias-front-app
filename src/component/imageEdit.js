import React, {useContext, useEffect, useState} from 'react';
//import SampleImg from '../images/4_disp-coias_nonmask.png';
import {
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "react-image-magnifiers";
import { PageContext } from '../App';
import InputSlider from '../component/contrastSlider';

function ImageEdit() {

	const {currentPage} = useContext(PageContext);

	const [contrastVal, setContrastVal] = useState(100);
	const [brightnessVal, setbrightnessVal] = useState(100);
	const [srcURL, setSrcURL] = useState("");

	useEffect(()=>{
		const pageURL = "./images/"+ String(currentPage + 1) +"_disp-coias_nonmask.png";
		setSrcURL(pageURL);
	}, [currentPage]);

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