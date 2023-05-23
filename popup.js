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
    console.log(`validity`, response)
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
    console.log(`capturing`)
    show({
        message: 'Capturing', type: 'success'
    })
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    console.log(`tab resp`, tab)
    const response = await chrome.tabs.sendMessage(tab.id, {message: "scroll_to_bottom", timeout: TIMEOUT});
    // do something with response here, not outside the function
    if(!response) {
        //throw error about adblock possibly interfering
    }
    console.log(`message response`, response);
}
async function stopCapture() {
    console.log(`stopping capture`)
    show({
        message: 'Capture stopped', type: 'success'
    })
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    console.log(`tab resp`, tab)
    const response = await chrome.tabs.sendMessage(tab.id, {message: "stop_capture", timeout: TIMEOUT});
    // do something with response here, not outside the function
    if(!response) {
        //throw error about adblock possibly interfering
    }
    console.log(`message response`, response);
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(`new message:`, request, sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
        if(request.message==='scroll complete') {
            console.log('finished scroll!')
            toggleCapture()
        }
        else if(request.message==='channel_data') {
            console.log(`received data`, request.data)
            show({
                message: 'Data copied to clipboard', type: 'success'
            })
            navigator.clipboard.writeText(JSON.stringify(request.data))
        }
        if (request.message === "hello")
            sendResponse({farewell: "goodbye"});
    }
)

//capture function
function captureData() {
    try {
        const data = Array.from(document.querySelectorAll('#video-title-link'))
        .filter(i => i.getAttribute('aria-label'))
        .map(i => ({
            link: i.href.split('&')[0],
            title: i.getAttribute('aria-label').match(/(.+)\sby/)[1],
            date: i.getAttribute('aria-label').match(/(\d+)\s(\w+)\sago/).slice(1,3),
            duration: i.getAttribute('aria-label').match(/ago\s(.+)\s[0-9.,]+\sviews/)[1],
            views: parseInt(i.getAttribute('aria-label').match(/([0-9.,]+)\sviews/)[1].replace(',',''))
        }))
    }
    catch(e) {
        console.log(`error in capturing data`)
        //throw error in extension as well
    }
}