import React from 'react';
import SampleImg from '../images/4_disp-coias_nonmask.png';
import {
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "react-image-magnifiers";

function imageEdit() {

	return(
		<div>
			<Magnifier
				imageSrc={SampleImg}
				imageAlt="Example"
				mouseActivation={MOUSE_ACTIVATION.DOUBLE_CLICK}
				touchActivation={TOUCH_ACTIVATION.DOUBLE_TAP}
				style={{height: '800px', width: '800px'}}
			/>
		</div>
	)
}

export default imageEdit;