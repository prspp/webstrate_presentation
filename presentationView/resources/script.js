webstrate.on("loaded", function(webstrateId) {
    var frame = document.getElementById("questionsFrame");
    frame.webstrate.on("transcluded", () => {
        var questionsDocument = frame.contentWindow.document;
        var container = questionsDocument.getElementById("container");
        document.getElementById('send').addEventListener('click',() => {
            const question = document.querySelector('input[name="question"]').value;
            document.querySelector("input[name='question']").value = "";
            if(question.trim() === "" || question == null) return;
            container.insertAdjacentHTML("afterbegin", `<div>${question}</div>`);
        })
    });
});