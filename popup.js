let TIMEOUT = 3000
let capturing = false
let channelData = ''

const urlPattern = /youtube\.com.+videos/
let startButton = document.querySelector("#start")
let copyButton = document.querySelector('#copy')
const resultContainer = document.querySelector("#result")
const errorContainer = document.querySelector("#error")
const timeoutInput = document.querySelector('#timeoutInput')

window.onload = () => {
    console.log(`init...`)
    checkUrlValidity()
}

async function checkUrlValidity() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
        const response = await chrome.tabs.sendMessage(tab.id, { message: "get_url" })
        const url = response.message
        if (url.match(/https:\/\/www\.youtube.com\/.+\/videos/)) {
            show({
                message: `You're on a valid youtube channel url`
            })
            //show start button
            startButton.style.display = 'initial'
            startButton.addEventListener('click', (event) => { toggleCapture() })
            //hide copy button
            copyButton.style.display = 'none'
            copyButton.addEventListener('click', (event) => { copyToClipboard() })
        }
        else {
            show({
                message: `Go to the Videos tab on a youtube channel to get started. Refresh the page if you're already on Videos tab, but Start button isn't showing up.`,
                type: 'error'
            })
        }
    } catch (e) {
        show({
            message: `Go to the Videos tab on a youtube channel to get started.`,
            type: 'error'
        })
    }
    setState()
    addEventListeners()
}

function addEventListeners() {
    document.querySelector('#updateTimeout').addEventListener('click', function (e) {
        updateTimeout()
    })
}

function setState() {
    timeoutInput.value = TIMEOUT
}

function show(payload) {
    const el = document.querySelector('#message')
    if (!payload.message) {
        el.innerText = ''
        return
    }
    el.innerText = payload.message
    el.className = payload.type || 'success'
}

function toggleCapture() {
    if (!capturing) {
        startButton.innerText = 'Stop'
        copyButton.style.display = 'none'
        startCapture()
    }
    else {
        startButton.innerText = 'Start'
        copyButton.style.display = 'initial'
        stopCapture()
    }
    capturing = !capturing
}
async function startCapture() {
    show({
        message: 'Scrolling down...', type: 'success'
    })
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { message: "scroll_to_bottom", timeout: TIMEOUT });
    if (!response) {
        //throw error about adblock possibly interfering
    }
}
async function stopCapture() {
    show({
        message: 'Capture stopped', type: 'success'
    })
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { message: "stop_capture", timeout: TIMEOUT });
    if (!response) {
        //throw error about adblock possibly interfering
    }
}

async function updateTimeout() {
    const val = timeoutInput.value
    TIMEOUT = val
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { message: "update_timeout", data: val });
    if (!response) {
        //throw error about adblock possibly interfering
    }
    else {
        show({
            message: response, type: 'success'
        })
    }
}

function copyToClipboard() {
    navigator.clipboard.writeText(channelData)
    show({
        message: 'Data copied to clipboard', type: 'success'
    })
}

//listeners
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // console.log(`new message:`, request, sender.tab ?
        //           "from a content script:" + sender.tab.url :
        //           "from the extension");
        if (request.message === 'scroll complete') {
            toggleCapture()
        }
        else if (request.message === 'channel_data') {
            channelData = JSON.stringify(request.data)
            copyToClipboard()
        }
        else if (request.message === "hello")
            sendResponse({ farewell: "goodbye" });
        else {
            show({
                message: 'An error occured. If this keeps happening, please report to fvrtrp@gmail.com',
                type: 'error',
            })
            return
        }
    }
)