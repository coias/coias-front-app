import React, { useContext, useEffect, useState } from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import { PageContext } from '../App';
import ImageEdit from '../component/imageEdit';

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
		canvas.width = 1350;
		canvas.height = 1050;
		canvas.addEventListener("click",getMousePos, false);
		const canvasContext = canvas.getContext("2d");
		setContext(canvasContext);
	},[currentPage]);

	useEffect(async ()=>{
		const response = await axios.get("http://127.0.0.1:8000/disp");
		const disp = response.data.result;
		setPositions(disp);
	},[context]);

	useEffect(() => {
		if(context !== null){
			const img = new Image();
			img.onload = () => {
				context.drawImage(img,0,0,img.naturalWidth, img.naturalHeight);
				positions.map(pos=>{
					if(pos[1] === String(currentPage)){
						const x = (parseInt(pos[2]) /2 )- 20;
						const y = (img.naturalHeight - (parseInt(pos[3]) / 2) ) + 20;
						context.rect(x, y, 40, 40);	
						context.lineWidth = 2;
						context.strokeStyle = "black";
						context.font = "15px serif";
						context.fillStyle = "red";
  						context.fillText(pos[0], x-20, y -10);
						context.stroke();
						setLoaded(true);				
					}
				});
			}
			const src = './images/' + String(currentPage + 1) +'_disp-coias_nonmask.png';
			img.src = src;
		}
	});


	return(
		<div>
			<canvas id="canvas"><ImageEdit /></canvas>
		</div>
	)
}

export default withRouter(Top);