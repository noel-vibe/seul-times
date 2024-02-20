const API_KEY = `cd07bb6bc3654d55bea35f015d942fbb`
let news = []

const getLatesNews = async()=>{
    const url = new URL(`https://seul-times.netlify.app/top-headlines?country=us&apiKey=${API_KEY}`)
    const response = await fetch(url)
    const data = await response.json()
    news = data.articles
    console.log("ddd", news)
}
 
getLatesNews()
