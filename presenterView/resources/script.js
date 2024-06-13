// document.addEventListener("DOMContentLoaded", () => {
webstrate.on("loaded", function (webstrateId, clientId, user) {
  console.log("Script loaded.")

  // ### REFERENCES TO DOM ELEMENTS ##
  const mainIframe = document.getElementById("contentIframe")
  const getIframeDocument = (i) => i.contentDocument || i.contentWindow.document

  const documentUrlInput = document.getElementById("documentUrlInput")
  const loadButton = document.getElementById("loadButton")
  const questionBox = document.getElementById("questionBox")
  const questionIframe = document.getElementById("questionIframe")

  // ### VALUES OF THE APPLICATION ###
  let defaultWebstrateUrl, webstrateUrl

  webstrateUrl = ""
  defaultWebstrateUrl = "/frontpage"

  if (documentUrlInput.value) {
    mainIframe.src = documentUrlInput.value
  } else {
    mainIframe.src = defaultWebstrateUrl
    documentUrlInput.value = defaultWebstrateUrl
  }

  loadButton.addEventListener("click", (event) => {
    mainIframe.src = documentUrlInput.value || defaultWebstrateUrl
    console.log("reload asked")
  })

  questionBox.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
      event.preventDefault() // Ensure it is only this code that runs
      let msg = questionBox.value
      questionBox.value = ""

      let doc = getIframeDocument(questionIframe)
      let p = doc.createElement("p")
      p.textContent = msg
      doc.body.append(p)
    }
  })

  mainIframe.webstrate.on(
    "transcluded",
    function (webstrateId, clientId, user) {
      console.log("mainIframe load event")
    }
  )
})
