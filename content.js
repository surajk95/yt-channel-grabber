chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender)
        if(request.message==='scrollToBottom') {
            window.scrollTo(0, document.body.scrollHeight)
        }
        sendResponse({farewell: "goodbye"})
        return true
    }
);