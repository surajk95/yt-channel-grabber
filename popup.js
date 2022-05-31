// Initialize button with user's preferred color
let userInput = document.querySelector("#userInput")
const resultContainer = document.querySelector("#result")
const errorContainer = document.querySelector("#error")

userInput.addEventListener('input', (event) => {
    //fetch thumbnail
    console.log(`zzz`, event)
    const imageContainers = document.querySelectorAll(".imageContainer")
    imageContainers.forEach(i => {i.remove()})
    const result = fetchImage(event.target.value.trim())
    console.log(`zzzresult`, result)
    if(result.error) {
        errorContainer.innerHTML = result.error
        errorContainer.style.display = 'block'
        resultContainer.style.display = 'none'
    }
    else {
        errorContainer.style.display = 'none'
        resultContainer.style.display = 'flex'
        let imgContainer = null
        if(result.maxres) {
            imgContainer = document.createElement("img")
            imgContainer.src = result.maxres
            imgContainer.classList.add("imageContainer")
            resultContainer.appendChild(imgContainer)
        }
        if(result.hq) {
            imgContainer = document.createElement("img")
            imgContainer.src = result.hq
            imgContainer.classList.add("imageContainer")
            resultContainer.appendChild(imgContainer)
        }
        if(result.mq) {
            imgContainer = document.createElement("img")
            imgContainer.src = result.mq
            imgContainer.classList.add("imageContainer")
            resultContainer.appendChild(imgContainer)
        }
    }
    //resultContainer.innerHTML = event.target.value
})

const fetchImage = (url) => {
    try {
        let aaa = /(.*)(com|be)\/(watch\?v=)?(.{11})[?|&]?.*/g;
        let imgUrl = aaa.exec(url)[4];
        //console.log(`${imgUrl}`);
        console.log("Fetching Image for "+url);
        let newmq="https://i.ytimg.com/vi/"+imgUrl+"/mqdefault.jpg";
        let newhq="https://i.ytimg.com/vi/"+imgUrl+"/hqdefault.jpg";
        let newmaxres="https://i.ytimg.com/vi/"+imgUrl+"/maxresdefault.jpg";
        //console.log(newImgUrl);
        return({
            mq: newmq,
            hq: newhq,
            maxres: newmaxres
        })
    }
    catch {
    //console.log(`error`);
    return ({error: `Link is not valid, please try with a different one.`})
    }
  }