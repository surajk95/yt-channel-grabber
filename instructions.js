
//INSPECT METHOD
//initial browser command for getting videos:
Array.from(document.querySelectorAll('#video-title-link'))
.filter(i => i.getAttribute('aria-label'))
.map(i => ({
    link: i.href.split('&')[0],
    title: i.getAttribute('aria-label').match(/(.+)\sby/)[1],
    date: i.getAttribute('aria-label').match(/(\d+)\s(\w+)\sago/).slice(1,3),
    duration: i.getAttribute('aria-label').match(/ago\s(.+)\s[0-9.,]+\sviews/)[1],
    views: parseInt(i.getAttribute('aria-label').match(/([0-9.,]+)\sviews/)[1].replace(',',''))
}))

//from each individual i:
link: i.href.split('&')[0]
title: i.getAttribute('aria-label').match(/(.+)\sby/)[1]
date: i.getAttribute('aria-label').match(/(\d)\s(\w+)\sago/)
duration: i.getAttribute('aria-label').match(/ago\s(.+)\s[0-9.,]+\sviews/)[1]
views: parseInt(i.getAttribute('aria-label').match(/([0-9.,]+)\sviews/)[1].replace(',',''))

//aria: i.getAttribute('aria-label')

//for extension (yt-channel-grabber):
// need to go to /videos page first, can automate this first if url not already ending with /videos
// 0.start (button)
// 1.scroll
// 2.capture
// 3.copy
// also work on capturing channel name, description, channel url, thumbnail etc.
//can scroll till end by detecting network response OR simple settimeout for 5 secs, then proceed
//to next step when scrollheight is same as before scrolling
//allow user to change timeoutvalue even while capturing
//const nodes = Array.from(document.querySelectorAll('#content'))
//const titles = Array.from(document.querySelectorAll('#video-title')).map(i => i.innerHTML)
// const viewsRaw = Array.from(document.querySelectorAll('#metadata-line')).map(i => i.querySelector(':nth-child(3)').innerHTML)
const links = Array.from(document.querySelectorAll('#video-title-link')).map(i => i.href.split('&')[0])
//aria label gives: title, time, duration, views after regex
const ariaLabels = Array.from(document.querySelectorAll('#video-title-link')).map(i => i.getAttribute('aria-label'))
//extract title, time, duration, views by regex



//API METHOD
use /browse api for fetching VideoColorSpace, process them

//extension:
//detect when a new /browse request is made, append to results -- check if first request or subsequent

//for videos
//when obj contains all contents (30 per iteration) of response from '/browse'
obj
.slice(0, obj.length-1)
.map(i => i.richItemRenderer.content.videoRenderer)
.map(i => ({
    title: i.title.runs[0].text,
    videoId: i.videoId,
    viewCountText: i.viewCountText.simpleText,
    description: i.descriptionSnippet.runs[0].text,
    duration: i.lengthText.simpleText,
    time: i.publishedTimeText.simpleText,
    }))


//for creator info
