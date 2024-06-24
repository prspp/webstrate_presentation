webstrate.on("loaded", function (webstrateId) {

  const addQuestion = (document) => {
    const question = document.querySelector('input[type="text"]').value
    document.querySelector("input[type='text']").value = ""
    if (question.trim() === "" || question == null) return
    var questionDiv = document.querySelector("#questionDiv")
    if (questionDiv == null) return
    questionDiv.insertAdjacentHTML(
      "afterend",
      `<p contenteditable class="selected">${question}</p>`
    )
  }

  const enterEventListener = (document) => {
    document
      .getElementById("questionInput")
      .addEventListener("keypress", (e) => {
        if (e.key == "Enter") {
          addQuestion(document)
        }
      })
  }

  const frame = document.getElementById("questionsFrame")
  frame.webstrate.on("transcluded", () => {
    var questionsDocument = frame.contentWindow.document
    var container = questionsDocument.getElementById("questionDiv")
    document.getElementById("sendBtn").addEventListener("click", () => {
      addQuestion(document)
    })
    enterEventListener(document)
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
