import React, { useRef, useState, useEffect } from "react";
import NoteHeader from "./NoteHeader";

interface Props {
  src: string;
  onClose: () => void;
}

export default function ResizableDraggableIframe({ src, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  // Responsive: Set size/position based on window size (only on mount & resize)
  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w < 500) {
        setSize({ width: w * 0.96, height: h * 0.80 });
        setPosition({ x: w * 0.02, y: h * 0.10 });
      } else if (w < 900) {
        setSize({ width: w * 0.92, height: h * 0.80 });
        setPosition({ x: w * 0.04, y: h * 0.10 });
      } else {
        setSize({ width: 800, height: 600 });
        setPosition({ x: 50, y: 50 });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  // Start resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResizing(true);
    // Prevent iframe stealing mouse events
    document.body.style.userSelect = "none";
  };

  // Handle mouse move for drag/resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setPosition((prev) => {
          const x = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - offset.current.x));
          const y = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - offset.current.y));
          return { x, y };
        });
      } else if (resizing) {
        setSize((prev) => {
          const minWidth = 260, minHeight = 180;
          let width = Math.max(minWidth, e.clientX - (position.x));
          let height = Math.max(minHeight, e.clientY - (position.y));
          width = Math.min(width, window.innerWidth - position.x);
          height = Math.min(height, window.innerHeight - position.y);
          return { width, height };
        });
      }
    };
    const handleMouseUp = () => {
      setDragging(false);
      setResizing(false);
      document.body.style.userSelect = ""; // re-enable text selection
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, resizing, size.width, size.height, position.x, position.y]);

  // Load note title from session (optional)
  const session = sessionStorage.getItem("note_session");
  const noteData = session ? JSON.parse(session) : {};
  const title = noteData?.title || "My Note";

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        maxWidth: "98vw",
        maxHeight: "95vh",
        minWidth: 260,
        minHeight: 180,
        zIndex: 1000,
        background: "#fff",
        boxShadow: "0 4px 24px rgba(60,30,130,0.18)",
        borderRadius: "14px",
        overflow: "hidden",
        resize: "none",
        border: "1.5px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        padding: 0,
      }}
    >
      <NoteHeader
        title={title}
        onClose={onClose}
        onResize={() => setResizing(true)}
        onDragStart={handleMouseDown}
      />

      <iframe
        src={src}
        title="Notes Widget"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          flexGrow: 1,
          background: "#f9fafb",
        }}
      />

      {/* Resize handle in the bottom-right corner */}
      <div
        onMouseDown={handleResizeMouseDown}
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
          width: 16,
          height: 16,
          cursor: "nwse-resize",
          background: "rgba(160,160,180,0.15)",
          borderBottomRightRadius: "12px",
          zIndex: 10,
        }}
      />
    </div>
  );
}
