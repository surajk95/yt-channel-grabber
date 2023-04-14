const TIMEOUT = 3000

const urlPattern = /youtube\.com.+videos/
let startButton = document.querySelector("#start")
const resultContainer = document.querySelector("#result")
const errorContainer = document.querySelector("#error")

window.onload = () => {
    console.log(`init ytcg`)
    // if (tab.url.match(urlPattern)) {
    //     console.log(`url match!`)
    // }
    // else {
    //     //throw error
    //     //dont show default screen
    // }
}



//listeners
startButton.addEventListener('click', (event) => {
    (async () => {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        console.log(`tab resp`, tab)
        const response = await chrome.tabs.sendMessage(tab.id, {message: "scrollToBottom", timeout: TIMEOUT});
        // do something with response here, not outside the function
        if(!response) {
            //throw error about adblock possibly interfering
        }
        console.log(`message response`, response);
      })();
})

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(`received message in popup`, sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
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