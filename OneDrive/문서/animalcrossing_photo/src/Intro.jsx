import "./intro.css";
import { useNavigate } from "react-router-dom"; // 추가
import takePhotoImg from "./img/take_a_photo.png";
import galleryPhotoImg from "./img/gallery_photo.png";

export default function Intro() {
  const navigate = useNavigate(); // 페이지 이동 함수

  return (
    <div className="intro-container">
      <div className="button-wrapper">
        <button className="photo-btn" onClick={() => navigate("/take-photo")}>
          <img src={takePhotoImg} alt="사진찍으러가기 버튼 사진" />
        </button>
        <button className="photo-btn" onClick={() => navigate("/gallery")}>
          <img src={galleryPhotoImg} alt="갤러리 버튼 사진" />
        </button>
      </div>
    </div>
  );
}
    