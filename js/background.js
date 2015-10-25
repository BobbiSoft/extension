/* global chrome */

(function () {
    var SCRIPT_URL = "https://schedule-extensione.rhcloud.com/js/menupicker.js";

    var code = "";
    var data = null;

    var x = new XMLHttpRequest();
    x.onload = function () {
        code = x.responseText;
    };

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.text === "init") return sendResponse(code);
        if (message.text === "schedule") {
            if (message.data) {
                data = message.data;
            } else sendResponse(data);
            return;
        }
    });
    x.open("GET", SCRIPT_URL);
    x.send();

    chrome.runtime.onMessageExternal.addListener(function (message) {
        data = null;
        localStorage.setItem("id", message.id);
        localStorage.setItem("group", message.group);
    });
})();