import React from 'react';
<<<<<<< HEAD
=======
import SampleImg from '../images/4_disp-coias_nonmask.png';
>>>>>>> 9d1e2b1ede01e03bc8708cfdf531b2ad26101500
import {
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "react-image-magnifiers";
<<<<<<< HEAD
import SampleImg from '../images/4_disp-coias_nonmask.png';

function ImageEdit(){

    
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

export default ImageEdit;
=======

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
>>>>>>> 9d1e2b1ede01e03bc8708cfdf531b2ad26101500
