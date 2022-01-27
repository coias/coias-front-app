import React, { useState, useEffect, useContext } from 'react';
import SampleImg from '../images/4_disp-coias_nonmask.png';

const DrawImage = () => {

    const [context,setContext] = useState(null);
	const [loaded,setLoaded] = useState(false);

	useEffect(() => {
		const canvas = document.getElementById("canvas");
		const canvasContext = canvas.getContext("2d");
		setContext(canvasContext)
	},[]);

	useEffect(() => {
		if(context !== null){
			const img = new Image();
			img.src = SampleImg;
			img.onload = () => {
				context.drawImage(img,0,0);
				setLoaded(true);
			}
		}
	},[context])
    
    return(
        <canvas width="800" height="800" id="canvas"></canvas>
    )

}
    

export default DrawImage;