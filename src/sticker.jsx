import React from "react";
import "./sticker.css"; 

export default function Sticker({ 
  sticker, 
  isActive, 
  onInteractionStart,
  onResizeStart, 
  onRotateStart,
  onDoubleClick // 더블 클릭 핸들러 추가
}) {
  if (!sticker) return null;

  const x = Number.isFinite(sticker.x) ? sticker.x : 0;
  const y = Number.isFinite(sticker.y) ? sticker.y : 0;
  const rotation = Number.isFinite(sticker.rotation) ? sticker.rotation : 0;
  const width = Number.isFinite(sticker.width) ? sticker.width : 90;
  const height = Number.isFinite(sticker.height) ? sticker.height : 90;
  const src = sticker.src || '';
  
  // 원본 스티커인지 (오른쪽 패널에 있는지) 확인
  const isSource = sticker.isSource || false;

  return (
    <div
      className={`sticker-wrapper ${isActive ? 'active' : ''} ${isSource ? 'source' : ''}`}
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        width: `${width}px`,
        height: `${height}px`,
        // 원본 스티커는 복사 커서, 배치된 스티커는 잡기 커서
        cursor: isSource ? 'copy' : 'grab', 
        // 원본 스티커는 z-index를 낮춰서 배치된 스티커 뒤로 가게 함
        zIndex: isSource ? 5 : 10, 
      }}
      onMouseDown={(e) => {
        e.stopPropagation(); 
        // 클릭/드래그 시작 이벤트 전달
        onInteractionStart && onInteractionStart(e, sticker.id);
      }}
      onDoubleClick={(e) => {
        // 원본 스티커가 아닐 때만 더블 클릭 이벤트(삭제) 전달
        if (!isSource) {
            onDoubleClick && onDoubleClick(e, sticker.id);
        }
      }}
    >
      <img src={src} className="sticker-image" alt="sticker" />
      
      {/* 활성화 상태이고, 원본 스티커가 아닐 때만 핸들 표시 */}
      {isActive && !isSource && ( 
        <>
          <div 
            className="resize-handle" 
            onMouseDown={(e) => {
              e.stopPropagation();
              onResizeStart && onResizeStart(e, sticker.id);
            }}
          ></div>
          <div 
            className="rotate-handle" 
            onMouseDown={(e) => {
              e.stopPropagation();
              onRotateStart && onRotateStart(e, sticker.id);
            }}
          ></div>
        </>
      )}
    </div>
  );
}