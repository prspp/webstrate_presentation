// document.addEventListener("DOMContentLoaded", () => {
setTimeout( () => {
  console.log("Script loaded.")
  const iframe = document.getElementById("contentIframe");
  const getIframeDocument = (i) =>
    i.contentDocument || i.contentWindow.document;

  const addContentZoneBtn = document.getElementById("addContentZoneBtn");
  const addTextBoxBtn = document.getElementById("addTextBoxBtn");
  const addImageBtn = document.getElementById("addImageBtn");
  const toggleDrawingModeBtn = document.getElementById("toggleDrawingModeBtn");
  const drawingModeIndicator = document.getElementById(
  "drawingModeIndicator",
);
  const brushColorPicker = document.getElementById("brushColorPicker");
  const brushThicknessSlider = document.getElementById(
    "brushThicknessSlider",
  );
  const fontSizeInput = document.getElementById("fontSizeInput");
  const documentUrlInput = document.getElementById("documentUrlInput");
  const loadButton = document.getElementById("loadButton");
  const default_ws = "/frontpage";

  if (documentUrlInput.value) {
    iframe.src = documentUrlInput.value;
  } else {
    iframe.src = default_ws;
    documentUrlInput.value = default_ws;
  }

  function debounce(callback, wait) {
    let timeout;
    return (...args) => {
        console.log("wait", wait)
        clearTimeout(timeout);
        timeout = setTimeout(function () { callback.apply(this, args); }, wait);
    };
  }

  // documentUrlInput.addEventListener("keyup", debounce( (event) => {
  //   iframe.src = event.target.value || default_ws;
  //   // getIframeDocument(iframe).location.reload();
  //   console.log("reload asked")
  // }), 1000);

  loadButton.addEventListener("click", (event) => {
    iframe.src = documentUrlInput.value || default_ws;
    // getIframeDocument(iframe).location.reload();
    console.log("reload asked")
   })


  iframe.addEventListener("load", () => {
    console.log("iframe load event")
    let brushColor = "#000000"; // Default color
    let brushThickness = 2; // Default thickness
    let fontSize = 16; // Default font size
    let webstrateUrl = "";

    let currentZIndex = 1;
    let isDrawing = false;
    let isDrawingMode = false;

    let currentContentZone = null;

    const getContainer = () => {
      return getIframeDocument(iframe).getElementById("container");
    }

    const initContainer = () => {
      if (getContainer() !== null)
        return;
      let doc = getIframeDocument(iframe);
      const container = doc.createElement("div");
      container.id = "container"
      doc.body.appendChild(container);
    }

    const getMainCSSFile = () => {
      return getIframeDocument(iframe).getElementById("mainCSSFile");
    }

    // const initCSS = () => {
    //   if (getMainCSSFile() !== null)
    //     return;
    //   let doc = getIframeDocument(iframe);
    //   var fileref = doc.createElement("link");
    //   fileref.id = "mainCSSFile"
    //   fileref.rel = "stylesheet";
    //   fileref.type = "text/css";
    //   fileref.href = "/styles.css"; // no trailing slashs
    //   doc.getElementsByTagName("head")[0].appendChild(fileref)
    // }

    const initCSS = () => {
      if (getMainCSSFile() !== null)
        return;
      let doc = getIframeDocument(iframe);
      var fileref = doc.createElement("style");
      fileref.id = "mainCSSFile"
      fileref.textContent = document.getElementById("styles.css").textContent;
      doc.getElementsByTagName("head")[0].appendChild(fileref)
    }


    getIframeDocument(iframe).ondragstart = (e) => {
      if (e.target.nodeName.toUpperCase() == "IMG") {
        return false;
      }
    };

    const initCurrentContentZone = () => {
      const doc = getIframeDocument(iframe);
      doc.querySelectorAll(".selected").forEach((e) => {e.classList.remove("selected")});
      const czs = doc.querySelectorAll(".content-zone");
      if (czs.length > 0) {
        setCurrentContentZone(czs[0]);
      } else {
        initBlankContentZone();
      }
    }

    const initExistingContentZones = () => {
      const doc = getIframeDocument(iframe);
      doc.querySelectorAll(".content-zone").forEach((zone) => {
        zone.addEventListener("mousedown", selectContentZone);
        // zone
        //   .querySelectorAll(".drawing-canvas")
        //   .forEach((canvas) => setupCanvasEvents(canvas));
      });
      doc.querySelectorAll(".text-box, .image-box").forEach((box) => {
        setupDragEvents(box);
      });

    }

    const initBlankContentZone = () => {
        setCurrentContentZone(addContentZone());
    }

    const setCurrentContentZone = (zone) => {
        // console.log("test")
        // console.log(currentContentZone)
        // currentContentZone;
        // updating the old content zone if it is not null
        if (currentContentZone !== null) currentContentZone.classList.remove("selected");
        
        // actually updating the variable currentContentZone with the parameter of this function
        currentContentZone = zone;

        // if the parameter passed was not null, then adds the .selected class to it
        if (currentContentZone !== null) currentContentZone.classList.add("selected");
    }
    const selectContentZone = (event) => {
      if (event.target.classList.contains("content-zone")) {
        setCurrentContentZone(event.target);
      } else if (
        event.target.parentElement.classList.contains("content-zone")
      ) {
        setCurrentContentZone(event.target.parentElement);
      }
    };

    function resetContentZones() {
      getIframeDocument(iframe).body.innerHTML = "";
      initContainer();
      initBlankContentZone();
    }

    const resetContentZonesBtn = document.getElementById(
      "resetContentZonesBtn",
    );
    resetContentZonesBtn.addEventListener("click", resetContentZones);

    const addContentZone = () => {
      const doc = getIframeDocument(iframe);
      // console.log(doc.location)
      const container = getContainer();
      const newContentZone = doc.createElement("div");
      const newCanvas = doc.createElement("canvas");
      newContentZone.appendChild(newCanvas);
      container.appendChild(newContentZone);
      newCanvas.className = "drawing-canvas";
      newContentZone.className = "content-zone";
      newCanvas.width = newContentZone.offsetWidth;
      newCanvas.height = newContentZone.offsetHeight;
      newContentZone.addEventListener("mousedown", selectContentZone);
      setupCanvasEvents(newCanvas);
      return newContentZone;
    };

    const addTextBox = () => {
      if (!currentContentZone) return;
      const doc = getIframeDocument(iframe);
      const textBox = doc.createElement("div");
      textBox.className = "text-box";
      textBox.contentEditable = true;
      textBox.style.zIndex = currentZIndex++;
      textBox.style.fontSize = `${fontSize}px`; // Apply the current font size
      textBox.focus();
      setupDragEvents(textBox);
      currentContentZone.appendChild(textBox);
    };

    const addImage = () => {
      if (!currentContentZone) return;
      const imageUrl = prompt("Enter image URL:");
      if (imageUrl) {
        const doc = getIframeDocument(iframe);
        const imageBox = doc.createElement("img");
        imageBox.src = imageUrl;
        imageBox.className = "image-box";
        imageBox.style.width = "200px"; // Change width as desired
        imageBox.style.zIndex = currentZIndex++;
        setupDragEvents(imageBox);
        currentContentZone.appendChild(imageBox);
      }
    };

    const setupCanvasEvents = (canvas) => {
      // canvas.addEventListener("mousedown", startDrawing);
      // canvas.addEventListener("mousemove", draw);
      // canvas.addEventListener("mouseup", stopDrawing);
      // canvas.addEventListener("mouseleave", stopDrawing);
    };

    const setupDragEvents = (element) => {
      element.addEventListener("mousedown", (event) => {
        const handleMouseMove = (event) => {
          const current_left =
            event.clientX - currentContentZone.getBoundingClientRect().left;
          const current_top =
            event.clientY - currentContentZone.getBoundingClientRect().top;
          const rec = element.getBoundingClientRect();
          if (
            0 < current_left &&
            current_left + rec.width <
              currentContentZone.getBoundingClientRect().width &&
            0 < current_top &&
            current_top + rec.height <
              currentContentZone.getBoundingClientRect().height
          ) {
            element.style.left = current_left + "px";
            element.style.top = current_top + "px";
          }
        };
        const handleMouseUp = () => {
          getIframeDocument(iframe).removeEventListener("mousemove", handleMouseMove);
          getIframeDocument(iframe).removeEventListener("mouseup", handleMouseUp);
        };
        getIframeDocument(iframe).addEventListener("mousemove", handleMouseMove);
        getIframeDocument(iframe).addEventListener("mouseup", handleMouseUp);
      });
    };



    const toggleDrawingMode = () => {
      if (!currentContentZone) return;
      isDrawingMode = !isDrawingMode;
      drawingModeIndicator.style.visibility = isDrawingMode
        ? "visible"
        : "hidden"; // Show/hide indicator
      const canvas = currentContentZone.querySelector(".drawing-canvas");
      canvas.style.zIndex = isDrawingMode ? currentZIndex++ : 0;
      if (isDrawingMode) {
        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mousemove", draw);
        canvas.addEventListener("mouseup", stopDrawing);
        canvas.addEventListener("mouseleave", stopDrawing);
      } else {
        canvas.removeEventListener("mousedown", startDrawing);
        canvas.removeEventListener("mousemove", draw);
        canvas.removeEventListener("mouseup", stopDrawing);
        canvas.removeEventListener("mouseleave", stopDrawing);
      }
    };

    const startDrawing = (event) => {
      if (!isDrawingMode) return;
      isDrawing = true;
      const canvas = event.target;
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushThickness;
      ctx.moveTo(event.offsetX, event.offsetY);
    };

    const draw = (event) => {
      if (!isDrawing) return;
      const canvas = event.target;
      const ctx = canvas.getContext("2d");
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    const changeBrushColor = () => {
      const newColor = prompt(
        "Enter new brush color (CSS color value):",
        brushColor,
      );
      if (newColor) {
        brushColor = newColor;
      }
    };

    const changeBrushThickness = () => {
      const newThickness = prompt(
        "Enter new brush thickness (number):",
        brushThickness,
      );
      if (newThickness && !isNaN(newThickness)) {
        brushThickness = parseInt(newThickness, 10);
      }
    };

    brushColorPicker.addEventListener("input", (event) => {
      brushColor = event.target.value;
    });
    brushThicknessSlider.addEventListener("input", (event) => {
      brushThickness = event.target.value;
    });
    toggleDrawingModeBtn.addEventListener("click", toggleDrawingMode);

    fontSizeInput.addEventListener("input", (event) => {
      fontSize = event.target.value;
      if (currentContentZone) {
        const element = getIframeDocument(iframe).activeElement;
        if (element.classList.contains("text-box")) {
          element.style.fontSize = `${fontSize}px`;
        }
      }
    });


    addContentZoneBtn.addEventListener("click", addContentZone);
    addTextBoxBtn.addEventListener("click", addTextBox);
    addImageBtn.addEventListener("click", addImage);
    toggleDrawingModeBtn.addEventListener("click", toggleDrawingMode);

    const initIframe = async () => {
        // Wait webstrate to load
        await new Promise(r => setTimeout(r, 2000));
        initCSS();
        initContainer();
        initCurrentContentZone();
        initExistingContentZones();
        console.log(getIframeDocument(iframe));
        console.log(getIframeDocument(iframe).location);
        // console.log(getIframeDocument(iframe).body.innerHTML);


    }
    initIframe();

  });
}, 1000);
