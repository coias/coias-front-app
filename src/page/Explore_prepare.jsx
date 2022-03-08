import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button,Row, Col, Container } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import FileModal from '../component/FileModal';

export const Explore_prepare = () => {
    const menunames = [ {"id" : 1, "name": "ファイル"},
                        {"id": 2, "name": "軌道修正", "query" : "prempsearchC"},
                        {"id" : 3, "name" : "ビニングマスク", "query" : "startsearch2R?binning=4"},
                        {"id": 4, "name": "画像変換", "query" : "fits2png"},
                        {"id" : 5, "name" : "光源検出", "query" : "findsource"},
                        {"id" : 6,"name" : "自動検出" , "query" : "astsearch_new"},
                        {"id" : 7, "name" : "全自動処理", "query" : "AstsearchR?binning=4" } ];
    
    const uri = process.env.REACT_APP_API_URI;
    const [fileNames, setFileNames] = useState(["Please input files"]);
    const [query, setQuery] = useState("");
                                    
    useEffect(() => {
        const put = async ()=>{
            const response = await axios.put(uri + query);
            console.log(response);
        }    
        put();
    }, [query]); 

        
    return(
        <div>
            <Row xs="auto">
                <Col><h4>探索準備  : </h4></Col>
                <Col >
                    <ul className='coias-ul' >
                    {menunames.map(item => 
                    {
                        if(item.id === 1){
                            return <li key={item.id} className="coias-li"><FileModal fileNames={fileNames} setFileNames={setFileNames}/></li>;
                        }else {
                            return <li key={item.id} className="coias-li"><Button onClick={()=>{setQuery(item.query)}} variant="success">{item.name}</Button></li>;
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
                            {
                                fileNames.map(file =>{
                                    return <li>{file}</li>;
                                })
                            }
                        </ul>
                    </div>     
                </Col>
            </Row>
            
        </div>
    )
};

export default withRouter(Explore_prepare);