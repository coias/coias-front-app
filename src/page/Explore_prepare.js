import React from 'react';
import { Button,Row, Col, Container } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import FileModal from '../component/FileModal';

export const Explore_prepare = () => {
    const menunames = [ 
                        {"id" : 1, "name": "ファイル"},
                        {"id": 2, "name": "軌道修正"},
                        {"id" : 3, "name" : "ビニングマスク"},
                        {"id": 4, "name": "画像変換"},
                        {"id" : 5, "name" : "光源検出"},
                        {"id" : 6,"name" : "自動検出" },
                        {"id" : 7, "name" : "全自動処理"}
                    ];

    return(
        <div>
            <Row xs="auto">
                <Col><h4>探索準備  : </h4></Col>
                <Col >
                    <ul className='coias-ul' >
                    {menunames.map(item => 
                    {
                        if(item.id === 1){
                            return <li key={item.id} className="coias-li"><FileModal/></li>;
                        }else {
                            return <li key={item.id} className="coias-li"><Button variant="success">{item.name}</Button></li>;
                        }
                    })}
                    </ul>
                </Col>
            </Row>

            <Row xs="auto">
                <Col><h4>選択ファイル:</h4></Col>
                <Col>
                    <div style={{backgroundColor: "black", width:"1000px", height:"1000px"}}>
                        <ul style={{listStyleType:"none", color : "white"}}>
                            <li>1_disp-coias-nonmask.png</li>
                            <li>2_disp-coias-nonmask.png</li>
                            <li>3_disp-coias-nonmask.png</li>
                            <li>4_disp-coias-nonmask.png</li>
                            <li>5_disp-coias-nonmask.png</li>
                        </ul>
                    </div>     
                </Col>
            </Row>
            
        </div>
    )
};

export default withRouter(Explore_prepare);