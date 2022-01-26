import React, { useState, useEffect, createContext } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import SampleImg from '../images/4_disp-coias_nonmask.png';

function Top(props) {

	const [context, setContext] = useState(null);
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
		<div>
			<ul className="l-ul"> {buttonRender()} </ul>
			<canvas width="800" height="800" id="canvas"></canvas>
		</div>
	)
}

export const buttonRender = () =>{
	const menunames = ["COIAS","探索準備モード","探索モード","再測定モード","レポートモード"]
	return (
		menunames.map(item => <Link to="/COIAS"><li className="l-li"><Button variant="success">{item}</Button></li></Link>)
	)
}

export default withRouter(Top);