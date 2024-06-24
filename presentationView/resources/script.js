webstrate.on("loaded", function (webstrateId) {
  const tocIframeBtn = document.getElementById("tocIframeBtn")
  const reviewsIframeBtn = document.getElementById("reviewsIframeBtn")
  const tocIframe = document.getElementById("tocIframe")
  const reviewsIframe = document.getElementById("reviewsIframe")

  let currentSlideIndex = 0;

  const nextBtn = document.getElementById("nextBtn")
  const previousBtn = document.getElementById("previousBtn")


  const getComputedProp = (e, prop) => {
    const s = document.defaultView.getComputedStyle(e)[prop]
    const ss = Number(s.substring(0, s.length - 2))
    return ss
  }

  const scrollToSlide = (iframe, index) => {
    const e = iframe.contentWindow.document.children[0]
    const ss = getComputedProp(e, "height")
    e.scrollTo(0, index * ss)
  }

  previousBtn.addEventListener("click", () => {
    if (currentSlideIndex === 0) return
    currentSlideIndex--;
    scrollToSlide(document.getElementById("contentIframe"), currentSlideIndex)
  })

  nextBtn.addEventListener("click", () => {
    // if (currentSlideIndex === 0) return
    currentSlideIndex++;
    scrollToSlide(document.getElementById("contentIframe"), currentSlideIndex)
  })



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
