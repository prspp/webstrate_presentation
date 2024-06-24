webstrate.on("loaded", function (webstrateId) {
  const tocIframeBtn = document.getElementById("tocIframeBtn")
  const reviewsIframeBtn = document.getElementById("reviewsIframeBtn")
  const tocIframe = document.getElementById("tocIframe")
  const reviewsIframe = document.getElementById("reviewsIframe")

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

  reviewsIframeBtn.addEventListener("click", (event) => {
    reviewsIframeBtn.classList.add("btn-active")
    reviewsIframe.classList.remove("display-none")
    tocIframeBtn.classList.remove("btn-active")
    tocIframe.classList.add("display-none")
  })

  tocIframeBtn.addEventListener("click", (event) => {
    reviewsIframeBtn.classList.remove("btn-active")
    reviewsIframe.classList.add("display-none")
    tocIframeBtn.classList.add("btn-active")
    tocIframe.classList.remove("display-none")
  })

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
