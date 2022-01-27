import React from 'react';
import {
  Magnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION
} from "react-image-magnifiers";
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