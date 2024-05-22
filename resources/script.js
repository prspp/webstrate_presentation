webstrate.on("loaded", function(webstrateId) {
    var slideShow = document.getElementById("main");
    var slidesStructure = document.getElementById("slidesStructure");
    var slidesNotes = document.getElementById("slidesNotes");
    var newBlock = document.getElementById("newSlide");
    var styleTitle = document.getElementById("activateTitle");
    var styleSubtitle = document.getElementById("activateSubtitle");
    var activeSlideNote = slidesStructure.getElementsByClassName("active")[0];
    let currentZIndex = 1, fontSize=16, brushColor = "#000", brushThickness = 2;
    var activeSlideInMain, isDrawing=false, isDrawingMode=false;
    var titleStyle = false;
    var styleEnabled;

    // add text box
    function addTextBox() {
        if(!activeSlideInMain) return;
        const textBox = document.createElement("div");
        textBox.className = "text-box";
        textBox.style.top = "50px";
        textBox.style.left = "50px";
        textBox.contentEditable = true;
        textBox.style.zIndex = currentZIndex++;
        activeSlideInMain.appendChild(textBox);
        textBox.style.fontSize = `${fontSize}px`; // Apply the current font size
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

    // handle drag events
    const setupDragEvents = (element) => {
        element.addEventListener("mousedown", (event) => {
            const handleMouseMove = (event) => {
                const current_left = event.clientX - activeSlideInMain.getBoundingClientRect().left;
                const current_top = event.clientY - activeSlideInMain.getBoundingClientRect().top;
                const rec = element.getBoundingClientRect();
                if (0 < current_left &&
                    current_left + rec.width < activeSlideInMain.getBoundingClientRect().width &&
                    0 < current_top && current_top + rec.height < activeSlideInMain.getBoundingClientRect().height
                  ) 
                {
                    element.style.left = current_left + "px";
                    element.style.top = current_top + "px";
                    console.log("Satisfied");
                }
                else {
                    console.log("Not satisfied");
                }
            };

            const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        })
    }

    // show the active slide
    function showActiveSlide() {
        // get the element having the active class
        var activeSlide = document.getElementById("active");

        // take its classes
        var className = activeSlide.className;

        // among the children of main, display the appropriate div
        activeSlideInMain = document.querySelector("." + className + ".slide");
        
        if(activeSlideInMain) {
            // set his attribute hidden to false
            activeSlideInMain.removeAttribute("hidden");

            // hide the other divs
            let children = document.getElementsByClassName("slide");
            
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
        // get the element having the active class
        const classNames = activeSlideNote.className;

        // hide it for now to avoid multiple repaints and reflows
        slidesNotes.setAttribute("hidden", "");

        let slideNumber;
        let children = document.getElementsByClassName("slideNote");
        for(let i=0; i<children.length; i++) {
            // hide the other divs notes
            console.log(children[i]);
            if(!classNames.includes(children[i].className[0])) {
                children[i].setAttribute("hidden", "");
            }
            else {
                // show active slide notes
                children[i].removeAttribute("hidden");
                slideNumber = i;
            }
        }

        // print slide title
        document.getElementById("slideTitle").innerText = "Slide " + slideNumber.toString();
        
        // repaint
        slidesNotes.removeAttribute("hidden");
    }

    // create a new slide
    function createNewSlide() {
        // count the current number of p element in slides
        var allSlides = document.getElementById("slides");
        var nbSlidesCreated = allSlides.childElementCount - 1;

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
        newSlideInSlideShow.className = "slide-" + nbSlidesCreated.toString() + " slide";

        // canvas in the div
        const newCanvas = document.createElement("canvas");
        newCanvas.className = "drawing-canvas";
        newCanvas.width = newSlideInSlideShow.offsetWidth;
        newCanvas.height = newSlideInSlideShow.offsetHeight;
        newSlideInSlideShow.appendChild(newCanvas);
        setupDragEvents(newCanvas);

        // add this div as a child
        slideShow.appendChild(newSlideInSlideShow);

        // set it as the main slide
        activeSlideInMain = slideShow.lastChild;

        /* ___ on the notes ___ */

        // remove class active to the current slide
        slidesStructure.getElementsByClassName("active")[0].classList.remove("active");

        let slideCreatedString = nbSlidesCreated.toString();

        // create a new note
        var newNoteInSummary = "<p class='slide-" + nbSlidesCreated.toString() + " active'>" + "Slide " + slideCreatedString + "</p>";
        slidesStructure.insertAdjacentHTML("beforeend", newNoteInSummary);

        // set it as the main slide note
        activeSlideNote = slidesStructure.lastChild;

        // add the click listener to toggle the slide note state
        slidesStructure.lastChild.addEventListener("click", (event) => {
            toggleSlideNoteState(event.target);
            showActiveSlideNotes();
        });

        // create notes
        var newNotes = document.createElement("div");
        newNotes.className = "slide-" + nbSlidesCreated.toString() + " slideNote";
        newNotes.setAttribute("contenteditable", "");
        slidesNotes.appendChild(newNotes);
    
        if(titleStyle) {
            handleTitleType(styleEnabled);
        } 
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
        const canvas = event.target;
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushThickness;
        ctx.moveTo(event.offsetX, event.offsetY);
    }

    function draw(event) {
        if (!isDrawing) return;
        const canvas = event.target;
        const ctx = canvas.getContext("2d");
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }

    // toggle drawing mode
    function toggleDrawingMode() {
        if (!activeSlideInMain) return;
        isDrawingMode = !isDrawingMode;
        drawingModeIndicator.style.visibility = isDrawingMode
            ? "visible"
            : "hidden"; // Show/hide indicator
        const canvas = activeSlideInMain.querySelector(".drawing-canvas");
        canvas.style.zIndex = isDrawingMode ? currentZIndex++ : 0;
        if (isDrawingMode) {
            canvas.addEventListener("mousedown", startDrawing);
            canvas.addEventListener("mousemove", draw);
            canvas.addEventListener("mouseup", () => isDrawing = false);
            canvas.addEventListener("mouseleave", () => isDrawing = false);
        } else {
            canvas.removeEventListener("mousedown", startDrawing);
            canvas.removeEventListener("mousemove", draw);
            canvas.removeEventListener("mouseup", () => isDrawing = false);
            canvas.removeEventListener("mouseleave", () => isDrawing = false);
        }
    }

    // define the title's style of the slide
    function handleTitleType(styleClicked) {
        if(!titleStyle) {
            // remove the active class name if present
            const parent = document.getElementById("toolBar");
            const child = parent.getElementsByClassName("active");
            if(child.length > 0) {
                child[0].removeAttribute("class");
            }
            return;
        }

        // get the id of the paragraph clicked
        styleEnabled = styleClicked;

        const list_elements = ["ul", "ol"];
        let previousSibling;

        if(styleClicked == "activateTitle") {
            // assign the clicked element the class active
            styleTitle.className = "active";

            // check if the active slide is already in a list
            var parent = activeSlideInMain.parentElement;
            var parentName = parent.nodeName.toLowerCase();
            
            if(activeSlideInMain.previousElementSibling) {
                previousSibling = activeSlideInMain.previousElementSibling.nodeName.toLowerCase();
            }
            else {
                previousSibling = "None";
            }

            // if not, put it in a list
            if(parentName == "div" && !list_elements.includes(previousSibling)) {
                // insert it at the main slide position
                activeSlideInMain.insertAdjacentHTML("beforebegin", `<ol></ol>`);

                // do the same in the personal notes
                activeSlideNote.insertAdjacentHTML("beforebegin", `<ol></ol>`);
            }
            
            // get the list - the variable name parent is used here to show that this list tag 
            // will be its new parent
            parent = activeSlideInMain.previousElementSibling;
            var parentInNotes = activeSlideNote.previousElementSibling;

            parent.insertAdjacentHTML("beforeend", "<li></li>");
            parentInNotes.insertAdjacentHTML("beforeend", `<li></li>`);

            // insert the slide in the list
            var listItem = parent.lastChild;
            listItem.appendChild(activeSlideInMain); 

            var listItemInNote = parentInNotes.lastChild;
            listItemInNote.appendChild(activeSlideNote);
        }
    }

    function init() {
        // add the click listener to the slide notes in the document
        for(const child of slidesStructure.children) {
            child.addEventListener("click", (event) => { toggleSlideNoteState(event.target) });
        }

        // add the drag events to the canvas in the document
        document.querySelectorAll(".drawing-canvas").forEach(element => {
            setupDragEvents(element);
        });

        // do the same for the text boxes
        document.querySelectorAll(".text-box").forEach(element => {
            setupDragEvents(element);
        });

        
        // add the click listener to the slides
        const slides = document.querySelectorAll("#slides p");
        for(const slide of slides) {
            if(slide.id != "newSlide") {
                console.log(slide);
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

        // check if a title/subtitle style is applied
        const parent = document.getElementById("toolBar");
        const child = parent.getElementsByClassName("active");
        if(child.length > 0) {
            titleStyle = true;
            styleEnabled = child[0].id;
        }

        // handle the style events
        styleTitle.addEventListener("click", (event) => {
            toggleTitleState();
            handleTitleType(event.target.id);
        });

        styleSubtitle.addEventListener("click", (event) => {
            toggleTitleState();
            handleTitleType(event.target.id);
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
        document.getElementById("brushColorPicker").addEventListener("click", (event) => {
            brushColor = event.target.value;
        });
        document.getElementById("brushThicknessSlider").addEventListener("click", (event) => {
            brushThickness = event.target.value;
        });
        document.getElementById("toggleDrawingModeBtn").addEventListener("click", toggleDrawingMode);

        showActiveSlide();
    }

    init();
});