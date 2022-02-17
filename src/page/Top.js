import React, { useEffect, useState } from 'react';
import {withRouter} from 'react-router-dom';
import SampleImg from '../images/4_disp-coias_nonmask.png';
import axios from "axios";


function Top() {
	const [context,setContext] = useState(null);
	const [loaded,setLoaded] = useState(false);
	const [positions, setPositions] = useState([]);

	useEffect(async ()=>{
		const response = await axios.get("http://127.0.0.1:8000/disp");
		const disp = response.data.result;
/* 		const position = disp.map(a=>{
			const posi = {x : parseInt(a[2]), y : parseInt(a[3])};
			return posi;
		}); */
		setPositions(disp);
	},[]);
	//console.log(positions.map(x=>(x.x,x.y)));

	function getMousePos(evt) {
		var rect = evt.target.getBoundingClientRect();
		console.log({
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top 
		  });
	}

	useEffect(() => {
		const canvas = document.getElementById("canvas");
		canvas.width = 1053;
		canvas.height = 1006;
		canvas.addEventListener("mousemove",getMousePos, false);
		const canvasContext = canvas.getContext("2d");
		setContext(canvasContext);
	},[]);

	useEffect(() => {
		if(context !== null){
			const img = new Image();
			img.src = SampleImg;
			img.onload = () => {
				context.drawImage(img,0,0);
				//console.log(canvas.width, canvas.height);
				positions.map(pos=>{
					if(pos[1] == "3"){
						context.rect(pos[2] - 15, pos[3] - 15, 30, 30);	
						context.lineWidth = 2;
						context.strokeStyle = "black";
						context.stroke();
						console.log("aaa");
				setLoaded(true);				

					}
				});
			}
		}
	})


	return(
		<div>
			<canvas width="800" height="800" id="canvas"></canvas>
		</div>
	)
}

export default withRouter(Top);