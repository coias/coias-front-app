import React from "react";
import { Button } from 'react-bootstrap';
import {withRouter} from 'react-router-dom';

const MenuBar = (props) =>{
    const menunames = [
                        {"id" : 1, "name": "COIAS"},
                        {"id": 2, "name": "探索準備モード"},
                        {"id": 3, "name": "探索モード"},
                        {"id" : 4, "name" : "再測定モード"},
                        {"id" : 5,"name" : "レポートモード" }
                    ]

    const move = (item) => {
        var menuname = "";
        switch(item){
            case "COIAS" :
                menuname = "/COIAS";
                break;
            case "探索準備モード" :
                menuname = "/Explore_prepare";
                break;
            case "探索モード":
            case "再測定モード" : 
                menuname = "/Explore";
                break;
            case "レポートモード" : 
                menuname = "/Report";
                break;
            default :
                menuname = "/Top";
        }
        props.history.push(menuname);
    }

    return(
        <div>
            <ul className="l-ul">
                {		
                    menunames.map((item)=> 
                        <li key={item.id} className="l-li" >
                            <Button onClick={(() => move(item.name))} variant="success">
                                {item.name}
                            </Button>
                        </li>
                    )
                }
            </ul>
        </div>
    )
 
}

export default withRouter(MenuBar);