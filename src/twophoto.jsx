import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import styles from "./photo.module.css";
import startbtn from "./img/start_button.png";

function Twophoto() {
  const [villager, setVillager] = useState(null);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path, { state: { villager, cuts: 2 } }); // 주민 정보와 컷 수 전달
  };

  const fetchVillager = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/villagers"); // 프록시 서버 호출
      const data = response.data;
      const randomVillager = data[Math.floor(Math.random() * data.length)];
      setVillager(randomVillager);
    } catch (err) {
      console.error("주민 데이터를 불러오지 못했습니다:", err);
    }
  };

  useEffect(() => {
    fetchVillager();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.webcamArea}>
        <div className={styles.webcamWrapper}>
          {villager && <p className={styles.villagerName}>{villager.name}</p>}{" "}
          {/* 이름이 웹캠 바로 위 */}
          <Webcam
            className={styles.webcam}
            audio={false}
            videoConstraints={{ facingMode: "user" }}
          />
          {villager && (
            <div className={styles.villagerOverlay}>
              <img src={villager.image_url} alt={villager.name} />
            </div>
          )}
        </div>

        <button
          className={styles.button}
          onClick={() => handleNavigate("/take-photo")}>
          <img src={startbtn} alt="Start" />
        </button>
      </div>
    </div>
  );
}

export default Twophoto;
