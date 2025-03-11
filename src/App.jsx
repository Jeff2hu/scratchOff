import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [scratchedPercentage, setScratchedPercentage] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new Image();

    // 設置畫布大小
    canvas.width = 300;
    canvas.height = 200;

    image.onload = () => {
      // 先繪製底層圖片
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      // 在上層繪製灰色遮罩
      context.fillStyle = "#CCCCCC";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // 設置刮刮樂效果
      context.globalCompositeOperation = "destination-out";
      context.lineWidth = 20;
      context.lineCap = "round";
      context.lineJoin = "round";

      setCtx(context);
    };

    image.src = "/test.jpg";
  }, []);

  const calculateScratchedPercentage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    // 每4個值代表一個像素(r,g,b,a)
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        // 完全透明的像素
        transparentPixels++;
      }
    }

    const totalPixels = canvas.width * canvas.height;
    const percentage = (transparentPixels / totalPixels) * 100;

    setScratchedPercentage(percentage);

    // 如果刮開超過30%，顯示完整圖片
    if (percentage > 30) {
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, canvas.width, canvas.height);
      const image = new Image();
      image.onload = () => {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
      image.src = "/test.jpg";
    }
  };

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
    calculateScratchedPercentage();
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
      <p>已刮開面積: {scratchedPercentage.toFixed(1)}%</p>
    </div>
  );
}

export default App;
