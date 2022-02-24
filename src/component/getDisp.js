import axios from "axios";
import { useContext, useState } from "react";

export const getDisp = async () =>{
    const [positions, setPositions] = useState([]);
	const {currentPage} = useContext(PageContext);

    const response = await axios.get("http://127.0.0.1:8000/disp");
	const disp = response.data.result;
	setPositions(disp);

    return positions;
}