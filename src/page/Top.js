import React from 'react';
import { Button } from 'react-bootstrap';

function Top() {

	function buttonRender(){
		const menunames = ["COIAS","探索準備モード","探索モード","再測定モード","レポートモード"]
		return (
			menunames.map(item => <li className="l-li"><Button variant="success">{item}</Button></li>)
		)
	}

	return(
		<div>
			<ul className="l-ul"> {buttonRender()} </ul>
		</div>
	)
}

export default Top;