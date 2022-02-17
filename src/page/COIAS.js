import React from 'react';
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import ImageEdit from '../component/imageEdit';

export const COIAS = () => {


    const menunames = [
        {"id" : 1, "name": "Blink"},
        {"id": 2, "name": "Back"},
        {"id" : 3, "name" : "Next"},
        {"id": 4, "name": "Stop"},
        {"id": 5, "name": "Image"},
        {"id": 6, "name": "(X,Y)"},
        {"id": 7, "name": "Close Window"}
    ]

    return(
        <div>
            <ul className='coias-ul' >
             {menunames.map(item => {
                 if(item.id === 6) {
                    return <li key={item.id} >
                                <input type="text" placeholder={item.name} size="10" disabled="disabled" />
                            </li>;
                 }else{
                    return  <li key={item.id} style={{width : 'auto'}} className="coias-li"><Button variant="success">{item.name}</Button></li>;
                 }
             })}
            </ul>
            <ImageEdit/>
        </div>
    )
};

export default withRouter(COIAS);