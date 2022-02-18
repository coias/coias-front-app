import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
//import ImageEdit from '../component/imageEdit';
import { PageContext } from '../App';

export const COIAS = () => {

	//const [currentPage, setCurrentPage] = useState(0);
	const {currentPage, setCurrentPage} = useContext(PageContext);


    const menunames = [
        {"id" : 1, "name": "Blink"},
        {"id": 2, "name": "Back"},
        {"id" : 3, "name" : "Next"},
        {"id": 4, "name": "Stop"},
        {"id": 5, "name": "Image"},
        {"id": 6, "name": "(X,Y)"},
        {"id": 7, "name": "Close Window"}
    ]

    const onClickNext = () => {
        if(currentPage===4) setCurrentPage(0);
        else setCurrentPage(currentPage + 1);
    }

    const onClickBack = () => {
        if(currentPage===0) setCurrentPage(4);
        else setCurrentPage(currentPage - 1);
    }

    const onClickBlink = () => {
        setInterval(onClickNext(), 1000);
    }

    return(
        <div>
            <ul className='coias-ul' >
             {menunames.map(item => {
                 {console.log(currentPage)}
                 if(item.id=== 1){
                    return  <li key={item.id} style={{width : 'auto'}} className="coias-li"><Button onClick={() => {onClickBlink()}} variant="success">{item.name}</Button></li>;
                 }else if(item.id=== 2){
                    return  <li key={item.id} style={{width : 'auto'}} className="coias-li"><Button onClick={() =>{onClickBack()}} variant="success">{item.name}</Button></li>;
                 }else if(item.id=== 3){
                    return  <li key={item.id} style={{width : 'auto'}} className="coias-li"><Button onClick={() => {onClickNext()}} variant="success">{item.name}</Button></li>;
                 }else if(item.id === 5) {
                    return <li key={item.id} >
                                <input type="text" placeholder={"No." + String(currentPage + 1)} size="10" disabled="disabled" />
                            </li>;
                 }else if(item.id === 6) {
                    return <li key={item.id} >
                                <input type="text" placeholder={item.name} size="10" disabled="disabled" />
                            </li>;
                 }else{
                    return  <li key={item.id} style={{width : 'auto'}} className="coias-li"><Button variant="success">{item.name}</Button></li>;
                 }

             })}
            </ul>

        </div>
    )
};

export default withRouter(COIAS);