document.getElementById('userQuestion').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    const question = document.querySelector('input[name="question"]').value;
    document.querySelector("input[name='question']").value = "";
    if(question.trim() === "" || question == null) return;

    try {
        var send = await fetch("/questions/", {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ question })
        });
        var response = send.json();
        console.log("Success : ", response);
    }
    catch(error){
        console.error('Error:', error);
    };
});