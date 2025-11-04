import { useState, useEffect, useRef, useCallback } from 'react';

export function useStickerInteraction(initialStickers, stickerFrameRef) {
  const [stickers, setStickers] = useState([]);
  const [activeStickerId, setActiveStickerId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const dragStartOffset = useRef({ x: 0, y: 0 });
  const resizeStartData = useRef(null);
  // 복사본을 위한 새 ID 관리
  const nextStickerId = useRef(initialStickers.length + 1); 

  // 스티커 초기 위치 설정 (Y 좌표를 120 -> 50 으로 수정)
  useEffect(() => {
    if (!stickerFrameRef.current) return;
    
    const rightPanelStart = 560; 
    const stickersPerRow = 4;
    const horizontalSpacing = 100;
    const verticalSpacing = 100;
    const initialOffsetY = 50; // 120에서 50으로 줄여서 스티커 전체를 위로 올립니다.

    setStickers(initialStickers.map((s, index) => {
      const row = Math.floor(index / stickersPerRow);
      const col = index % stickersPerRow;
      const x = rightPanelStart + (col * horizontalSpacing) - 50; 
      const y = initialOffsetY + (row * verticalSpacing); 
      return { 
        ...s, 
        x, 
        y,
        width: s.width ?? 90,
        height: s.height ?? 90,
        rotation: s.rotation ?? 0,
        src: s.src ?? '',
      };
    }));
  }, [initialStickers, stickerFrameRef]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging && !isResizing && !isRotating) return;
    if (!activeStickerId || !stickerFrameRef.current) return;

    const frameRect = stickerFrameRef.current.getBoundingClientRect();
    const currentSticker = stickers.find(s => s.id === activeStickerId);
    
    if (!currentSticker) return; 

    if (isRotating) {
        const centerX = currentSticker.x + currentSticker.width / 2;
        const centerY = currentSticker.y + currentSticker.height / 2;
        const mouseX = e.clientX - frameRect.left;
        const mouseY = e.clientY - frameRect.top;
        const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
        setStickers(prev => prev.map(s => s.id === activeStickerId ? { ...s, rotation: angle + 90 } : s));
    } else if (isResizing) {
        if (!resizeStartData.current) return; 
        const { startX, startY, startWidth, startHeight } = resizeStartData.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        const sizeChange = Math.max(dx, dy); 
        setStickers(prev => prev.map(s => s.id === activeStickerId ? { 
            ...s, 
            width: Math.max(50, startWidth + sizeChange), 
            height: Math.max(50, startHeight + sizeChange) 
        } : s));
    } else if (isDragging) {
        const newX = e.clientX - frameRect.left - dragStartOffset.current.x;
        const newY = e.clientY - frameRect.top - dragStartOffset.current.y;
        setStickers(prev => prev.map(s => s.id === activeStickerId ? { ...s, x: newX, y: newY } : s));
    }

  }, [activeStickerId, isDragging, isResizing, isRotating, stickers, stickerFrameRef]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
  }, []);

  // 1. 스티커 복사 및 드래그 시작 처리 (이름 변경)
  const handleStickerClickAndDrag = (e, id) => {
    e.preventDefault();
    const stickerToOperate = stickers.find(s => s.id === id);
    if (!stickerToOperate) return;

    if (!stickerFrameRef.current) return; 
    const frameRect = stickerFrameRef.current.getBoundingClientRect();

    if (e.button === 0) { // 왼쪽 클릭
      if (stickerToOperate.isSource) {
        // [복사 로직]
        // 원본 스티커(isSource)를 클릭하면 복사본 생성
        const newSticker = {
          ...stickerToOperate,
          id: nextStickerId.current++, // 새 ID 할당
          isSource: false, // 복사본은 더 이상 소스가 아님
          x: stickerToOperate.x + 10, // 원본 옆에 약간 이동
          y: stickerToOperate.y + 10,
        };
        // 복사본을 스티커 목록에 추가 (원본은 그대로 둠)
        setStickers(prev => [...prev, newSticker]); 
        setActiveStickerId(newSticker.id);
        setIsDragging(true);

        // 복사된 새 스티커 기준으로 드래그 오프셋 설정
        dragStartOffset.current = {
          x: (e.clientX - frameRect.left) - newSticker.x,
          y: (e.clientY - frameRect.top) - newSticker.y,
        };
      } else {
        // [드래그 로직]
        // 이미 배치된 스티커를 클릭하면 활성화하고 드래그 시작
        setActiveStickerId(id);
        setIsDragging(true);
        dragStartOffset.current = {
          x: (e.clientX - frameRect.left) - stickerToOperate.x,
          y: (e.clientY - frameRect.top) - stickerToOperate.y,
        };
      }
    }
  };

  // 3. 더블 클릭 삭제 처리
  const handleStickerDoubleClick = (e, id) => {
    e.stopPropagation();
    const stickerToDelete = stickers.find(s => s.id === id);
    // 원본 스티커(isSource: true)는 삭제하지 않음
    if (stickerToDelete && !stickerToDelete.isSource) {
      setStickers(prev => prev.filter(s => s.id !== id));
      setActiveStickerId(null);
    }
  };

  // 크기 조절 핸들 클릭
  const handleResizeMouseDown = (e, id) => {
    e.preventDefault();
    e.stopPropagation(); 
    setActiveStickerId(id);
    setIsResizing(true);

    if (!stickerFrameRef.current) return; 
    const sticker = stickers.find(s => s.id === id);
    if (!sticker) return; 
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

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e) => {
      // .sticker-wrapper 내부가 아니면 비활성화
      if (stickerFrameRef.current && !e.target.closest('.sticker-wrapper')) {
        setActiveStickerId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [stickerFrameRef]);
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return { 
    stickers, 
    activeStickerId,
    setActiveStickerId,
    handleStickerClickAndDrag, // 이름 변경
    handleStickerDoubleClick,  // 더블 클릭 핸들러 추가
    handleResizeMouseDown, 
    handleRotateMouseDown 
  };
}
