function createSection(buttonId) {
    document.getElementById(buttonId).addEventListener("click", function() { handleButtonClick(buttonId); });
}

function init() {
    createSection("artButton");
    createSection("aboutButton");
    createSection("workButton");
}

function handleButtonClick(buttonId) {
    var divToShow = document.getElementById(buttonId + "Div");
    var button = document.getElementById(buttonId);
    if (divToShow.style.display === "block") {
        divToShow.style.display = "none";
        button.style.color = ""; // Reset color when not selected
    } else {
        var divsToHide = document.getElementsByClassName("floating");
        for (var i = 0; i < divsToHide.length; i++) {
            divsToHide[i].style.display = "none";
            var divButtonReturn = document.getElementById(divsToHide[i].id.replace("Div", ""));
            divButtonReturn.style.color = "rgb(255, 255, 255)"; // Reset color for other buttons to white
        }
        divToShow.style.display = "block";
        button.style.color = "#00b3ff"; // Change button text color to light blue when selected
    }
}


init();
