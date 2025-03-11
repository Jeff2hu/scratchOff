import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // 設置畫布大小
    canvas.width = 300;
    canvas.height = 200;

    // 繪製灰色背景
    context.fillStyle = "#CCCCCC";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 繪製文字
    context.fillStyle = "#000000";
    context.font = "bold 24px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("恭喜中獎！", canvas.width / 2, canvas.height / 2);

    // 設置刮刮樂效果
    context.globalCompositeOperation = "destination-out";
    context.lineWidth = 20;
    context.lineCap = "round";
    context.lineJoin = "round";

    setCtx(context);
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    ctx.closePath();
    setIsDrawing(false);
  };

  return (
    <div className="scratch-card-container">
      <h1>刮刮樂卡片</h1>
      <div className="card">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
      </div>
    </div>
  );
}

export default App;
