const API_KEY = `cd07bb6bc3654d55bea35f015d942fbb`
let newsList = []


let menus = document.querySelectorAll("#menu-list button");
menus.forEach((menu) =>
  menu.addEventListener("click", (e) => getNewsByTopic(e))
);


const getLatesNews = async()=>{
    const url = new URL(`https://seul-times.netlify.app/top-headlines?country=us&apiKey=${API_KEY}`)
    //const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`)
    const response = await fetch(url)
    const data = await response.json()
    newsList = data.articles
        render();
    console.log("ddd", newsList)
}

const render =()=>{
    const newsHTML = newsList.map(
    (news) => `<div class ="row news">
    <div class = "col-lg-4">
        <img class ="news-img-size" src="${news.urlToImage 
        || "https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_576/s3/2/50552/image%20not%20available(33).jpg"
    }"/>
    </div>
    <div class = "col-lg-8">
        <h2>${news.title}</h2>
        <p>
            ${news.description == null || news.description ==""? "내용없음"
        :news.description.length >200
        ?news.description.substring(0,200) + "..."
        :news.description}
        </p>
        <div>
            ${news.source.name || "no source"} * ${moment(news.publishedAt).fromNow()}
        </div>
    </div>
</div>`
    ).join("");
    console.log("html",newsHTML);

    document.getElementById('news-board').innerHTML = newsHTML;
}
 
const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
      inputArea.style.display = "none";
    } else {
      inputArea.style.display = "inline";
    }
  };

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }


getLatesNews();