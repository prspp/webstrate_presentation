// document.addEventListener("DOMContentLoaded", () => {
webstrate.on("loaded", function (webstrateId, clientId, user) {
  console.log("Script loaded.")

  // ### REFERENCES TO DOM ELEMENTS ##
  const mainIframe = document.getElementById("contentIframe")
  const getIframeDocument = (i) => i.contentDocument || i.contentWindow.document

  const addSlideBtn = document.getElementById("addSlideBtn")
  const addTextBoxBtn = document.getElementById("addTextBoxBtn")
  const addImageFromUrlBtn = document.getElementById("addImageFromUrlBtn")
  const toggleDrawingModeBtn = document.getElementById("toggleDrawingModeBtn")
  const drawingModeIndicator = document.getElementById("drawingModeIndicator")
  const resetSlidesBtn = document.getElementById("resetSlidesBtn")
  const brushColorPicker = document.getElementById("brushColorPicker")
  const brushThicknessSlider = document.getElementById("brushThicknessSlider")
  const fontSizeInput = document.getElementById("fontSizeInput")
  const documentUrlInput = document.getElementById("documentUrlInput")
  const loadBtn = document.getElementById("loadBtn")
  const clearQuestionsBtn = document.getElementById("clearQuestionsBtn")
  const addImageInput = document.getElementById("imageInput")
  const presentBtn = document.getElementById("presentBtn")

  const previewPaneBtn = document.getElementById("previewPaneBtn")
  const tocPaneBtn = document.getElementById("tocPaneBtn")
  const previewPane = document.getElementById("previewPane")
  const tocPane = document.getElementById("tocPane")

  const reviewsPaneBtn = document.getElementById("reviewsPaneBtn")
  const questionsPaneBtn = document.getElementById("questionsPaneBtn")
  const reviewsPane = document.getElementById("reviewsPane")
  const questionsIframe = document.getElementById("questionsIframe")

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

    NSlide = 0
    currentSlide = null
    currentSlideIndex = null
    currentPreview = null
    currentDrawing = null
    currentPath = ""
    path = null
  }
  initCurrentContentParameters()

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

  function resizeAllPreviews() {
    ;[...document.getElementsByClassName("slide-preview")].forEach(
      (previewIframe) => {
        scrollToSlide(previewIframe, previewIframe.getAttribute("index"))
      }
    )
  }

  window.addEventListener("resize", () => {
    resizeAllPreviews()
    // window.devicePixelRatio
  })

  previewPaneBtn.addEventListener("click", (event) => {
    previewPaneBtn.classList.add("btn-active")
    previewPane.classList.remove("display-none")
    tocPaneBtn.classList.remove("btn-active")
    tocPane.classList.add("display-none")
    resizeAllPreviews()
  })

  tocPaneBtn.addEventListener("click", (event) => {
    previewPaneBtn.classList.remove("btn-active")
    previewPane.classList.add("display-none")
    tocPaneBtn.classList.add("btn-active")
    tocPane.classList.remove("display-none")
    resizeAllPreviews()
  })

  previewPaneBtn.click()

  reviewsPaneBtn.addEventListener("click", (event) => {
    reviewsPaneBtn.classList.add("btn-active")
    reviewsPane.classList.remove("display-none")
    questionsPaneBtn.classList.remove("btn-active")
    questionsIframe.classList.add("display-none")
  })

  questionsPaneBtn.addEventListener("click", (event) => {
    reviewsPaneBtn.classList.remove("btn-active")
    reviewsPane.classList.add("display-none")
    questionsPaneBtn.classList.add("btn-active")
    questionsIframe.classList.remove("display-none")
  })

  questionsPaneBtn.click()

  // Currently not working when wrapped in a function
  // const initBinaryBoard = (btn1, btn2, pane1, pane2) => {
  //   console.log("btn1")
  //     btn1.addEventListener("click", (event) => {
  //       btn1.classList.add("btn-active")
  //       pane1.classList.remove("display-none")
  //       btn2.classList.remove("btn-active")
  //       pane2.classList.add("display-none")
  //     })

  //     console.log("btn2")
  //     btn2.addEventListener("click", (event) => {
  //       btn1.classList.remove("btn-active")
  //       pane1.classList.add("display-none")
  //       btn2.classList.add("btn-active")
  //       pane2.classList.remove("display-none")
  //     })

  //     console.log("preclick")
  //     btn1.click()
  //     console.log("postclick")
  // }

  // initBinaryBoard(previewPaneBtn, previewPane, tocPaneBtn, tocPane)

  loadBtn.addEventListener("click", (event) => {
    mainIframe.src = documentUrlInput.value || defaultWebstrateUrl
    // getIframeDocument(mainIframe).location.reload();
    console.log("reload asked")
  })

  presentBtn.addEventListener("click", () => {
    window.open("http://localhost:7007/presentationView/", "_blank")
  })

  const getContainer = () => {
    return getIframeDocument(mainIframe).body
  }

  const uploadImages = (files) => {
    return new Promise((resolve, reject) => {
      const file = files[0]
      const formData = new FormData()
      formData.append("file", file, file.name)

      const request = new XMLHttpRequest()
      console.log("Location : ", window.location.pathname)
      request.open("POST", window.location.pathname)
      request.send(formData)
      request.addEventListener("load", (e) => {
        const asset = JSON.parse(request.responseText)
        console.log("Response : ", request.responseText)
        resolve(asset)
      })
    })
  }

  const addImages = (imgSrc) => {
    if (!currentSlide) return
    const document = getIframeDocument(mainIframe)
    var imageDiv = document.createElement("div")
    imageDiv.style.left = "0px"
    imageDiv.style.top = "0px"

    const image = document.createElement("img")
    image.setAttribute("src", imgSrc)
    imageDiv.appendChild(image)
    imageDiv.className = "image-box"
    imageDiv.style.zIndex = currentZIndex++
    image.style.width = "200px"
    setupDragEvents(imageDiv)
    currentSlide.appendChild(imageDiv)
    addImageInput.value = ""
  }

  addImageInput.addEventListener("change", (event) => {
    (async () => {
      let asset = await uploadImages(addImageInput.files)
      addImages(`${window.location.pathname}${asset.v}/${asset.fileName}`)
    })()
  })

  const initContainer = () => {
    if (getContainer() !== null) return
    let doc = getIframeDocument(mainIframe)
    const container = doc.createElement("body")
    doc.appendChild(container)
  }

  const getMainCSSFile = () => {
    return getIframeDocument(mainIframe).getElementById("mainCSSFile")
  }

  // const initCSS = () => {
  //   if (getMainCSSFile() !== null)
  //     return;
  //   let doc = getIframeDocument(mainIframe);
  //   var fileref = doc.createElement(link");
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
    } else {
      console.log("here")
    }
  }

  const initCurrentSlide = () => {
    const doc = getIframeDocument(mainIframe)
    const czs = doc.querySelectorAll(".slide")
    if (czs.length > 0) {
      setCurrentState(0)
    } else {
      initBlankSlide()
    }
  }

  const createPreviewsForExistingSlides = () => {
    const doc = getIframeDocument(mainIframe)
    doc.querySelectorAll(".slide").forEach((zone) => {
      addPreviewSlide(zone.getAttribute("index"))
    })
  }

  const initExistingSlides = () => {
    const doc = getIframeDocument(mainIframe)
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
    if (currentSlideIndex === newIndex) return

    // updating the old content zone if it is not null
    if (currentPreview !== null) currentPreview.classList.remove("selected")

    // actually updating the variable currentSlide with the parameter of this function

    const doc = getIframeDocument(mainIframe)
    NSlide = doc.querySelectorAll(".slide").length
    currentSlide = doc.querySelectorAll(".slide")[newIndex]
    currentSlideIndex = newIndex
    currentPreview = previewPane.querySelectorAll(".slide-preview")[newIndex]
    currentDrawing = currentSlide.querySelector(".drawing-canvas")
    currentPath = ""

    scrollToSlide(mainIframe, newIndex)
    setupDrawEvents(isDrawingMode, currentSlide)

    // if the parameter passed was not null, then adds the .selected class to it
    if (currentPreview !== null) currentPreview.classList.add("selected")
  }

  function deleteAllSlides() {
    getIframeDocument(mainIframe).body.innerHTML = ""
  }

  function deleteAllPreviews() {
    previewPane.querySelectorAll(".slide-preview-container").forEach((e) => {
      e.parentElement.removeChild(e)
    })
  }

  function resetSlides() {
    // DELETE
    deleteAllSlides()
    deleteAllPreviews()

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
    previewIframe.webstrate.on(
      "transcluded",
      function (webstrateId, clientId, user) {
        scrollToSlide(previewIframe, newIndex)
        setCurrentState(newIndex)
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
    previewPane.append(previewSlideContainer)
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

    const newCanvas = doc.createElementNS("http://www.w3.org/2000/svg", "svg")
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
          current_top + rec.height < currentSlide.getBoundingClientRect().height
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
      getIframeDocument(mainIframe).addEventListener("mouseup", handleMouseUp)
    })
  }

  const toggleDrawingModeIndicator = (drawingMode) => {
    drawingModeIndicator.style.visibility = drawingMode ? "visible" : "hidden" // Show/hide indicator
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
    setupDrawEvents(isDrawingMode, currentSlide)
    currentDrawing = currentSlide.querySelector(".drawing-canvas")
  }

  const startDrawing = (event) => {
    if (!isDrawingMode) return
    isDrawing = true
    currentPath = ""
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
  addImageFromUrlBtn.addEventListener("click", addImage)
  toggleDrawingModeBtn.addEventListener("click", toggleDrawingMode)

  const initIframe = () => {
    // Wait webstrate to load
    toggleDrawingModeIndicator(isDrawingMode)
    initCSS()
    initContainer()
    deleteAllPreviews()
    initCurrentContentParameters()
    createPreviewsForExistingSlides()
    initExistingSlides()
    initCurrentSlide()
    console.log(getIframeDocument(mainIframe))
    console.log(getIframeDocument(mainIframe).location)
  }

  mainIframe.webstrate.on(
    "transcluded",
    function (webstrateId, clientId, user) {
      console.log("mainIframe load event")
      initIframe()
    }
  )

  function createContainerInQuestionsIframe(iframeDocument) {
    var container = iframeDocument.createElement("div")
    container.id = "container"
    container.classList.add("some-padding")
    container.classList.add("container-section")
    var img = iframeDocument.createElement("img")
    img.src = `${window.location.pathname}delete.png`
    img.alt = "bin"
    img.id = "bin"
    container.appendChild(img)
    iframeDocument.body.appendChild(container)
  }

  // observe for new questions in the question iframe
  // to add click listener
  function addClickToNewQuestions(iframeDocument) {
    const observer = new MutationObserver(function (mutations_list) {
      mutations_list.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (added_node) {
          if (added_node.className == "selected") {
            added_node.addEventListener("click", (event) => {
              var itemClass = event.target.className
              if (itemClass) {
                event.target.removeAttribute("class")
              } else {
                event.target.className = "selected"
              }
            })
            observer.disconnect()
          }
        })
      })
    })
    observer.observe(iframeDocument.querySelector("#container"), {
      subtree: false,
      childList: true,
    })
  }

  function initClickListenerToExistingQuestion(iframeDocument) {
    let paragraphs = iframeDocument.querySelectorAll("p")
    paragraphs.forEach((paragraph) => {
      paragraph.addEventListener("click", () => {
        if (paragraph.classList.contains("selected")) {
          paragraph.classList.remove("selected")
        } else {
          paragraph.classList.add("selected")
        }
      })
    })
  }

  function initQuestionsIframeEvents(iframeDocument) {
    // bin listener to delete questions
    iframeDocument.getElementById("bin").addEventListener("click", () => {
      var selected = iframeDocument.getElementsByClassName("selected")
      if (selected.length != 0) {
        item = selected[0]
        item.remove()
      }
    })
    initClickListenerToExistingQuestion(iframeDocument)
    addClickToNewQuestions(iframeDocument)
  }

  function initquestionsIframeCSS() {
    var doc = getIframeDocument(questionsIframe)
    var cssFile = doc.querySelector("#mainCSSFile")
    if (cssFile !== null) return
    var fileref = doc.createElement("style")
    fileref.id = "mainCSSFile"
    fileref.textContent = document.getElementById("styles.css").textContent
    doc.getElementsByTagName("head")[0].appendChild(fileref)
  }

  function initquestionsIframe(iframeDocument) {
    var container = iframeDocument.querySelector("#container")
    if (container !== null) return
    initquestionsIframeCSS()
    createContainerInQuestionsIframe(iframeDocument)
  }

  questionsIframe.webstrate.on(
    "transcluded",
    function (webstrateId, clientId, user) {
      console.log("questionsIframe transcluded")
      var iframeDocument = getIframeDocument(questionsIframe)
      initquestionsIframe(iframeDocument)
      initQuestionsIframeEvents(iframeDocument)
    }
  )
})
