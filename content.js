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
    try {
        const data = processPage()
        sendMessage(`channel_data`, data)
    }
    catch(err) {
        sendMessage('error_in_processing')
    }
}

function processPage() {
    const data = Array.from(document.querySelectorAll('#video-title-link'))
    .filter(i => i.getAttribute('aria-label'))
    .map(i => {
        return {
        link: i.href.split('&')[0],
        title: i.getAttribute('aria-label').match(/(.+)\sby/)[1],
        date: getDate(i.getAttribute('aria-label').match(/(\d+)\s(\w+)\sago/).slice(1, 3)),
        duration: getDuration(i.getAttribute('aria-label').match(/ago\s(.+)/)[1]),
        views: parseInt(i.getAttribute('aria-label').match(/([0-9.,]+)\sviews/)[1].replaceAll(',', ''))
    }})
    const channel_name = document.querySelector('#meta').querySelector('#text').innerText
    const channel_handle = document.querySelector('#meta').querySelector('#channel-handle').innerText
    const subscriber_count = getCount(document.querySelector('#meta').querySelector('#subscriber-count').innerText.split(' ')[0])
    const videos_count = getCount(document.querySelector('#meta').querySelector('#videos-count').innerText.split(' ')[0])
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



function sendMessage(message, data) {
    const response = chrome.runtime.sendMessage({ message: message, data })
}

const getCount = (input) => {
    input = input.toLowerCase()
    const val = parseFloat(input)
    const multiplier = input[input.length-1]
    switch(multiplier) {
      case 'k': return val*1000
      case 'm': return val*1000000
      case 'b': return val*1000000000
      default: return val
    }
}

const getDate = (date) => {
    const quantity = date[0]
    const unit = date[1]
    switch(unit) {
      case 'day':
      case 'days': {
         const newDate = new Date()
         newDate.setDate(newDate.getDate() - quantity)
         return newDate
      }
      case 'week':
      case 'weeks': {
         const newDate = new Date()
         newDate.setDate(newDate.getDate() - quantity*7)
         return newDate
      }
      case 'month':
      case 'months': {
         const newDate = new Date()
         newDate.setMonth(newDate.getMonth() - quantity)
         return newDate
      }
      case 'year':
      case 'years': {
        const newDate = new Date()
        newDate.setFullYear(newDate.getFullYear() - quantity)
        return newDate
      }
      default: {}
    }
  }
  
  const getDuration = (duration) => {
    duration = duration.split(', ')
    let result = 0
    for (let i = 0; i < duration.length; i++) {
      const time = duration[i].split(' ')
      const quantity = parseInt(time[0])
      const unit = time[1]
      switch(unit) {
        case 'second':
        case 'seconds': {
          result += quantity
          break
        }
        case 'minute':
        case 'minutes': {
          result += quantity*60
          break
        }
        case 'hour':
        case 'hours': {
          result += quantity*60*60
          break
        }
      }
    }
    return parseInt(result)
  }
  