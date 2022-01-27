import React, { useState, useEffect } from 'react';
import {withRouter} from 'react-router-dom';
import PageBar from '../components/PageBar';

function Top() {

	return(
		<div>
			<PageBar />
		</div>
	)
}

export default withRouter(Top);