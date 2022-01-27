import React from 'react';

import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import DrawImage from '../components/DrawImage';
import FunctionBar from '../components/FunctionBar';

export const COIAS = () => {

    return (
        <div>
            <ul className='coias-ul'>
				<FunctionBar />
                <li className='coias-li'>currentImgName</li>
                <li className='coias-li'>Posion (X pix ...,Y pix ...)</li>
                <li style={{width : 400 + 'px'}}><input type="text" placeholder="comment"/></li>
                <li><Button variant="success">close window</Button></li>
            </ul>
			<DrawImage />
        </div>
    );
};

export default withRouter(COIAS);