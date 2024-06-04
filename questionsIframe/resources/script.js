document.getElementById("bin").addEventListener("click", () => {
    var selected = document.getElementsByClassName("selected");
    if(selected.length != 0) {
        item = selected[0];
        item.remove();
    }
});

const ws = new WebSocket(`ws://localhost:7007/questions/`);

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
};
