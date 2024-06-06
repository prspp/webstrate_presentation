// document.addEventListener("DOMContentLoaded", () => {
webstrate.on("loaded", function (webstrateId, clientId, user) {
  console.log("Script loaded.")

  // ### REFERENCES TO DOM ELEMENTS ##
  const mainIframe = document.getElementById("contentIframe")
  const getIframeDocument = (i) => i.contentDocument || i.contentWindow.document

  const addSlideBtn = document.getElementById("addSlideBtn")
  const addTextBoxBtn = document.getElementById("addTextBoxBtn")
  const addImageBtn = document.getElementById("addImageBtn")
  const toggleDrawingModeBtn = document.getElementById("toggleDrawingModeBtn")
  const drawingModeIndicator = document.getElementById("drawingModeIndicator")
  const resetSlidesBtn = document.getElementById("resetSlidesBtn")
  const brushColorPicker = document.getElementById("brushColorPicker")
  const brushThicknessSlider = document.getElementById("brushThicknessSlider")
  const fontSizeInput = document.getElementById("fontSizeInput")
  const documentUrlInput = document.getElementById("documentUrlInput")
  const loadButton = document.getElementById("loadButton")

  const containerOfAllPreviews = document.getElementById(
    "containerOfAllPreviews"
  )

  // ### VALUES OF THE APPLICATION ###
  let defaultWebstrateUrl,
    NSlide,
    currentDrawing,
    currentPath,
    path,
    brushColor,
    brushThickness,
    fontSize,
    webstrateUrl,
    currentZIndex,
    isDrawing,
    isDrawingMode,
    currentSlide,
    currentPreview,
    currentSlideIndex

  // PARAMETERS OF THE EDITOR
  isDrawing = false
  isDrawingMode = false
  brushColor = "#000000" // Default color
  brushThickness = 2 // Default thickness
  fontSize = 16 // Default font size
  webstrateUrl = ""
  defaultWebstrateUrl = "/frontpage"

  // PARAMETERS OF THE EDITED CONTENT
  function initCurrentContentParameters() {
    currentZIndex = 1
    currentSlide = null
    currentPreview = null
    currentSlideIndex = null
    NSlide = 0
    currentDrawing = null
    currentPath = ""
    path = null
  }
  initCurrentContentParameters();

  if (documentUrlInput.value) {
    mainIframe.src = documentUrlInput.value
  } else {
    mainIframe.src = defaultWebstrateUrl
    documentUrlInput.value = defaultWebstrateUrl
  }

  function debounce(callback, wait) {
    let timeout
    return (...args) => {
      console.log("wait", wait)
      clearTimeout(timeout)
      timeout = setTimeout(function () {
        callback.apply(this, args)
      }, wait)
    }
  }

  // documentUrlInput.addEventListener("keyup", debounce( (event) => {
  //   mainIframe.src = event.target.value || defaultWebstrateUrl;
  //   // getIframeDocument(mainIframe).location.reload();
  //   console.log("reload asked")
  // }), 1000);

  loadButton.addEventListener("click", (event) => {
    mainIframe.src = documentUrlInput.value || defaultWebstrateUrl
    // getIframeDocument(mainIframe).location.reload();
    console.log("reload asked")
  })

  mainIframe.webstrate.on(
    "transcluded",
    function (webstrateId, clientId, user) {
      console.log("mainIframe load event")
      let brushColor = "#000000" // Default color
      let brushThickness = 2 // Default thickness
      let fontSize = 16 // Default font size
      let webstrateUrl = ""

      let currentZIndex = 1
      let isDrawing = false
      let isDrawingMode = false

      let currentSlide = null
      let currentDrawing = null

      const getContainer = () => {
        return getIframeDocument(mainIframe).body
      }

      const initContainer = () => {
        if (getContainer() !== null) return
        let doc = getIframeDocument(mainIframe)
        const container = doc.createElement("body")
        doc.appendChild(container)
      }

      const getMainCSSFile = () => {
        return getIframeDocument(mainIframe).getElementById(
          "mainCSSFile"
        )
      }

      // const initCSS = () => {
      //   if (getMainCSSFile() !== null)
      //     return;
      //   let doc = getIframeDocument(mainIframe);
      //   var fileref = doc.createElement("link");
      //   fileref.id = "mainCSSFile"
      //   fileref.rel = "stylesheet";
      //   fileref.type = "text/css";
      //   fileref.href = "/styles.css"; // no trailing slashs
      //   doc.getElementsByTagName("head")[0].appendChild(fileref)
      // }

      const initCSS = () => {
        if (getMainCSSFile() !== null) return
        let doc = getIframeDocument(mainIframe)
        var fileref = doc.createElement("style")
        fileref.id = "mainCSSFile"
        fileref.textContent = document.getElementById("styles.css").textContent
        doc.getElementsByTagName("head")[0].appendChild(fileref)
      }

      getIframeDocument(mainIframe).ondragstart = (e) => {
        if (e.target.nodeName.toUpperCase() == "IMG") {
          return false
        }
      }

      const initCurrentSlide = () => {
        const doc = getIframeDocument(mainIframe)
        const czs = doc.querySelectorAll(".slide")
        console.log(czs)
        if (czs.length > 0) {
          setCurrentState(0)
        } else {
          initBlankSlide()
        }
      }

      const initExistingSlides = () => {
        const doc = getIframeDocument(mainIframe)
        doc.querySelectorAll(".slide").forEach((zone) => {
          // zone.addEventListener("mousedown", selectSlide)
          addPreviewSlide(zone.getAttribute("index"))
        })
        doc.querySelectorAll(".text-box, .image-box").forEach((box) => {
          setupDragEvents(box)
        })
      }

      const initBlankSlide = () => {
        setCurrentState(addSlide())
      }

      const setCurrentSlide = (zone) => {
        if (currentSlide === zone) return
        // updating the old content zone if it is not null
        if (currentSlide !== null) currentSlide.classList.remove("selected")

        // actually updating the variable currentSlide with the parameter of this function
        currentSlide = zone
        currentDrawing = zone.querySelector(".drawing-canvas")
        currentPath = ""

        // if the parameter passed was not null, then adds the .selected class to it
        if (currentSlide !== null) currentSlide.classList.add("selected")
      }

      const setCurrentState = (newIndex) => {
        // console.log(newIndex, currentSlideIndex)
        if (currentSlideIndex === newIndex) return

        // updating the old content zone if it is not null
        if (currentPreview !== null) currentPreview.classList.remove("selected")

        // actually updating the variable currentSlide with the parameter of this function
        currentSlideIndex = newIndex
        currentSlide = getIframeDocument(mainIframe).querySelectorAll(".slide")[newIndex]
        currentDrawing = currentSlide.querySelector(".drawing-canvas")
        currentPath = ""
        currentPreview = containerOfAllPreviews.querySelectorAll(".slide-preview")[newIndex]
        scrollToSlide(mainIframe, newIndex)
        setupDrawEvents(isDrawingMode, currentSlide)

        // if the parameter passed was not null, then adds the .selected class to it
        if (currentPreview !== null) currentPreview.classList.add("selected")
      }

      // const selectSlide = (event) => {
      //   if (event.target.classList.contains("slide")) {
      //     setCurrentState(event.target)
      //   } else if (event.target.parentElement.classList.contains("slide")) {
      //     setCurrentState(event.target.parentElement)
      //   }
      // }

      function resetSlides() {

        // DELETE
        getIframeDocument(mainIframe).body.innerHTML = ""
        containerOfAllPreviews
          .querySelectorAll(".slide-preview-container")
          .forEach((e) => {
            e.parentElement.removeChild(e)
          })

        // INIT
        initCurrentContentParameters()

        // ADD
        initContainer()
        initBlankSlide()
        setupDrawEvents(isDrawingMode, currentSlide)
      }

      resetSlidesBtn.addEventListener("click", resetSlides)

      function resetAllDrawings() {
        getIframeDocument(mainIframe)
          .body.querySelectorAll(".drawing-canvas")
          .forEach((c) => {
            c.innerHTML = ""
          })
      }

      const resetAllDrawingsBtn = document.getElementById("resetAllDrawingsBtn")
      resetAllDrawingsBtn.addEventListener("click", resetAllDrawings)

      const scrollToSlide = (iframe, index) => {
        const e = iframe.contentWindow.document.children[0]
        const s = document.defaultView.getComputedStyle(e).height
        const ss = Number(s.substring(0, s.length - 2))
        e.scrollTo(0, index * ss)
      }

      const createSlidePreview = (newIndex) => {
        newIndex = Number(newIndex)
        const previewSlideContainer = document.createElement("div")
        previewSlideContainer.className = "bg-white slide-preview-container"
        const previewIframe = document.createElement("iframe")
        previewIframe.src = mainIframe.src
        previewIframe.scrolling = "no"
        previewIframe.className = "slide-preview"
        previewIframe.setAttribute("index", newIndex)
        // previewIframe.addEventListener("load", async () => {
        //   console.log(previewIframe, Number(newIndex), previewIframe.contentDocument.body)
        //   await new Promise((r) => setTimeout(r, 1000))
        //   scrollToSlide(previewIframe, newIndex);
        // })
        previewIframe.webstrate.on(
          "transcluded",
          function (webstrateId, clientId, user) {
            // console.log(
            //   previewIframe,
            //   newIndex,
            //   previewIframe.contentDocument.body
            // )
            scrollToSlide(previewIframe, newIndex)

            previewIframe.contentDocument.addEventListener("click", (event) => {
              setCurrentState(newIndex)
            })
          }
        )

        previewSlideContainer.append(previewIframe)

        return previewSlideContainer
      }

      const addPreviewSlide = (newIndex) => {
        const previewSlideContainer = createSlidePreview(newIndex)
        containerOfAllPreviews.append(previewSlideContainer)
      }

      const addSlide = () => {
        const doc = getIframeDocument(mainIframe)
        const container = getContainer()

        const newSlide = doc.createElement("div")
        container.appendChild(newSlide)
        newSlide.className = "slide"
        const newIndex = NSlide++
        newSlide.id = "slide-" + newIndex
        newSlide.setAttribute("index", newIndex)
        // console.log(newSlide.getAttribute("index"))
        // newSlide.addEventListener("mousedown", selectSlide)

        const newCanvas = doc.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        )
        newSlide.appendChild(newCanvas)
        newCanvas.classList.add("drawing-canvas")
        newCanvas.setAttribute("width", "100%")
        newCanvas.setAttribute("height", "100%")

        addPreviewSlide(newIndex)

        return newIndex
      }

      const addTextBox = () => {
        if (!currentSlide) return
        const doc = getIframeDocument(mainIframe)
        const textBox = doc.createElement("div")
        textBox.className = "text-box"
        textBox.contentEditable = true
        textBox.style.zIndex = currentZIndex++
        textBox.style.fontSize = `${fontSize}px` // Apply the current font size
        textBox.style.left = "10px"
        textBox.style.top = "10px"
        textBox.focus()
        setupDragEvents(textBox)
        currentSlide.appendChild(textBox)
      }

      const addImage = () => {
        if (!currentSlide) return
        const imageUrl = prompt("Enter image URL:")
        if (imageUrl) {
          const doc = getIframeDocument(mainIframe)
          const imageBox = doc.createElement("img")
          imageBox.src = imageUrl
          imageBox.className = "image-box"
          imageBox.style.width = "200px" // Change width as desired
          imageBox.style.zIndex = currentZIndex++
          setupDragEvents(imageBox)
          currentSlide.appendChild(imageBox)
        }
      }

      const setupDragEvents = (element) => {
        element.addEventListener("mousedown", (event) => {
          const handleMouseMove = (event) => {
            const current_left =
              event.clientX - currentSlide.getBoundingClientRect().left
            const current_top =
              event.clientY - currentSlide.getBoundingClientRect().top
            const rec = element.getBoundingClientRect()
            if (
              0 < current_left &&
              current_left + rec.width <
                currentSlide.getBoundingClientRect().width &&
              0 < current_top &&
              current_top + rec.height <
                currentSlide.getBoundingClientRect().height
            ) {
              element.style.left = current_left + "px"
              element.style.top = current_top + "px"
            }
          }
          const handleMouseUp = () => {
            getIframeDocument(mainIframe).removeEventListener(
              "mousemove",
              handleMouseMove
            )
            getIframeDocument(mainIframe).removeEventListener(
              "mouseup",
              handleMouseUp
            )
          }
          getIframeDocument(mainIframe).addEventListener(
            "mousemove",
            handleMouseMove
          )
          getIframeDocument(mainIframe).addEventListener(
            "mouseup",
            handleMouseUp
          )
        })
      }

      const toggleDrawingModeIndicator = (drawingMode) => {
        drawingModeIndicator.style.visibility = drawingMode
          ? "visible"
          : "hidden" // Show/hide indicator
      }

      const setupDrawEvents = (drawingMode, slide) => {
        const drawing = slide.querySelector(".drawing-canvas")
        if (drawingMode) {
          drawing.addEventListener("mousedown", startDrawing)
          drawing.addEventListener("mousemove", draw)
          drawing.addEventListener("mouseup", stopDrawing)
          drawing.addEventListener("mouseleave", stopDrawing)
        } else {
          drawing.removeEventListener("mousedown", startDrawing)
          drawing.removeEventListener("mousemove", draw)
          drawing.removeEventListener("mouseup", stopDrawing)
          drawing.removeEventListener("mouseleave", stopDrawing)
        }
      }

      const toggleDrawingMode = () => {
        if (!currentSlide) return
        isDrawingMode = !isDrawingMode
        toggleDrawingModeIndicator(isDrawingMode)
        // canvas.style.zIndex = isDrawingMode ? currentZIndex++ : 0;
        setupDrawEvents(isDrawingMode, currentSlide)
        currentDrawing = currentSlide.querySelector(".drawing-canvas")
      }

      const startDrawing = (event) => {
        if (!isDrawingMode) return
        isDrawing = true
        currentPath = ""
        // var innerDoc = mainIframe.contentWindow.document;
        // currentDrawing = innerDoc.createElementNS("http://www.w3.org/2000/svg", "svg");
        // currentDrawing.setAttribute("width", "100%");
        // currentDrawing.setAttribute("height", "100%");
        // currentDrawing.style.position = "absolute";
        // currentDrawing.setAttribute("draggable", "true");
        // setupDragEvents(currentDrawing);
        // console.log(currentDrawing)
        path = getIframeDocument(mainIframe).createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        )
        path.setAttribute("fill", "none")
        path.setAttribute("stroke", brushColor)
        path.setAttribute("stroke-width", brushThickness.toString())
        currentDrawing.appendChild(path)
        const rec = currentSlide.getBoundingClientRect()
        const x = event.clientX - rec.left
        const y = event.clientY - rec.top
        currentPath += `M ${x},${y}`
      }

      const draw = (event) => {
        if (!isDrawing) return
        const rec = currentSlide.getBoundingClientRect()
        const x = event.clientX - rec.left
        const y = event.clientY - rec.top
        currentPath += `L ${x},${y} `
        path.setAttribute("d", currentPath)
      }
      function updateSvgViewBox(svg, path) {
        const bbox = path.getBBox()
        svg.setAttribute("width", bbox.width)
        svg.setAttribute("height", bbox.height)
        svg.setAttribute(
          "viewBox",
          `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
        )
        svg.style.position = "absolute"
        svg.style.left = `${bbox.x}px`
        svg.style.top = `${bbox.y}px`
      }
      const stopDrawing = () => {
        isDrawing = false
        // var path = currentDrawing.getElementsByTagName("path")[0];
        // setupDragEvents(path);
        // updateSvgViewBox(currentDrawing, path)
      }

      const changeBrushColor = () => {
        const newColor = prompt(
          "Enter new brush color (CSS color value):",
          brushColor
        )
        if (newColor) {
          brushColor = newColor
        }
      }

      const changeBrushThickness = () => {
        const newThickness = prompt(
          "Enter new brush thickness (number):",
          brushThickness
        )
        if (newThickness && !isNaN(newThickness)) {
          brushThickness = parseInt(newThickness, 10)
        }
      }

      brushColorPicker.addEventListener("input", (event) => {
        brushColor = event.target.value
      })
      brushThicknessSlider.addEventListener("input", (event) => {
        brushThickness = event.target.value
      })
      toggleDrawingModeBtn.addEventListener("click", toggleDrawingMode)

      fontSizeInput.addEventListener("input", (event) => {
        fontSize = event.target.value
        if (currentSlide) {
          const element = getIframeDocument(mainIframe).activeElement
          if (element.classList.contains("text-box")) {
            element.style.fontSize = `${fontSize}px`
          }
        }
      })

      addSlideBtn.addEventListener("click", addSlide)
      addTextBoxBtn.addEventListener("click", addTextBox)
      addImageBtn.addEventListener("click", addImage)
      toggleDrawingModeBtn.addEventListener("click", toggleDrawingMode)

      const initIframe = async () => {
        // Wait webstrate to load
        await new Promise((r) => setTimeout(r, 2000))
        toggleDrawingModeIndicator(isDrawingMode)
        initCSS()
        initContainer()
        initExistingSlides()
        initCurrentSlide()
        console.log(getIframeDocument(mainIframe))
        console.log(getIframeDocument(mainIframe).location)
        // console.log(getIframeDocument(mainIframe).body.innerHTML);
      }
      initIframe()
    }
  )
})

// document.addEventListener("click", (event) => {
//   console.log(event.target)
// })
