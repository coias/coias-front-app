import React from 'react';
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import ImageEdit from '../component/imageEdit';

export const Explore = () => {

    const menunames = [
        {"id" : 1, "name": "Blink"},
        {"id": 2, "name": "Back"},
        {"id" : 3, "name" : "Next"},
        {"id": 4, "name": "Mark"},
        {"id": 5, "name": "リスト"},
        {"id": 6, "name": "Image"},
        {"id": 7, "name": "(X,Y)"},
        {"id": 8, "name": "再描画"}
    ]

    return(
        <div>
            <ul className='coias-ul' >
             {menunames.map(item => {
                 if(item.id === 6 || item.id === 7) {
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

export default withRouter(Explore);