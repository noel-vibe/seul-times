const API_KEY = `cd07bb6bc3654d55bea35f015d942fbb`
let newsList = []

//버튼들에 클릭이벤트 주기
const menus = document.querySelectorAll(".menus button")
menus.forEach((menu)=>menu.addEventListener("click",(event)=>getNewsByCategory(event)));
const sideMenu = document.querySelectorAll(".side-menu-list button")
sideMenu.forEach((menu)=>menu.addEventListener("click",(event)=>getNewsByCategory(event)));

const getLatesNews = async()=>{
    const url = new URL(`https://seul-times.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`)
    //const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`)
    const response = await fetch(url)
    const data = await response.json()
    newsList = data.articles
        render();
    console.log("ddd", newsList)
}

//카테고리별 뉴스 가져오기
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  console.log("category",category);
  const url = new URL(`https://seul-times.netlify.app/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`)
  //const url = new URL (`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`)
  const response = await fetch(url)
  const data = await response.json()
  console.log("ddd", data)
  newsList = data.articles; //가져온 뉴스 
  render(); //가져온 뉴스 보여주기!
}

//키워드로 검색한 뉴스 가져오기
const getNewsByKeyword = async (event) => {
  const keyword = document.getElementById("search-input").value;
  const url = new URL(`https://seul-times.netlify.app/top-headlines?q=${keyword}&country=kr&apiKey=${API_KEY}`)
  //const url = new URL (`https://newsapi.org/v2/top-headlines?q=${keyword}&country=kr&apiKey=${API_KEY}`)
  const response = await fetch(url)
  const data = await response.json()

  newsList = data.articles; //방금 검색해서 가져온 뉴스 담기
  render(); //가져온 뉴스 보여주기!
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
   

    document.getElementById('news-board').innerHTML = newsHTML;
}

//돋보기 버튼 눌렀을때 input box 나오게 하기 
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