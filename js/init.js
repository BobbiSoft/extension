/* global chrome */

(function () {
    chrome.runtime.sendMessage({text: "init"}, function (code) {
        var script = document.createElement("script");
        script.innerText = code + "asDsd23nndj34Dad('" + chrome.runtime.id + "');delete window.asDsd23nndj34Dad;";
        document.head.appendChild(script);
        script.onload = function () {
            document.head.removeChild(script);
        };
    });
})();