webstrate.on("loaded", function(webstrateId) {
    var frame = document.getElementById("questionsFrame");
    frame.webstrate.on("transcluded", () => {
        var questionsDocument = frame.contentWindow.document;
        var container = questionsDocument.getElementById("container");
        document.getElementById('send').addEventListener('click',() => {
            const question = document.querySelector('input[name="question"]').value;
            document.querySelector("input[name='question']").value = "";
            if(question.trim() === "" || question == null) return;
            container.insertAdjacentHTML("afterbegin", `<p>${question}</p>`);

            // add click listener to the item
            let child = container.firstChild;
            child.addEventListener("click", () => {
                var itemClass = child.className;
                if(itemClass) {
                    child.removeAttribute("class");
                }
                else {
                    child.className = "selected";
                }
            });
        })
    });
});