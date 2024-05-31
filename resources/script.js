webstrate.on("loaded", function(webstrateId) {
    var slideShow;
    var slidesStructure = document.getElementById("slidesStructure");
    var slidesNotes = document.getElementById("slidesNotes");
    var newBlock = document.getElementById("newSlide");
    var styleTitle = document.getElementById("activateTitle");
    var styleSubtitle = document.getElementById("activateSubtitle");
    var activeSlideNote = slidesNotes.getElementsByClassName("active")[0];
    let currentZIndex = 1, fontSize=16, brushColor = "#000", brushThickness = 2;
    var activeSlideInMain, isDrawing=false, isDrawingMode=false;
    var titleStyle = false;
    var iframe = document.getElementById("main");
    var currentDrawing = null, currentPath = null, path;
    var offsetX, offsetY;

    // create list node
    function createListNode(outlineDiv, outline, nodeProperty) {
        if(!outline) {
            outline = document.createElement("ol");
            outline.className = "listTitles";

            /* to add */
            /*if(outlineDiv.id == "slidesNotes") {
                var currenParagraph = activeSlideNote.lastChild;
                if(!currenParagraph.textContent.trim()) {
                    activeSlideNote.insertAdjacentElement("afterbegin", outline);
                }
                else {
                    activeSlideNote.appendChild(outline);
                    var p = document.createElement("p");
                    p.setAttribute("contenteditable", "");
                    activeSlideNote.appendChild(p);
                }
            }
            else {*/
                outlineDiv.appendChild(outline);
            //}
        }

        // add text content
        var listItem = document.createElement("li");
        var paragraph = document.createElement("p");
        paragraph.classList.add(activeSlideInMain.classList[0]);
        paragraph.classList.add(nodeProperty.classList[nodeProperty.classList.length-1]);
        if(outline.id == "outline") {
            paragraph.addEventListener("click", (event) => {
                const slideClass = event.target.classList[0];
                const slide = document.getElementById("slides").querySelector(slideClass);
                document.getElementById("active").removeAttribute("id");
                slide.id = "active";
                showActiveSlide();
            });
        }
        else if(outlineDiv.id == "slidesStructure") {
            paragraph.addEventListener("click", (event) => {
                const slideClass = event.target.classList[0];
                const slide = document.getElementById("slidesNotes").getElementsByClassName(slideClass)[0];
                activeSlideNote.classList.remove("active");
                slide.classList.add("active");
                activeSlideNote = slide;
                showActiveSlideNotes();
            });
        }
        paragraph.textContent = nodeProperty.textContent;
        listItem.appendChild(paragraph);
        outline.appendChild(listItem);
    }

    // create outline item
    function createElementInOutline(textBox) {
        var outlineDiv = document.getElementById("outline");
        outlineDiv.hidden = true;
        var outline = outlineDiv.querySelector(".listTitles");
        createListNode(outlineDiv, outline, textBox);
        createElementInNote(textBox);
        outlineDiv.removeAttribute("hidden");
    }

    // create the outline item in note
    function createElementInNote(textBox) {
        // in notes summary
        slidesStructure.hidden = true;
        var outline = slidesStructure.querySelector(".listTitles");
        createListNode(slidesStructure, outline, textBox);
        slidesStructure.removeAttribute("hidden");

        // in notes
        /*slidesNotes.hidden = true;
        outline = slidesNotes.querySelector(".listTitles");
        createListNode(slidesNotes, outline, textBox);
        slidesNotes.removeAttribute("hidden");*/
    }

    // update outline
    const updateOutline = (event) => {
        const callingTitleClass = event.target.classList[event.target.classList.length-1];
        var outlineDiv = document.getElementById("outline");
        var paragraph = outlineDiv.querySelector(".listTitles").getElementsByClassName(callingTitleClass)[0];
        paragraph.innerHTML = event.target.innerHTML;
        updateNotes(event, callingTitleClass);
    }

    // update notes
    const updateNotes = (event, callingTitleClass) => {
        var slidesDiv = document.getElementById("slidesStructure");
        var paragraph = slidesDiv.querySelector(".listTitles").getElementsByClassName(callingTitleClass)[0];
        paragraph.innerHTML = event.target.innerHTML;
    }

    // add title
    function addTextStyle() {
        if(!activeSlideInMain) return;
        var innerDoc = iframe.contentWindow.document;
        const titleBox = innerDoc.createElement("p");
        const nbTitles = innerDoc.getElementsByClassName("title").length;
        titleBox.classList.add("title");
        titleBox.classList.add("title-" + nbTitles.toString());
        titleBox.classList.add(activeSlideInMain.classList[0]);
        titleBox.style.top = "10px";
        titleBox.style.left = "50px";
        titleBox.style.width = "200px";
        titleBox.style.margin = "0px";
        titleBox.setAttribute("contentEditable", "");
        titleBox.style.zIndex = currentZIndex ++;
        titleBox.textContent = "Add title";
        titleBox.style.fontSize = "50px";
        titleBox.style.fontWeight = "bold";
        titleBox.style.backgroundColor = "#000";
        titleBox.style.color = "#fff";
        titleBox.style.display = "inline-block";
        titleBox.addEventListener("focus", () => {
            titleBox.classList.remove("outlined");
            titleBox.style.backgroundColor = "#fff";
            titleBox.style.color = "#000";
        });
        titleBox.addEventListener("input", updateOutline);
        titleBox.addEventListener("paste", updateOutline);
        titleBox.addEventListener("cut", updateOutline);
        titleBox.addEventListener("delete", updateOutline);
        titleBox.style.cursor = "grab";
        titleBox.style.position = "absolute";
        titleBox.draggable = true;
        activeSlideInMain.appendChild(titleBox);
        setupDragEvents(titleBox);
        createElementInOutline(titleBox);
    }

    // add text box
    function addTextBox() {
        if(!activeSlideInMain) return;
        var innerDoc = iframe.contentWindow.document;
        const textBox = innerDoc.createElement("div");
        textBox.className = "text-box";
        textBox.style.top = "50px";
        textBox.style.left = "50px";
        textBox.style.width = "400px";
        textBox.contentEditable = true;
        textBox.style.zIndex = currentZIndex++;
        activeSlideInMain.appendChild(textBox);
        textBox.style.fontSize = `${fontSize}px`; // Apply the current font size
        textBox.style.position = "absolute";
        textBox.draggable = true;
        textBox.focus();
        setupDragEvents(textBox);
    }

    // add image
    function addImage() {
        if (!activeSlideInMain) return;
        const imageUrl = prompt("Enter image URL:");
        if (imageUrl) {
            const imageBox = doc.createElement("img");
            imageBox.src = imageUrl;
            imageBox.className = "image-box";
            imageBox.style.top = "50px";
            imageBox.style.left = "50px";
            imageBox.style.width = "200px"; // Change width as desired
            imageBox.style.zIndex = currentZIndex++;
            activeSlideInMain.appendChild(imageBox);
            setupDragEvents(imageBox);
        }
    }

    function updateSvgViewBox(svg, path) {
        const bbox = path.getBBox();
        svg.setAttribute("width", bbox.width);
        svg.setAttribute("height", bbox.height);
        svg.setAttribute("viewBox", `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);
        svg.style.position = 'absolute';
        svg.style.left = `${bbox.x}px`;
        svg.style.top = `${bbox.y}px`;
    }

    const dragAndDropOnSvg = (element) => {
        let offsetX, offsetY, isDragging;

        const startDragging = (event) => {
            isDragging= true;
            const rect = element.getBoundingClientRect();
            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top;
            element.style.cursor = "grabbing";
        }

        const drag = (event) => {
            if(!isDragging) return;
            event.preventDefault();
        }

        const endDragging = (event) => {
            isDragging = false;
            const rect = activeSlideInMain.getBoundingClientRect();
            const x = event.clientX - rect.left - offsetX;
            const y = event.clientY - rect.top - offsetY;

            const maxX = activeSlideInMain.clientWidth - element.clientWidth;
            const maxY = activeSlideInMain.clientHeight - element.clientHeight;

            const newX = `${Math.min(Math.max(0, x), maxX)}px`;
            const newY = `${Math.min(Math.max(0, y), maxY)}px`;
    
            element.style.left = newX;
            element.style.top = newY;
        }

        element.addEventListener("mousedown", startDragging);
        element.addEventListener("mousemove", drag);
        element.addEventListener("mouseup", endDragging);
        element.addEventListener("mouseleave", endDragging);
    }

    // handle drag events
    const setupDragEvents = (element) => {
        let offsetX, offsetY;
    
        const handleDragStart = (event) => {
            const rect = element.getBoundingClientRect();
            offsetX = event.clientX - rect.left;
            offsetY = event.clientY - rect.top;
            event.dataTransfer.setData("text/plain", event.target.innerText); // Required for Firefox
            event.dataTransfer.setData("text/html", event.target.outerHTML);
            event.dataTransfer.setData("text/uri-list",event.target.ownerDocument.location.href);
            activeSlideInMain.addEventListener("dragover", handleDragOver);
            activeSlideInMain.addEventListener("drop", handleDrop);
        };
    
        const handleDragOver = (event) => {
            event.preventDefault();
        };
    
        const handleDrop = (event) => {
            event.preventDefault();
            const rect = activeSlideInMain.getBoundingClientRect();
            const x = event.clientX - rect.left - offsetX;
            const y = event.clientY - rect.top - offsetY;
    
            // for the text to stay in the container
            const maxX = activeSlideInMain.clientWidth - element.clientWidth;
            const maxY = activeSlideInMain.clientHeight - element.clientHeight;
    
            element.style.left = `${Math.min(Math.max(0, x), maxX)}px`;
            element.style.top = `${Math.min(Math.max(0, y), maxY)}px`;
            element.style.cursor = "grab";
        };
    
        element.addEventListener("dragstart", handleDragStart);
        activeSlideInMain.addEventListener("dragover", handleDragOver);
        activeSlideInMain.addEventListener("drop", handleDrop);
    
        element.addEventListener("dragend", () => {
            activeSlideInMain.removeEventListener("dragover", handleDragOver);
            activeSlideInMain.removeEventListener("drop", handleDrop);
        });
    };

    // show the active slide
    function showActiveSlide() {
        if(!slideShow) return;
        // get the element having the active class
        var activeSlide = document.getElementById("active");

        // take its classes
        var className = activeSlide.className;

        // among the children of main, display the appropriate div
        activeSlideInMain = slideShow.querySelector("." + className + ".slide");
        
        if(activeSlideInMain) {
            // set his attribute hidden to false
            activeSlideInMain.removeAttribute("hidden");

            // hide the other divs
            let children = slideShow.getElementsByClassName("slide");
            
            for(let i=0; i<children.length; i++) {
                if(!children[i].className.includes(className)) {
                    children[i].setAttribute("hidden", "true");
                }
            }
        }

        // do the same for slide notes
        showActiveSlideNotes();
        
    }

    // show active slide notes
    function showActiveSlideNotes() {
        var className = activeSlideInMain.classList[0];
        activeSlideNote = slidesNotes.getElementsByClassName(className)[0];
        // get the element having the active class
        const classNames = activeSlideNote.className;

        // hide it for now to avoid multiple repaints and reflows
        slidesNotes.setAttribute("hidden", "");

        let slideNumber;
        let children = document.getElementsByClassName("slideNote");
        for(let i=0; i<children.length; i++) {
            // hide the other divs notes
            if(!classNames.includes(children[i].classList[0])) {
                children[i].setAttribute("hidden", "");
            }
            else {
                // show active slide notes
                children[i].removeAttribute("hidden");
                slideNumber = i;
            }
        }

        // print slide title
        document.getElementById("slideTitle").innerText = "Slide " + (slideNumber + 1).toString();
        
        // repaint
        slidesNotes.removeAttribute("hidden");
    }

    // create a new slide
    function createNewSlide() {
        // count the current number of p element in slides
        var allSlides = document.getElementById("slides");
        var nbSlidesCreated = allSlides.childElementCount;

        /* ___ on the slide show ___ */

        // remove the active id to the current slide
        document.getElementById("active").removeAttribute("id");

        // create a new block above the 'add block' + set it to active
        var newSlide = "<p class='slide-" + nbSlidesCreated.toString() + "'" + " id='active'></p>";
        newBlock.insertAdjacentHTML("beforebegin", newSlide);

        // add the click listener to toggle the slide show
        document.getElementById("active").addEventListener("click", (event) => {
            toggleSlideShow(event.target);
            showActiveSlide();
        });

        // create the div in the slideshow + give it the necessary attributes
        var newSlideInSlideShow = document.createElement("div");
        newSlideInSlideShow.style.height = "100vh";
        newSlideInSlideShow.className = "slide-" + nbSlidesCreated.toString() + " slide";

        // add this div as a child
        slideShow.appendChild(newSlideInSlideShow);

        // set it as the main slide
        activeSlideInMain = slideShow.lastChild;

        /* ___ on the notes ___ */

        // remove class active to the current slide
        slidesNotes.getElementsByClassName("active")[0].classList.remove("active");

        var newSlideNote = document.createElement("div");
        var paragraph = document.createElement("p");
        paragraph.setAttribute("contenteditable", "");
        newSlideNote.appendChild(paragraph);
        newSlideNote.classList.add("slide-"+ nbSlidesCreated.toString());
        newSlideNote.classList.add("slideNote");
        newSlideNote.classList.add("active");
        slidesNotes.appendChild(newSlideNote);
        

        // set it as the main slide note
        activeSlideNote = slidesNotes.lastChild;
    }

    // show the selected slide
    function toggleSlideShow(selectedSlide) {
        document.getElementById("active").removeAttribute("id");
        selectedSlide.setAttribute("id", "active");
    }

    // show the selected slide's notes
    function toggleSlideNoteState(selectedSlideNote) {
        // remove class name active to the current active element
        activeSlideNote.classList.remove("active");

        // set the selected slide's note class name to active
        selectedSlideNote.classList.add("active");
        activeSlideNote = selectedSlideNote;
    }

    function toggleTitleState() {
        titleStyle = !titleStyle;
    }

    // drawing functions 
    function startDrawing(event) {
        if (!isDrawingMode) return;
        isDrawing = true;
        currentPath = "";
        var innerDoc = iframe.contentWindow.document;
        currentDrawing = innerDoc.createElementNS("http://www.w3.org/2000/svg", "svg");
        currentDrawing.setAttribute("width", "100%");
        currentDrawing.setAttribute("height", "100%");
        currentDrawing.style.position = "absolute";
        currentDrawing.setAttribute("draggable", "true");
        //setupDragEvents(currentDrawing);

        path = innerDoc.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", brushColor);
        path.setAttribute("stroke-width", brushThickness.toString());
        currentDrawing.appendChild(path);
        activeSlideInMain.appendChild(currentDrawing);
        const rec = activeSlideInMain.getBoundingClientRect();
        const x = event.clientX - rec.left;
        const y = event.clientY - rec.top;
        currentPath += `M ${x},${y}`;
    }

    function draw(event) {
        if (!isDrawing) return;
        const rec = activeSlideInMain.getBoundingClientRect();
        const x = event.clientX - rec.left;
        const y = event.clientY - rec.top;
        currentPath += `L ${x},${y} `;
        path.setAttribute("d", currentPath);
    }

    // toggle drawing mode
    function toggleDrawingMode() {
        if (!activeSlideInMain) return;
        isDrawingMode = !isDrawingMode;
        if (isDrawingMode) {
            activeSlideInMain.addEventListener("mousedown", startDrawing);
            activeSlideInMain.addEventListener("mousemove", draw);
            activeSlideInMain.addEventListener("mouseup", () =>  {
                isDrawing = false;
                var path = currentDrawing.getElementsByTagName("path")[0];
                updateSvgViewBox(currentDrawing, path);
                dragAndDropOnSvg(currentDrawing);
            });
            activeSlideInMain.addEventListener("mouseleave", () => { 
                isDrawing = false;
                var path = currentDrawing.getElementsByTagName("path")[0];
                updateSvgViewBox(currentDrawing, path);
                dragAndDropOnSvg(currentDrawing);
            });
        } else {
            activeSlideInMain.removeEventListener("mousedown", startDrawing);
            activeSlideInMain.removeEventListener("mousemove", draw);
            activeSlideInMain.removeEventListener("mouseup", () => {
                isDrawing = false;
                var path = currentDrawing.getElementsByTagName("path")[0];
                updateSvgViewBox(currentDrawing, path);
            });
            activeSlideInMain.removeEventListener("mouseleave", () => {
                isDrawing = false;
                var path = currentDrawing.getElementsByTagName("path")[0];
                updateSvgViewBox(currentDrawing, path);
            });
        }
    }

    // add listeners to iframe elements
    function addListenerIframe(document) {
        // add the drag events to the canvas in the document
        document.body.querySelectorAll(".drawing-canvas").forEach(element => {
            setupDragEvents(element);
        });

        // do the same for the text boxes
        document.body.querySelectorAll(".text-box").forEach(element => {
            setupDragEvents(element);
        });
    }

    // add listeners to toolbar buttons
    function addToolbarListeners() {
        // handle the style events
        styleTitle.addEventListener("click", () => {
            addTextStyle();
        });

        // add listeners to buttons
        document.getElementById("addTextBoxBtn").addEventListener("click", addTextBox);
        document.getElementById("addImageBtn").addEventListener("click", addImage);
        document.getElementById("fontSizeInput").addEventListener("input", (event) => {
            fontSize = event.target.value;
            if (activeSlideInMain) {
              const element = document.activeElement;
              if (element && element.classList.contains("text-box")) {
                element.style.fontSize = `${fontSize}px`;
              }
            }
        });
        document.getElementById("brushColorPicker").addEventListener("input", (event) => {
            brushColor = event.target.value;
        });
        document.getElementById("brushThicknessSlider").addEventListener("click", (event) => {
            brushThickness = event.target.value;
        });
        document.getElementById("toggleDrawingModeBtn").addEventListener("click", toggleDrawingMode);
    }

    function init() {
        // add the click listener to the slide notes in the document
        for(const child of slidesStructure.children) {
            child.addEventListener("click", (event) => { toggleSlideNoteState(event.target) });
        }

        // add the click listener to the slides
        const slides = document.querySelectorAll("#slides p");
        for(const slide of slides) {
            if(slide.id != "newSlide") {
                slide.addEventListener("click", (event) => {
                    toggleSlideShow(event.target);
                    showActiveSlide();
                });
            }
        }

        // handle the new slide creation event
        newBlock.addEventListener("click", () => {
            // create a new slide
            createNewSlide();

            // show the slide
            showActiveSlide();
        });
    }

    iframe.webstrate.on("transcluded", () => {
        var innerDoc = iframe.contentWindow.document;
        if(!innerDoc.style) {
            var link = innerDoc.createElement("style");
            link.id = "style.css";
            innerDoc.head.appendChild(link);
        }
        if(innerDoc.getElementsByClassName("slide").length == 0) {
            var div = innerDoc.createElement("div");
            div.classList.add("slide-1");
            div.classList.add("slide");
            div.style.height = "100vh";
            innerDoc.body.appendChild(div);
        }
        slideShow = innerDoc.body;
        showActiveSlide();
        addListenerIframe(innerDoc);
        addToolbarListeners();
    });

    init();
});