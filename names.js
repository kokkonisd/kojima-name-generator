document.addEventListener("DOMContentLoaded", function (event) { 
    const queryString = window.location.search;
    const URLParams = new URLSearchParams(queryString);

    let nameCategories = [
        ["normal-name", "normalNames"],
        ["occupational-name", "occupationalNames"],
        ["horny-name", "hornyNames"],
        ["the-name", "theNames"],
        ["cool-name", "coolNames"],
        ["violent-name", "violentNames"],
        ["name-that-lacks-subtext", "subtextNames"],
    ];

    nameCategories.forEach(function(categoryInfo) {
        let elementID = categoryInfo[0];
        let URIComponentName = categoryInfo[1];

        let names = URLParams.get(URIComponentName) || "unknown";
        names = names.replaceAll(",", " <em>or</em> ");

        document.getElementById(elementID).innerHTML = names;
    });


    document.getElementById("submit-button").addEventListener(
        "click",
        function(event) {
            window.location.href = "index.html";
        }
    );
});
