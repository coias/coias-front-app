import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import SampleImg from '../images/4_disp-coias_nonmask.png';

function Top() {

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

	function buttonRender(){
		const menunames = ["COIAS","探索準備モード","探索モード","再測定モード","レポートモード"]
		return (
			menunames.map(item => <li className="l-li"><Button variant="success">{item}</Button></li>)
		)
	}

	return(
		<div>
			<ul className="l-ul"> {buttonRender()} </ul>
			<canvas width="800" height="800" id="canvas"></canvas>
		</div>
	)
}

export default Top;