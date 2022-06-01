// Initialize button with user's preferred color
let userInput = document.querySelector("#userInput")
const resultContainer = document.querySelector("#result")
const errorContainer = document.querySelector("#error")

userInput.addEventListener('input', (event) => {
    //fetch thumbnail
    const imageParents = document.querySelectorAll(".imageParent")
    imageParents.forEach(i => {i.remove()})
    const result = fetchImage(event.target.value.trim())
    if(result.error) {
        errorContainer.innerHTML = result.error
        errorContainer.style.display = 'block'
        resultContainer.style.display = 'none'
    }
    else {
        errorContainer.style.display = 'none'
        resultContainer.style.display = 'flex'
        let imgContainer = null, imgParent = null, imgLink = null, imgDesc = null
        if(result.maxres) {
            imgParent = document.createElement('div')
            imgParent.classList.add("imageParent")
            imgDesc = document.createElement('div')
            imgDesc.innerHTML = 'highest quality'
            imgParent.appendChild(imgDesc)
            imgLink = document.createElement('a')
            imgLink.href = result.maxres
            imgLink.setAttribute('target', '_blank')
            imgContainer = document.createElement("img")
            imgContainer.src = result.maxres
            imgContainer.classList.add("imageContainer")
            imgLink.appendChild(imgContainer)
            imgParent.appendChild(imgLink)
            resultContainer.appendChild(imgParent)
        }
        if(result.hq) {
            imgParent = document.createElement('div')
            imgParent.classList.add("imageParent")
            imgDesc = document.createElement('div')
            imgDesc.innerHTML = 'medium quality'
            imgParent.appendChild(imgDesc)
            imgLink = document.createElement('a')
            imgLink.href = result.hq
            imgLink.setAttribute('target', '_blank')
            imgContainer = document.createElement("img")
            imgContainer.src = result.hq
            imgContainer.classList.add("imageContainer")
            imgLink.appendChild(imgContainer)
            imgParent.appendChild(imgLink)
            resultContainer.appendChild(imgParent)
        }
        if(result.mq) {
            imgParent = document.createElement('div')
            imgParent.classList.add("imageParent")
            imgDesc = document.createElement('div')
            imgDesc.innerHTML = 'lowest quality'
            imgParent.appendChild(imgDesc)
            imgLink = document.createElement('a')
            imgLink.href = result.mq
            imgLink.setAttribute('target', '_blank')
            imgContainer = document.createElement("img")
            imgContainer.src = result.mq
            imgContainer.classList.add("imageContainer")
            imgLink.appendChild(imgContainer)
            imgParent.appendChild(imgLink)
            resultContainer.appendChild(imgParent)
        }
    }
})

const fetchImage = (url) => {
    try {
        let aaa = /(.*)(com|be)\/(watch\?v=)?(.{11})[?|&]?.*/g;
        let imgUrl = aaa.exec(url)[4];
        let newmq="https://i.ytimg.com/vi/"+imgUrl+"/mqdefault.jpg";
        let newhq="https://i.ytimg.com/vi/"+imgUrl+"/hqdefault.jpg";
        let newmaxres="https://i.ytimg.com/vi/"+imgUrl+"/maxresdefault.jpg";
        return({
            mq: newmq,
            hq: newhq,
            maxres: newmaxres
        })
    }
    catch {
    return ({error: `Link is not valid, please try with a different one.`})
    }
  }