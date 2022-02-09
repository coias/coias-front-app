import React from 'react';
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import FunctionBar from '../component/FunctionBar';
import imageEdit from '../component/imageEdit';

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
            <ul className="l-ul"> {imageEdit()} </ul>
        </div>
    );
};

export default withRouter(COIAS);