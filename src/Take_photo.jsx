import "./Take_photo.css";
import { useNavigate } from "react-router-dom";
import twophotoImg from "./img/2photo.png";
import fourphotoImg from "./img/4photo.png";
import fivephotoImg from "./img/5photo.png";
export default function Take_photo(){
    return(
        <div>
            <div className="choose_container">
                <button className="photo-btn2" onClick={() => handleNavigate("/take-photo")}>
                    <img src={twophotoImg} id = "no2"/>
                </button>
                <button className="photo-btn4" onClick={() => handleNavigate("/gallery")}>
                    <img src={fourphotoImg} id = "no3"/>
                </button>
                <button className="photo-btn5" onClick={() => handleNavigate("/gallery")}>
                    <img src={fivephotoImg} id = "no4"/>
                </button>
            </div>
        </div>
    )
}