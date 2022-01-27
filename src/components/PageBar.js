import React from "react";
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';
import DrawImage from "./DrawImage";

const PageBar = (props) =>{
    const menunames = ["COIAS","探索準備モード","探索モード","再測定モード","レポートモード"]

    const move = () => {
        props.history.push("/COIAS");
    }

    return(
        <div>
            <ul className="l-ul">
                {		
                    menunames.map(item => 
                        <li className="l-li">
                            <Button onClick={move} variant="success">
                                {item}
                            </Button>
                        </li>
                    )
                }
            </ul>
        </div>
    )
 
}

export default withRouter(PageBar);