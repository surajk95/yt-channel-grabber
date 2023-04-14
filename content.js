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

function scrollToBottom(oldHeight) {
    window.scrollTo(0, document.body.scrollHeight)
    const newHeight = document.documentElement.scrollHeight
    if(newHeight===oldHeight) {
        //send message for next step
        console.log(`cannot scroll further`)
    }
    else {
        scrollToBottom(newHeight)
    }
}