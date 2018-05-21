function save_options() {
    var serverWithPort = document.getElementById("serverWithPort").value;

    chrome.storage.sync.set({
        serverWithPort: serverWithPort
    }, function () {
        var status = document.getElementById("status");
        status.textContent = "Saved.";
        setTimeout(function () {
            status.textContent = "";
        }, 1000);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        serverWithPort: ""
    }, function (items) {
        document.getElementById("serverWithPort").value = items.serverWithPort;
    });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);