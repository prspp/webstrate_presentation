webstrate.on("loaded", function(webstrateId) {
    var slideShow = document.getElementById("main");
    var slidesStructure = document.getElementById("slidesStructure");
    var slidesNotes = document.getElementById("slidesNotes");
    var newBlock = document.getElementById("newSlide");
    var styleTitle = document.getElementById("activateTitle");
    var styleSubtitle = document.getElementById("activateSubtitle");
    var activeSlideNote = slidesStructure.getElementsByClassName("active")[0];
    var activeSlideInMain;
    var titleStyle = false;
    var styleEnabled;

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
        newSlideInSlideShow.setAttribute("contenteditable", "");

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

    // define the title's style of the slide
    function handleTitleType(styleClicked) {
        if(!titleStyle) {
            // remove the active class name if present
            const parent = document.getElementById("editor");
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
        // add the click listener to the very first slide note
        slidesStructure.children[0].addEventListener("click", (event) => toggleSlideNoteState(event.target));

        // add the click listener to the very first slide
        const slides = document.querySelector("#slides");
        slides.children[1].addEventListener("click", (event) => { 
            toggleSlideShow(event.target);
            showActiveSlide();
        });

        // handle the new slide creation event
        newBlock.addEventListener("click", () => {
            // create a new slide
            createNewSlide();

            // show the slide
            showActiveSlide();
        });

        // check if a title/subtitle style is applied
        const parent = document.getElementById("editor");
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

        showActiveSlide();
    }

    init();
});