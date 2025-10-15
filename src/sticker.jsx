import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./sticker.css";

// 이미지 import
import bgImg from "./img/background_sticker.png";
import peachImg from "./img/peach_animal.png";
import takoImg from "./img/tako_animal.png";
import racconImg from "./img/animal.png";
import hamsterImg from "./img/hamster.png";
import bearImg from "./img/bear.png";
import duckImg from "./img/duck.png";
import cherryImg from "./img/cherry.png";
import orangeImg from "./img/orange.png";
import limeImg from "./img/lime.png";
import appleImg from "./img/apple.png";
import apple2Img from "./img/apple_2.png";
import finishBtn from "./img/finish_button.png";

const stickerSources = [
  { id: 1, src: racconImg, width: 90, height: 90, rotation: 0 },
  { id: 2, src: peachImg,  width: 90, height: 90, rotation: 0 },
  { id: 3, src: takoImg,   width: 90, height: 90, rotation: 0 },
  { id: 4, src: hamsterImg,width: 90, height: 90, rotation: 0 },
  { id: 5, src: bearImg,   width: 90, height: 90, rotation: 0 },
  { id: 6, src: duckImg,   width: 90, height: 90, rotation: 0 },
  { id: 7, src: cherryImg, width: 90, height: 90, rotation: 0 },
  { id: 8, src: orangeImg, width: 90, height: 90, rotation: 0 },
  { id: 9, src: limeImg,   width: 90, height: 90, rotation: 0 },
  { id: 10, src: appleImg, width: 90, height: 90, rotation: 0 },
  { id: 11, src: apple2Img,width: 90, height: 90, rotation: 0 },
];

export default function StickerResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const images = state?.images || [];
  const cuts = state?.cuts || images.length || 2;

  const [stickers, setStickers] = useState([]);
  const [activeStickerId, setActiveStickerId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const stickerFrameRef = useRef(null);
  const dragStartOffset = useRef({ x: 0, y: 0 });
  const resizeStartData = useRef(null);

  // 스티커 초기 위치 설정
  useEffect(() => {
    if (!stickerFrameRef.current) return;
    const frameRect = stickerFrameRef.current.getBoundingClientRect();
    const rightPanelStart = frameRect.width * 0.5 + 20;
    const stickersPerRow = 4;
    const horizontalSpacing = 100;
    const verticalSpacing = 100;
    const initialOffsetY = frameRect.height * 0.05;

    setStickers(stickerSources.map((s, index) => {
      const row = Math.floor(index / stickersPerRow);
      const col = index % stickersPerRow;
      return { ...s, x: rightPanelStart + (col * horizontalSpacing), y: initialOffsetY + (row * verticalSpacing) };
    }));
  }, []);

  // 마우스 이동 핸들러
  const handleMouseMove = (e) => {
    if (!activeStickerId) return;
    const frameRect = stickerFrameRef.current.getBoundingClientRect();
    const currentSticker = stickers.find(s => s.id === activeStickerId);

    if (isRotating) {
        const centerX = currentSticker.x + currentSticker.width / 2;
        const centerY = currentSticker.y + currentSticker.height / 2;
        const mouseX = e.clientX - frameRect.left;
        const mouseY = e.clientY - frameRect.top;
        const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
        setStickers(prev => prev.map(s => s.id === activeStickerId ? { ...s, rotation: angle - 90 } : s));

    } else if (isResizing) {
        const { startX, startY, startWidth, startHeight } = resizeStartData.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        setStickers(prev => prev.map(s => s.id === activeStickerId ? { ...s, width: Math.max(50, startWidth + dx), height: Math.max(50, startHeight + dy) } : s));
        
    } else if (isDragging) {
        const newX = e.clientX - frameRect.left - dragStartOffset.current.x;
        const newY = e.clientY - frameRect.top - dragStartOffset.current.y;
        setStickers(prev => prev.map(s => s.id === activeStickerId ? { ...s, x: newX, y: newY } : s));
    }
  };
  
  // 마우스 떼기
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  };
  
  // 스티커 몸통 클릭
  const handleStickerMouseDown = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveStickerId(id);
    setIsDragging(true);

    const sticker = stickers.find(s => s.id === id);
    const frameRect = stickerFrameRef.current.getBoundingClientRect();
    dragStartOffset.current = {
      x: e.clientX - frameRect.left - sticker.x,
      y: e.clientY - frameRect.top - sticker.y,
    };
  };

  // 크기 조절 핸들 클릭
  const handleResizeMouseDown = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveStickerId(id);
    setIsResizing(true);

    const sticker = stickers.find(s => s.id === id);
    resizeStartData.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: sticker.width,
      startHeight: sticker.height,
    };
  };

  // 회전 핸들 클릭
  const handleRotateMouseDown = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveStickerId(id);
    setIsRotating(true);
  };

  // 외부 클릭 감지하여 스티커 선택 해제
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (stickerFrameRef.current && !e.target.closest('.sticker-wrapper')) {
        setActiveStickerId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 마우스 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, isRotating, stickers]);

  const containerStyle = {
    backgroundImage: `url(${bgImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className="sticker-container" style={containerStyle}>
      <div className="sticker-frame" ref={stickerFrameRef}>
        <div className="photo-slot photo-slot-left">
          <div className={`photo-grid grid-${cuts}`}>
            {images.map((src, idx) => (<img key={idx} src={src} alt={`cut-${idx}`} className="user-photo" />))}
          </div>
        </div>
        <div className="right-panel"></div>
        {stickers.map(sticker => (
          <div
            key={sticker.id}
            className={`sticker-wrapper ${activeStickerId === sticker.id ? 'active' : ''}`}
            style={{
              transform: `translate(${sticker.x}px, ${sticker.y}px) rotate(${sticker.rotation}deg)`,
              width: `${sticker.width}px`,
              height: `${sticker.height}px`,
              cursor: 'grab',
            }}
            onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
          >
            <img src={sticker.src} className="sticker-image" alt="sticker" />
            {activeStickerId === sticker.id && (
              <>
                <div className="resize-handle" onMouseDown={(e) => handleResizeMouseDown(e, sticker.id)}></div>
                <div className="rotate-handle" onMouseDown={(e) => handleRotateMouseDown(e, sticker.id)}></div>
              </>
            )}
          </div>
        ))}
        <button className="finish-btn" onClick={() => navigate("/")}>
          <img src={finishBtn} alt="finish" />
        </button>
      </div>
    </div>
  );
}