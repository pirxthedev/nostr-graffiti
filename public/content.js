// Get element by id "graffitiLoaded"
// If it exists, then we have already injected the content script
// If it doesn't exist, then we need to inject the content script
// and add a listener for the message
graffitiLoaded = document.getElementById("graffitiLoaded");

if (!graffitiLoaded) {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (request.method === "getPublicKey") {
                sendResponse({pk: "hello"});
            }
        }
    );

    // Create a div to mark that we have injected the content script
    // This is to prevent us from injecting the content script multiple times
    // if the user clicks the extension icon multiple times
    var graffitiLoaded = document.createElement("div");
    graffitiLoaded.id = "graffitiLoaded";
    document.body.appendChild(graffitiLoaded);
}
