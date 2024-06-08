webstrate.on("loaded", function(webstrateId){
    let paragraphs = document.querySelectorAll("p");
    function init() {
        document.getElementById("bin").addEventListener("click", () => {
            var selected = document.getElementsByClassName("selected");
            if(selected.length != 0) {
                item = selected[0];
                item.remove();
            }
        });

        paragraphs.forEach(paragraph => {
            paragraph.addEventListener("click", () => {
                if(paragraph.classList.contains("selected")) {
                    paragraph.classList.remove("selected");
                }
                else {
                    paragraph.classList.add("selected");
                }
            })
        });
    }

    init();
});