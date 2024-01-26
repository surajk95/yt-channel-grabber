let timeout = 3000, timeoutId = null

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === 'get_url') {
            sendResponse({ message: window.location.href })
        }
        else if (request.message === 'scroll_to_bottom') {
            sendResponse({ message: 'scrolling' })
            scrollToBottom(0)
        }
        else if (request.message === 'stop_capture') {
            stopScrolling()
            grabData()
        }
        else if (request.message === 'update_timeout') {
            timeout = request.data
            sendResponse(`Updated timeout to ${timeout}`)
        }
        return true
    }
);

function scrollToBottom(oldHeight) {
    window.scrollTo(0, document.querySelector("#content").scrollHeight)
    const newHeight = document.querySelector("#content").scrollHeight

    if (newHeight === oldHeight) {
        //send message for next step
        sendMessage(`scroll complete`)
    }
    else {
        timeoutId = setTimeout(() => scrollToBottom(newHeight), timeout)
    }
}

function stopScrolling() {
    clearTimeout(timeoutId)
}

function grabData() {
    const data = processPage()
    sendMessage(`channel_data`, data)
}

function processPage() {
    try {
        const data = Array.from(document.querySelectorAll('#video-title-link'))
        .filter(i => i.getAttribute('aria-label'))
        .map(i => {
            return {
            link: i.href.split('&')[0],
            title: i.getAttribute('aria-label').match(/(.+)\sby/)[1],
            date: i.getAttribute('aria-label').match(/(\d+)\s(\w+)\sago/).slice(1, 3),
            duration: i.getAttribute('aria-label').match(/ago\s(.+)/)[1],
            views: parseInt(i.getAttribute('aria-label').match(/([0-9.,]+)\sviews/)[1].replace(',', ''))
    }})
    const channel_name = document.querySelector('#meta').querySelector('#text').innerText
    const channel_handle = document.querySelector('#meta').querySelector('#channel-handle').innerText
    const subscriber_count = parseInt(document.querySelector('#meta').querySelector('#subscriber-count').innerText)
    const videos_count = parseInt(document.querySelector('#meta').querySelector('#subscriber-count').innerText)
    const tagline = document.querySelector('#meta').querySelector('#channel-tagline').querySelector('#content').innerText
    const channel_image = document.querySelector('#avatar').querySelector('img').src
    const response = {
        data: data,
        meta: {
            channel_name: channel_name,
            channel_handle: channel_handle,
            subscriber_count: subscriber_count,
            videos_count: videos_count,
            tagline: tagline,
            channel_image: channel_image
        },
        lastUpdated: new Date()
    }
    return response
    }
    catch(err) {
        sendMessage('An error occured. If this keeps happening, please report to fvrtrp@gmail.com')
    }
}



function sendMessage(message, data) {
    const response = chrome.runtime.sendMessage({ message: message, data })
}