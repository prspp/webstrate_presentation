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

        // add event click listener to each question
        const observer = new MutationObserver(function(mutations_list) {
            mutations_list.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(added_node) {
                    if(added_node.className == 'selected') {
                        added_node.addEventListener("click", (event) => {
                            var itemClass = event.target.className;
                            if(itemClass) {
                                child.removeAttribute("class");
                            }
                            else {
                                child.className = "selected";
                            }
                        }); 
                        observer.disconnect();
                    }
                });
            });
        });
        
        observer.observe(document.querySelector("#container"), { subtree: false, childList: true });
    }

    init();
});