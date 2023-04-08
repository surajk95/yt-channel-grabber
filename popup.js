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

startButton.addEventListener('click', (event) => {
    (async () => {
        const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
        console.log(`resp`, tab)
        const response = await chrome.tabs.sendMessage(tab.id, {message: "scrollToBottom"});
        // do something with response here, not outside the function
        console.log(response);
      })();
})