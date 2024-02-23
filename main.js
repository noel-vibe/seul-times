//작성자 곽슬기
//이 파일의 역할 / API 이용 뉴스타임즈 만들기
//시작 날짜 2024/2/19 / 마지막 업데이트 날짜 2024/2/24

const API_KEY = `cd07bb6bc3654d55bea35f015d942fbb`;
let newsList = [];
let url = new URL(`https://seul-times.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`);
//let url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);


const getNews = async () => {
  //try - catch 에러 핸들링.
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No matches for your search");
      }
      newsList = data.articles; //방금 검색해서 가져온 뉴스 담기
      render(); //담긴 뉴스 보여주기!
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatesNews = async () => {
  url = new URL(`https://seul-times.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`)
  //url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
  getNews();
};

//카테고리별 뉴스 가져오기
const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://seul-times.netlify.app/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`)
  //url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`);
  getNews();
};

//키워드로 검색한 뉴스 가져오기
const getNewsByKeyword = async (event) => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(`https://seul-times.netlify.app/top-headlines?q=${keyword}&country=kr&apiKey=${API_KEY}`)
  //url = new URL(`https://newsapi.org/v2/top-headlines?q=${keyword}&country=kr&apiKey=${API_KEY}`);
  getNews();
};

const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `<div class ="row news">
    <div class = "col-lg-4">
        <img class ="news-img-size" src="${
          news.urlToImage ||
          "https://resource.rentcafe.com/image/upload/q_auto,f_auto,c_limit,w_576/s3/2/50552/image%20not%20available(33).jpg"
        }"/>
    </div>
    <div class = "col-lg-8">
        <h3>${news.title}</h3>
        <p>
            ${
              news.description == null || news.description == ""
                ? "내용없음"
                : news.description.length > 200
                ? news.description.substring(0, 200) + "..."
                : news.description
            }
        </p>
        <div>
            ${news.source.name || "no source"} * ${moment(
        news.publishedAt
      ).fromNow()}
        </div>
    </div>
</div>`
    )
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

//에러핸들링 - 200외의 에러 났을때 보여줄 render
const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

//버튼들에 클릭이벤트 주기
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);
const sideMenu = document.querySelectorAll(".side-menu-list button");
sideMenu.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

//돋보기 버튼 눌렀을때 input box 나오게 하기
const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

// 오늘 날짜 시간 출력
const clock = document.querySelector(".clock");
const today = document.querySelector(".today");

function getClock() {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  clock.innerText = `${hours}시${minutes}분${seconds}초`;
}

getClock();
setInterval(getClock, 1000);

function getToday() {
  const todaydate = new Date();
  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "긑요일",
    "토요일",
  ];
  const days_num = todaydate.getDay();

  const year = todaydate.getFullYear();
  const month = todaydate.getMonth() + 1;
  const date = todaydate.getDate();
  const day = days[days_num];

  today.innerText = `${year}년 ${month}월 ${date}일 ${day}`;
}
getToday();
//오늘 날짜 시간 출력 끝

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

getLatesNews();
