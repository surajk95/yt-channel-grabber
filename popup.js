const TIMEOUT = 3000
let capturing = false

const urlPattern = /youtube\.com.+videos/
let startButton = document.querySelector("#start")
const resultContainer = document.querySelector("#result")
const errorContainer = document.querySelector("#error")

window.onload = () => {
    console.log(`init...`)
    checkUrlValidity()
}

async function checkUrlValidity() {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true})
    const response = await chrome.tabs.sendMessage(tab.id, {message: "get_url"})
    const url = response.message
    if(url.match(/https:\/\/www\.youtube.com\/.+\/videos/)) {
        show({
            message: `valid youtube channel url`
        })
        //show start button
        document.querySelector('#start').style.display = 'initial'
        startButton.addEventListener('click', (event) => {toggleCapture()})
    }
    else {
        show({
            message: `Not a valid url. Go to the Videos tab on a youtube channel`,
            type: 'error'
        })
    }
}

function show(payload) {
    const el = document.querySelector('#message')
    if(!payload.message) {
        el.innerText = ''
        return
    }
    el.innerText = payload.message
    el.className = payload.type || 'success'
}

function toggleCapture() {
    if(!capturing) {
        startButton.innerText = 'Stop'
        startCapture()
    }
    else {
        startButton.innerText = 'Start'
        stopCapture()
    }
    capturing = !capturing
}
async function startCapture() {
    show({
        message: 'Scrolling down...', type: 'success'
    })
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {message: "scroll_to_bottom", timeout: TIMEOUT});
    // do something with response here, not outside the function
    if(!response) {
        //throw error about adblock possibly interfering
    }
}
async function stopCapture() {
    show({
        message: 'Capture stopped', type: 'success'
    })
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {message: "stop_capture", timeout: TIMEOUT});
    // do something with response here, not outside the function
    if(!response) {
        //throw error about adblock possibly interfering
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // console.log(`new message:`, request, sender.tab ?
        //           "from a content script:" + sender.tab.url :
        //           "from the extension");
        if(request.message==='scroll complete') {
            toggleCapture()
        }
        else if(request.message==='channel_data') {
            show({
                message: 'Data copied to clipboard', type: 'success'
            })
            navigator.clipboard.writeText(JSON.stringify(request.data))
        }
        if (request.message === "hello")
            sendResponse({farewell: "goodbye"});
    }
)