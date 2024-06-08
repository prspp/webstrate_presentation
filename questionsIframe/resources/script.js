document.getElementById("bin").addEventListener("click", () => {
    var selected = document.getElementsByClassName("selected");
    if(selected.length != 0) {
        item = selected[0];
        item.remove();
    }
});

var container = document.getElementById("container");

container.webstrate.on('message', function(data) {
    console.log("Hereooo");
    if (data.type === 'question') {
        const container = document.getElementById('container');
        const newQuestion = document.createElement('div');
        newQuestion.textContent = data.question;
        container.appendChild(newQuestion);
    }
});

/*const ws = new WebSocket(`ws://localhost:7007/questions/`);

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.question) {
        console.log(data.question);
        const questionsDiv = document.getElementById('container');
        const questionElement = document.createElement('p');
        questionElement.textContent = data.question;
        questionsDiv.appendChild(questionElement);
    }
};

ws.onerror = function(error) {
    console.error('WebSocket error:', error);
};

ws.onopen = function() {
    console.log('WebSocket connection established');
};

ws.onclose = function() {
    console.log('WebSocket connection closed');
};*/