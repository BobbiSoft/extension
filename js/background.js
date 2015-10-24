/* global chrome */

(function () {
    var SCRIPT_URL = location.protocol + "//schedule-extensione.rhcloud.com/js/menupicker.js";

    var code = "";
    var data = {schedule: null, anchor: null};

    var x = new XMLHttpRequest();
    x.onload = function () {
        code = x.responseText;
    };

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.text === "init") return sendResponse(code);
        if (message.text === "schedule") {
            if (message.data) {
                data.schedule = message.data.schedule;
                data.anchor = message.data.anchor;
            } else sendResponse(data);
            return;
        }
    });
    x.open("GET", SCRIPT_URL);
    x.send();

    chrome.runtime.onMessageExternal.addListener(function (message) {
        data.schedule = null;
        data.anchor = null;
        localStorage.setItem("id", message.id);
        localStorage.setItem("group", message.group);
    });
})();