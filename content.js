let timeout = 3000

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(`new message in content.js`, sender)
        if(request.message==='scrollToBottom') {
            timeout = request.timeout
            scrollToBottom(0)
        }
        sendResponse({message: 'scrolling'})
        return true
    }
);

function scrollToBottom(oldHeight) {
    console.log(`trying to scroll`, oldHeight)
    window.scrollTo(0, document.querySelector("#content").scrollHeight)
    const newHeight = document.querySelector("#content").scrollHeight

    if(newHeight===oldHeight) {
        //send message for next step
        console.log(`cannot scroll further`, oldHeight, newHeight)
        sendMessage(`scroll complete`)
    }
    else {
        console.log(`will scroll again`)
        setTimeout(()=>scrollToBottom(newHeight), timeout)
    }
}

function sendMessage(message) {
    const response = chrome.runtime.sendMessage({message: message})
}