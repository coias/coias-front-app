import React, { useContext, useEffect, useState } from 'react';
import {withRouter} from 'react-router-dom';
//import SampleImg from '../images/1_disp-coias_nonmask.png';
import axios from "axios";
import { PageContext } from '../App';

function Top() {
	const [context,setContext] = useState(null);
	const [loaded,setLoaded] = useState(false);
	const [positions, setPositions] = useState([]);
	const {currentPage} = useContext(PageContext);

	
	function getMousePos(evt) {
		var rect = evt.target.getBoundingClientRect();
		console.log({
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top 
		  });
	}

	useEffect(() => {
		const canvas = document.getElementById("canvas");
		canvas.width = 2000;
		canvas.height = 2000;
		canvas.addEventListener("click",getMousePos, false);
		const canvasContext = canvas.getContext("2d");
		setContext(canvasContext);
	},[currentPage]);

	useEffect(async ()=>{
		const response = await axios.get("http://127.0.0.1:8000/disp");
		const disp = response.data.result;
		setPositions(disp);
	},[context]);
	//console.log(positions.map(x=>(x.x,x.y)));


	useEffect(() => {
		if(context !== null){
			const img = new Image();
			img.onload = () => {
				context.drawImage(img,0,0,img.naturalWidth, img.naturalHeight);
				//console.log(canvas.width, canvas.height);
				positions.map(pos=>{
					console.log(currentPage);

					if(pos[1] === String(currentPage)){
						const x = (parseFloat(pos[2]) /2) - 20;
						const y = (parseFloat(pos[3]) / 2) - 20;
						//console.log(x,y);
						context.rect(x, y, 40, 40);	
						context.lineWidth = 2;
						context.strokeStyle = "red";
						context.stroke();
						//console.log("aaa");
						setLoaded(true);				
					}
				});
			}
			const src = './images/' + String(currentPage + 1) +'_disp-coias_nonmask.png';
			console.log(src);
			img.src = src;
		}
	});


	return(
		<div>
			<canvas id="canvas"></canvas>
		</div>
	)
}

export default withRouter(Top);