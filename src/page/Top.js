import React, { useContext, useEffect, useState } from 'react';
import {withRouter} from 'react-router-dom';
import axios from "axios";
import { PageContext } from '../App';
import ImageEdit from '../component/imageEdit';

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