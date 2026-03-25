'use client';

import React, { useRef } from 'react';

interface DraggableProps {
  children: React.ReactNode;
  targetRef: React.RefObject<HTMLDivElement | null>;
  onDragEnd: (x: number, y: number) => void;
  initialPos: { x: number; y: number };
  className?: string;
  disabled?: boolean;
}

export function Draggable({ children, targetRef, onDragEnd, initialPos, className, disabled }: DraggableProps) {
  const isDragging = useRef(false);
  const offset = useRef({ x: initialPos.x, y: initialPos.y });
  const startMousePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || e.button !== 0) return;

    isDragging.current = true;
    startMousePos.current = { x: e.clientX, y: e.clientY };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !targetRef.current) return;

    const dx = e.clientX - startMousePos.current.x;
    const dy = e.clientY - startMousePos.current.y;

    const newX = offset.current.x + dx;
    const newY = offset.current.y + dy;

    targetRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging.current) return;

    const dx = e.clientX - startMousePos.current.x;
    const dy = e.clientY - startMousePos.current.y;

    offset.current = {
      x: offset.current.x + dx,
      y: offset.current.y + dy
    };

    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);


    document.body.style.cursor = '';

    document.body.style.userSelect = '';


    onDragEnd(offset.current.x, offset.current.y);
  };

  return (
    <div onMouseDown={handleMouseDown} className={className}>
      {children}
    </div>
  );
}