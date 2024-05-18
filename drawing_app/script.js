document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const cursorNickname = document.getElementById('cursorNickname');
    let drawing = false;
    let erasing = false;
    let nickname = '';
    let currentColor = '#000000';
    let animationInterval;

    canvas.width = 800;
    canvas.height = 600;

    // Nickname setup
    document.getElementById('setNickname').addEventListener('click', () => {
        nickname = document.getElementById('nicknameInput').value;
        document.getElementById('nickname').style.display = 'none';
        cursorNickname.style.display = 'block';
    });

    // Tools setup
    document.getElementById('pencil').addEventListener('click', () => {
        erasing = false;
    });

    document.getElementById('eraser').addEventListener('click', () => {
        erasing = true;
    });

    // Drawing setup
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    function startDrawing(event) {
        drawing = true;
        ctx.beginPath();
        draw(event); // Start drawing immediately
    }

    function stopDrawing() {
        drawing = false;
        ctx.beginPath(); // Reset the context state
    }

    function draw(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        if (!drawing) {
            cursorNickname.style.left = `${x + 15}px`;
            cursorNickname.style.top = `${y - 15}px`;
            cursorNickname.textContent = nickname;
            return;
        }

        ctx.lineWidth = brushSize.value;
        ctx.lineCap = 'round';

        if (erasing) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = currentColor;
        }

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);

        cursorNickname.style.left = `${x + 15}px`;
        cursorNickname.style.top = `${y - 15}px`;
        cursorNickname.textContent = nickname;
    }

    // Color palette setup
    const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#800000', '#808000', '#008080', '#800080', '#FFA500', '#A52A2A', '#8A2BE2', '#DEB887', '#5F9EA0'];
    const colorPalette = document.getElementById('colorPalette');

    colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.addEventListener('click', () => {
            currentColor = color;
            colorPicker.value = color;
        });
        colorPalette.appendChild(swatch);
    });

    // Timeline setup
    const framesContainer = document.getElementById('framesContainer');
    let frames = [];
    let currentFrameIndex = 0;

    document.getElementById('addFrame').addEventListener('click', () => {
        addFrame();
    });

    document.getElementById('playAnimation').addEventListener('click', () => {
        playAnimation();
    });

    document.getElementById('stopAnimation').addEventListener('click', () => {
        stopAnimation();
    });

    function addFrame() {
        const frameCanvas = document.createElement('canvas');
        frameCanvas.width = 800;
        frameCanvas.height = 600;
        const frameCtx = frameCanvas.getContext('2d');
        frameCtx.drawImage(canvas, 0, 0); // Copying with original size to avoid jaggies
        frames.push(frameCanvas);
        updateFramesContainer();
    }

    function updateFramesContainer() {
        framesContainer.innerHTML = '';
        frames.forEach((frame, index) => {
            const frameElement = document.createElement('div');
            frameElement.className = 'frame';
            const frameThumbnail = document.createElement('canvas');
            frameThumbnail.width = 50;
            frameThumbnail.height = 50;
            const frameThumbnailCtx = frameThumbnail.getContext('2d');
            frameThumbnailCtx.drawImage(frame, 0, 0, 50, 50);
            frameElement.appendChild(frameThumbnail);
            frameElement.addEventListener('click', () => {
                currentFrameIndex = index;
                loadFrame(index);
            });
            framesContainer.appendChild(frameElement);
        });
    }

    function loadFrame(index) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frames[index], 0, 0, canvas.width, canvas.height);
    }

    function playAnimation() {
        let frameIndex = 0;
        if (animationInterval) clearInterval(animationInterval);
        animationInterval = setInterval(() => {
            if (frameIndex >= frames.length) {
                frameIndex = 0; // Loop back to the first frame
            }
            loadFrame(frameIndex);
            frameIndex++;
        }, 500);
    }

    function stopAnimation() {
        if (animationInterval) clearInterval(animationInterval);
    }
});
