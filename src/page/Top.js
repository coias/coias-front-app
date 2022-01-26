import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import SampleImg from '../images/4_disp-coias_nonmask.png';
import {
  Magnifier,
  GlassMagnifier,
  SideBySideMagnifier,
  PictureInPictureMagnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "react-image-magnifiers";

function Top() {

	const [context,setContext] = useState(null);
	const [loaded,setLoaded] = useState(false);

	function buttonRender(){
		const menunames = ["COIAS","探索準備モード","探索モード","再測定モード","レポートモード"]
		return (
			menunames.map(item => <li className="l-li"><Button variant="success">{item}</Button></li>)
		)
	}

	return(
		<div>
			<ul className="l-ul"> {buttonRender()} </ul>
			<Magnifier
				imageSrc={SampleImg}
				imageAlt="Example"
				largeImageSrc="" // Optional
				mouseActivation={MOUSE_ACTIVATION.DOUBLE_CLICK} // Optional
				touchActivation={TOUCH_ACTIVATION.DOUBLE_TAP} // Optional
				style={{height: '800px', width: '800px'}}
			/>
		</div>
	)
}

export default Top;