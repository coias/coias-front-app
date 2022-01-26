import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import {buttonRender} from './Top';
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import SampleImg from '../images/4_disp-coias_nonmask.png';

export const COIAS = (props) => {

    /* const [context, setContext] = useState(null);
	const [loaded,setLoaded] = useState(false);

	useEffect(() => {
        const canvas = document.getElementById("canvas");
		const canvasContext = canvas.getContext("2d");
		setContext(canvasContext);
		if(context !== null){
			const img = new Image();
			img.src = SampleImg;
			img.onload = () => {
				context.drawImage(img,0,0);
				setLoaded(true);
			}
		}
	},[context]) */


    const coiasButtonRender = () => {
		const menunames = ["Blink","Back","next","Sq On/Off"];
		return (
			menunames.map(item => <li className="coias-li"><Button variant="success">{item}</Button></li>)
		)
	}

    return (
        <div>
            <ul className='coias-ul'>
                {coiasButtonRender()}
                <li className='coias-li'>currentImgName</li>
                <li className='coias-li'>Posion (X pix ...,Y pix ...)</li>
                <li style={{width : 400 + 'px'}}><input type="text" placeholder="comment"/></li>
                <li><Button variant="success">close window</Button></li>
            </ul>
            <canvas width="800" height="800" id="canvas"></canvas>
        </div>
    );
};

export default withRouter(COIAS);