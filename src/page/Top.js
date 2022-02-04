import React from 'react';
import { Button } from 'react-bootstrap';
<<<<<<< HEAD
=======
import imageEdit from '../component/imageEdit';
>>>>>>> 9d1e2b1ede01e03bc8708cfdf531b2ad26101500

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
<<<<<<< HEAD
=======
			<ul className="l-ul"> {imageEdit()} </ul>
>>>>>>> 9d1e2b1ede01e03bc8708cfdf531b2ad26101500
		</div>
	)
}

export default Top;