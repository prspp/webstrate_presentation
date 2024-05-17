document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('contentIframe');
    const getIframeDocument = () => iframe.contentDocument || iframe.contentWindow.document;
    const addContentZoneBtn = document.getElementById('addContentZoneBtn');
    const addTextBoxBtn = document.getElementById('addTextBoxBtn');
    const addImageBtn = document.getElementById('addImageBtn');
    const toggleDrawingModeBtn = document.getElementById('toggleDrawingModeBtn');

    let currentZIndex = 1;
    let isDrawing = false;
    let isDrawingMode = false;

    iframe.addEventListener('load', () => {

        let currentContentZone = getIframeDocument().getElementById('content-zone-0');
        console.log(getIframeDocument())

        getIframeDocument().ondragstart = (e => {
     if (e.target.nodeName.toUpperCase() == "IMG") {
         return false;
     }
});

        const selectContentZone = (event) => {
            if (event.target.classList.contains('content-zone')) {
                currentContentZone = event.target;
            } else if (event.target.parentElement.classList.contains('content-zone')) {
                currentContentZone = event.target.parentElement;
            }
        };

        const addContentZone = () => {
            const doc = getIframeDocument();
            const container = doc.getElementById('container');
            const newContentZone = doc.createElement('div');
            const newCanvas = doc.createElement('canvas');
            newCanvas.className = 'drawing-canvas';
            newCanvas.width = 800;
            newCanvas.height = 600;
            newContentZone.className = 'content-zone';
            newContentZone.appendChild(newCanvas);
            container.appendChild(newContentZone);
            newContentZone.addEventListener('mousedown', selectContentZone);
            setupCanvasEvents(newCanvas);
        };

        const addTextBox = () => {
            console.log(currentContentZone)
            if (!currentContentZone) return;
            const doc = getIframeDocument();
            const textBox = doc.createElement('div');
            textBox.className = 'text-box';
            textBox.style.top = '50px';
            textBox.style.left = '50px';
            textBox.contentEditable = true;
            textBox.style.zIndex = currentZIndex++;
            currentContentZone.appendChild(textBox);
            setupDragEvents(textBox);
        };

        const addImage = () => {
            if (!currentContentZone) return;
            const imageUrl = prompt("Enter image URL:");
            if (imageUrl) {
                const doc = getIframeDocument();
                const imageBox = doc.createElement('img');
                imageBox.src = imageUrl;
                imageBox.className = 'image-box';
                imageBox.style.top = '50px';
                imageBox.style.left = '50px';
                imageBox.style.width = '200px'; // Change width as desired
                imageBox.style.zIndex = currentZIndex++;
                currentContentZone.appendChild(imageBox);
                setupDragEvents(imageBox);
            }
        };



        const setupCanvasEvents = (canvas) => {
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseleave', stopDrawing);
        };

        const setupDragEvents = (element) => {
            element.addEventListener('mousedown', (event) => {
                const handleMouseMove = (event) => {
                    const current_left = event.clientX - currentContentZone.getBoundingClientRect().left;
                    const current_top = event.clientY - currentContentZone.getBoundingClientRect().top;
                    const rec = element.getBoundingClientRect();
                    if (0 < current_left && current_left + rec.width < currentContentZone.getBoundingClientRect().width &&
                        0 < current_top && current_top + rec.height < currentContentZone.getBoundingClientRect().height) {
                        element.style.left = current_left + 'px';
                        element.style.top = current_top + 'px';
                    }
                };
                const handleMouseUp = () => {
                    getIframeDocument().removeEventListener('mousemove', handleMouseMove);
                    getIframeDocument().removeEventListener('mouseup', handleMouseUp);
                };
                getIframeDocument().addEventListener('mousemove', handleMouseMove);
                getIframeDocument().addEventListener('mouseup', handleMouseUp);
            });
        };


    const drawingModeIndicator = document.getElementById('drawingModeIndicator');
    const changeBrushColorBtn = document.getElementById('changeBrushColorBtn');
    const changeBrushThicknessBtn = document.getElementById('changeBrushThicknessBtn');

    let brushColor = '#000000'; // Default color
    let brushThickness = 2; // Default thickness

    const toggleDrawingMode = () => {
        if (!currentContentZone) return;
        isDrawingMode = !isDrawingMode;
        drawingModeIndicator.style.visibility = isDrawingMode ? 'visible' : 'hidden'; // Show/hide indicator
        const canvas = currentContentZone.querySelector('.drawing-canvas');
        canvas.style.zIndex = isDrawingMode ? currentZIndex++ : 0;
        if (isDrawingMode) {
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing);
            canvas.addEventListener('mouseleave', stopDrawing);
        } else {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mouseleave', stopDrawing);
        }
    };

    const startDrawing = (event) => {
        if (!isDrawingMode) return;
        isDrawing = true;
        const canvas = event.target;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushThickness;
        ctx.moveTo(event.offsetX, event.offsetY);
    };

    const draw = (event) => {
        if (!isDrawing) return;
        const canvas = event.target;
        const ctx = canvas.getContext('2d');
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        isDrawing = false;
    };

    const changeBrushColor = () => {
        const newColor = prompt("Enter new brush color (CSS color value):", brushColor);
        if (newColor) {
            brushColor = newColor;
        }
    };

    const changeBrushThickness = () => {
        const newThickness = prompt("Enter new brush thickness (number):", brushThickness);
        if (newThickness && !isNaN(newThickness)) {
            brushThickness = parseInt(newThickness, 10);
        }
    };

    changeBrushColorBtn.addEventListener('click', changeBrushColor);
    changeBrushThicknessBtn.addEventListener('click', changeBrushThickness);
    toggleDrawingModeBtn.addEventListener('click', toggleDrawingMode);



        iframe.addEventListener('load', () => {
            const doc = getIframeDocument();
            doc.querySelectorAll('.content-zone').forEach(zone => {
                zone.addEventListener('mousedown', selectContentZone);
                zone.querySelectorAll('.drawing-canvas').forEach(canvas => setupCanvasEvents(canvas));
            });
        });

        addContentZoneBtn.addEventListener('click', addContentZone);
        addTextBoxBtn.addEventListener('click', addTextBox);
        addImageBtn.addEventListener('click', addImage);
        toggleDrawingModeBtn.addEventListener('click', toggleDrawingMode);

    });
});
