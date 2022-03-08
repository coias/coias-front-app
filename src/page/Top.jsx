import React, { useContext, useState } from 'react';
import {withRouter} from 'react-router-dom';
import { PageContext } from '../App';

function Top(props) {
	const [context,setContext] = useState(null);
	const [loaded,setLoaded] = useState(false);
	const [positions, setPositions] = useState([]);
	const {currentPage} = useContext(PageContext);


	return(
		<div></div>
	)
}

export default withRouter(Top);