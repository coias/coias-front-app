import React, {useState} from 'react';
import SampleImg from '../images/4_disp-coias_nonmask.png';
import {
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "react-image-magnifiers";
import InputSlider from '../component/contrastSlider';

function ImageEdit() {

	const [contrastVal, setContrastVal] = useState(100);
	const [brightnessVal, setbrightnessVal] = useState(100);

	return(
		<div>
			<Magnifier
				imageSrc={SampleImg}
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