import React, { useState, useEffect } from 'react';
import {withRouter} from 'react-router-dom';
import PageBar from '../components/PageBar';
import SampleImg from '../images/4_disp-coias_nonmask.png';

function Top() {

	return(
		<div>
			<PageBar />
		</div>
	)
}

export default withRouter(Top);