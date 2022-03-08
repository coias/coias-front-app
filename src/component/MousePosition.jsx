import { useContext } from "react";
import { MousePositionContext } from "../App";
import { BiCurrentLocation } from "react-icons/bi";

const MousePosition = () => {
  const { currentMousePos, setCurrentMousePos } =
    useContext(MousePositionContext);
  return (
    <div
      style={{
        opacity: 0.5,
        width: "200px",
        height: "50px",
        color: "white",
        backgroundColor: "black",
        position: "absolute",
        top: "0px",
        right: "0px",
      }}
    >
      <BiCurrentLocation size={30} />
      {currentMousePos.x + "," + currentMousePos.y}
    </div>
  );
};

export default MousePosition;
