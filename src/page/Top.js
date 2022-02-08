import React from 'react';
import imageEdit from '../component/imageEdit';
import {withRouter} from 'react-router-dom';
import PageBar from '../component/PageBar'

function Top() {
	return(
		<div>
			<ul className="l-ul"> {imageEdit()} </ul>
		</div>
	)
}

export default withRouter(Top);