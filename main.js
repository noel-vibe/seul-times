//작성자 곽슬기
//이 파일의 역할 / API 이용 뉴스타임즈 만들기
//시작 날짜 2024/2/19 / 마지막 업데이트 날짜 2024/2/24

const API_KEY = `cd07bb6bc3654d55bea35f015d942fbb`;
let newsList = [];
let url = new URL(`https://seul-times.netlify.app/top-headlines?country=kr&apiKey=${API_KEY}`);
//let url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;


const getNews = async () => {
  //try - catch 에러 핸들링.
  try {
      url.searchParams.set("page",page); // url에 &page=${page} 삽입
      url.searchParams.set("pageSize",pageSize);
      
      const response = await fetch(url);
      const data = await response.json();
    console.log("data",data);
    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No matches for your search");
      }
      newsList = data.articles; //방금 검색해서 가져온 뉴스 담기
      totalResults = data.totalResults //data에 총 뉴스 개수 담기
      render(); //담긴 뉴스 보여주기!
      paginationRender(); //페이지네이션 보여주기
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

////////페이지네이션///////
const paginationRender = ()=>{
  //totalResults
  //page
  //pageSize
  //groupSize
  //totalPages   총 페이지 수(14pages) = (총결과값(ex.134)/한페이지에 보여줄 컨텐츠 수(10개))
  const totalPages = Math.ceil(totalResults / pageSize);

  //pageGroup    현재 페이지 그룹(3개)  = (현재 페이지 (ex.12)/페이지 몇개 단위로 보여줄거니(5개))
  const pageGroup = Math.ceil(page/groupSize);

  //lastPage     마지막 페이지(15pages) = (현재 페이지 그룹(3개) * 페이지 몇개 단위로 보여줄거니(5개))
  let lastPage = pageGroup * groupSize;

  //총 페이지 수가(14pages) 마지막 페이지(15pages)보다 작다면 lastpage(14) <= (14)totalpage
  if(lastPage > totalPages){
    lastPage = totalPages;
  }
  
  //firstPage //0보다 작으면 1로. 아니면 계산값 그대로
  //const firstPage = lastPage - (groupSize-1) <=0? 1 : lastPage - (groupSize-1); 
  let firstPage = lastPage - 4 <= 0 ? 1 : lastPage - 4; // 첫그룹이 5이하이면
  
  
  let paginationHTML = ''

  if(firstPage >=6){ 
    paginationHTML += `<li class="page-item" onclick ="moveToPage(1)"><a class="page-link" href='#js-bottom'>&lt;&lt;</a></li>
                    <li class="page-item" onclick ="moveToPage(${page-1})"><a class="page-link" href='#js-bottom'><</a></li>`
  }
  
  for (let i = firstPage; i <=lastPage; i++){
    paginationHTML+=`<li class="page-item ${i===page?'active':''}"  onclick="moveToPage(${i})"><a class="page-link" href='#js-bottom'>${i}</a></li>`
  } //1부터 마지막페이지 까지 반복. 선택된 페이지를 paginationHTML에 입력
  //${i===page?'active':''} 현재 페이지네이션에 엑티브 클래스 주기 / 클래스 "" 안에 입력해야함!

  if(lastPage < totalPages){
    paginationHTML += `<li class="page-item" onclick ="moveToPage(${page+1})"><a class="page-link" href='#js-bottom'>&gt;</a></li>
                      <li class="page-item" onclick ="moveToPage(${totalPages})"><a class="page-link" href='#js-bottom'>&gt;&gt;</a></li>`
  }
  document.querySelector(".pagination").innerHTML=paginationHTML
};

const moveToPage = (pageNum)=>{ // onclick i를 매개변수로 pageNum에 입력
  
  console.log("moveToPage",pageNum);
  page = pageNum;
  getNews()
}

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
