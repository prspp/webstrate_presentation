webstrate.on("loaded", function(webstrateId) {
    var titleInputName = document.getElementById("newTitle");
    var titleButton = document.getElementById("addTitle");
    var subTitleInputName = document.getElementById("newSubtitle");
    var subtitleButton = document.getElementById("addSubtitle");
    var outline = document.getElementById("titles");
    var blankPage = document.getElementById("main");
    var titleIframe

    function showSlide(slideTitle) {
        titleIframe = document.createElement("iframe");
        titleIframe.setAttribute("src", "/" + webstrateId + "-" + slideTitle);
        titleIframe.setAttribute("id", "titleIframe");
        blankPage.innerHTML = "";
        blankPage.appendChild(titleIframe);
    }

    titleButton.addEventListener("click", () => {
        // check if a title has been entered
        if (!titleInputName.value) return;

        // add the title to the outline
        outline.insertAdjacentHTML("beforeend", `<li>${titleInputName.value}</li>`);

        // get the length of the list, will be useful for the personal notes
        const titleList = document.querySelectorAll(".titles li");

        // create the associated slide with its title
        // disclaimer : in this part, we'll add Louis's code
        showSlide(titleInputName.value);
        titleIframe.webstrate.on("transcluded", (iframeWebstrateId) => {
            if(!titleIframe.contentDocument.body.getAttribute("contenteditable")) {
                titleIframe.contentDocument.body.innerHTML = `<h1>${titleInputName.value}</h1>`;
                titleIframe.contentDocument.body.setAttribute("contenteditable", "true");
            }
            titleInputName.value = "";
        });

        // add the title to the personal notes as a div 
        var containerTitle = document.createElement("div");
        containerTitle.className = "paragraph"
        var paragraph = document.createElement("p");
        paragraph.innerText = (titleList.length + 1).toString() + "." + " " + titleInputName.value;
        containerTitle.appendChild(paragraph);
        containerTitle.setAttribute("contenteditable", "true");
        var personalNotes = document.getElementById("personalNotes");
        personalNotes.appendChild(containerTitle);
    });

    subtitleButton.addEventListener("click", () => {
        // get the last title
        var list_items = document.getElementById("titles");
        if(!subTitleInputName.value || list_items.childElementCount == 0){ 
            subTitleInputName.value = "";
            return;
        }

        var last_item = list_items.children[list_items.children.length - 1];

        // get the list items of that title
        var sub_list = last_item.getElementsByClassName("subtitles");
        var length = sub_list.length;
        if(length == 0) {
            sub_list = document.createElement("ol");
            sub_list.className = "subtitles";
            last_item.appendChild(sub_list);
        }
        var sub_item = document.createElement("li");
        sub_item.innerText = subTitleInputName.value;
        sub_list.appendChild(sub_item);

        // add the subtitle
        var allContainers = document.getElementsByClassName("paragraph");
        var new_paragraph = document.createElement("p");
        new_paragraph.innerText = (length + 1).toString() + "." + " " + subTitleInputName.value;
        allContainers[allContainers.length - 1].appendChild(new_paragraph);

        subTitleInputName.value = "";
    });
});