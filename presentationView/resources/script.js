webstrate.on("loaded", function (webstrateId) {
  var frame = document.getElementById("questionsFrame")
  frame.webstrate.on("transcluded", () => {
    var questionsDocument = frame.contentWindow.document
    var container = questionsDocument.getElementById("questionDiv")
    document.getElementById("send").addEventListener("click", () => {
      const question = document.querySelector('input[name="question"]').value
      document.querySelector("input[name='question']").value = ""
      if (question.trim() === "" || question == null) return
      container.insertAdjacentHTML(
        "afterend",
        `<p contenteditable class="selected">${question}</p>`
      )
    })
  })
})
