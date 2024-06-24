webstrate.on("loaded", function (webstrateId) {

  const addQuestion = (questionDocument) => {
    const question = document.querySelector('input[type="text"]').value
    document.querySelector("input[type='text']").value = ""
    if (question.trim() === "" || question == null) return
    var questionDiv = questionDocument.querySelector("#questionDiv")
    if (questionDiv == null) return
    var questionParagraph = questionDocument.createElement("p")
    questionParagraph.setAttribute("contenteditable", "")
    questionParagraph.className = "selected"
    questionParagraph.innerText = question
    questionDiv.insertAdjacentElement("afterend", questionParagraph)
  }

  const enterEventListener = (questionDocument) => {
    document
      .getElementById("questionInput")
      .addEventListener("keypress", (e) => {
        if (e.key == "Enter") {
          addQuestion(questionDocument)
        }
      })
  }

  const frame = document.getElementById("questionsFrame")
  frame.webstrate.on("transcluded", () => {
    console.log("Question transluded")
    var questionsDocument = frame.contentWindow.document
    document.getElementById("sendBtn").addEventListener("click", () => {
      addQuestion(questionsDocument)
    })
    enterEventListener(questionsDocument)
  })

  const slidesFrame = document.getElementById("contentIframe")
  slidesFrame.webstrate.on("transcluded", () => {
    console.log("Presentation transcluded")
  })

  const reviewsFrame = document.getElementById("reviewsIframe")
  reviewsFrame.webstrate.on("transcluded", () => {
    console.log("Presentation transcluded")
  })

})
