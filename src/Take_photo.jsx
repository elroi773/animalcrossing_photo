import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import styles from "./Take_photo.module.css";

export default function Take_photo(){
	const location = useLocation();
	const navigate = useNavigate();
	const webcamRef = useRef(null);
	
	// props로 받은 주민 정보
	const villager = location.state?.villager;
	const cuts = location.state?.cuts;
	
	const [capturedImages, setCapturedImages] = useState([]);
	const [countdown, setCountdown] = useState(5); // 5초 카운트다운
	const [currentCut, setCurrentCut] = useState(0);
	const [isComplete, setIsComplete] = useState(false);

	// 5초 카운트다운 및 자동 촬영
	useEffect(() => {
		if (!isComplete && countdown > 0) {
		const timer = setTimeout(() => {
			setCountdown(countdown - 1);
		}, 1000);
		return () => clearTimeout(timer);
		} else if (!isComplete && countdown === 0) {
			capturePhoto();
		}
	}, [countdown, isComplete]);

	// 사진 캡처 함수
	const capturePhoto = useCallback(() => {
		const imageSrc = webcamRef.current?.getScreenshot();
		if (!imageSrc) return;

		const newImages = [...capturedImages, imageSrc];
		const newCut = currentCut + 1;

		setCapturedImages(newImages);
		setCurrentCut(newCut);

		if (newCut >= cuts) {
			setIsComplete(true);
			setTimeout(() => {
			navigate("/result", {
				state: { villager, images: newImages, cuts },
			});
			}, 1000);
		} else {
			setCountdown(5);
		}
	}, [currentCut, cuts, capturedImages, villager, navigate]);

	if (!villager || !cuts) {
		return (
		<div className={styles.container}>
			<p>주민 정보 또는 컷 정보를 찾을 수 없습니다.</p>
			<button onClick={() => navigate(-1)} className={styles.backButton}>
			돌아가기
			</button>
		</div>
		);
	}

	return (
		<div className={styles.container}>
			<div className={styles.webcamWrapper}>
				<p className={styles.villagerName}>{villager.name}</p>
				<Webcam
					ref={webcamRef}
					className={styles.webcam}
					audio={false}
					screenshotFormat="image/jpeg"
					videoConstraints={{ facingMode: "user" }}
				/>

				<div className={styles.villagerOverlay}>
					<img src={villager.image_url} alt={villager.name} />
				</div>

				{!isComplete && countdown > 0 && (<div className={styles.countdown}>{countdown}</div>)}

				{isComplete && <div className={styles.complete}>촬영 완료!</div>}
				
				<div className={styles.captureInfo}> {/* 남은 컷 수 */}
					{currentCut} / {cuts}
				</div>
			</div>
		</div>
	)
}