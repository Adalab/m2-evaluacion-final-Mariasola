"use strict";
const input = document.querySelector(".search-input");
const btn = document.querySelector(".search-button");
const result = document.querySelector(".series-container");
const fav = document.querySelector(".fav-list");
let favList = [];
let list = [];

//Get and Save in LocalStorage
const getSavedFavsFromLocalStorage = JSON.parse(
  localStorage.getItem("userFavs")
);
const setFavsIntoLocalStorage = arr => {
  localStorage.setItem("userFavs", JSON.stringify(arr));
};

//Get series from API
const getDatafromApi = event => {
  event.preventDefault();
  fetch(`http://api.tvmaze.com/search/shows?q=${input.value}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        list = data;
        paintSeries(data);
      } else {
        result.innerHTML = "No hay resultados para esta búsqueda";
      }
    });
};

//paint series in DOM
const paintSeries = arrShows => {
  result.innerHTML = "";
  for (let i = 0; i < arrShows.length; i++) {
    const nameData = arrShows[i].show.name;
    const imgData = arrShows[i].show.image;

    //Containers and classes
    const boxShow = document.createElement("div");
    boxShow.classList.add("show-container");
    const nameShow = document.createElement("h4");
    nameShow.classList.add("name-show");
    const imgShow = document.createElement("img");
    imgShow.classList.add("img-show");

    const nameContentinData = document.createTextNode(nameData);
    if (imgData === null) {
      imgShow.src =
        "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
    } else {
      imgShow.src = imgData.medium || imgData.original;
    }

    result.appendChild(boxShow);
    boxShow.appendChild(imgShow);
    boxShow.appendChild(nameShow);
    nameShow.appendChild(nameContentinData);

    boxShow.addEventListener("click", pickAsFav);
  }
};

//Clear fav section in DOM
const clearFav = () => {
  fav.innerHTML = "";
};

//Paint fav shows in DOM
const paintFav = arr => {
  clearFav();

  const favList = document.createElement("li");
  favList.classList.add("fav-list");
  fav.appendChild(favList);

  for (let item of arr) {
    const favImgData = item.img;
    const favNameData = item.name;

    //Containers and classes
    const favBoxShow = document.createElement("li");
    favBoxShow.classList.add("fav-box-show");
    const favNameShow = document.createElement("h3");
    favNameShow.classList.add("fav-name-show");
    const favImgShow = document.createElement("img");
    favImgShow.classList.add("fav-img-show");
    const favDelete = document.createElement("div");
    favDelete.classList.add("fav-delete");

    const favNameContent = document.createTextNode(favNameData);
    favImgShow.src = favImgData;

    favList.appendChild(favBoxShow);
    favBoxShow.appendChild(favImgShow);
    favBoxShow.appendChild(favNameShow);
    favBoxShow.appendChild(favDelete);
    favNameShow.appendChild(favNameContent);

    favDelete.addEventListener("click", deleteFav);
  }
};

//Delete from fav
function deleteFav(e) {
  const trigger = e.currentTarget;
  const parent = trigger.parentElement;

  const img = parent.querySelector(".fav-img-show");
  const name = parent.querySelector(".fav-name-show");

  const favImg = img.src;
  const favName = name.innerHTML;

  const favObj = { img: favImg, name: favName };

  for (let fav of favList) {
    if (fav === favObj) {
      favList.splice(fav);
    }
  }
  setFavsIntoLocalStorage(favList);
  paintFav(favList);
}

//Pick series as fav
const pickAsFav = e => {
  const trigger = e.currentTarget;
  trigger.classList.toggle("fav-show");

  const img = trigger.querySelector(".img-show");
  const name = trigger.querySelector(".name-show");

  const favImg = img.src;
  const favName = name.innerHTML;

  const favObj = { img: favImg, name: favName };

  // favList.push(list[2]);

  if (trigger.classList.contains("fav-show")) {
    favList.push(favObj);
  }
  setFavsIntoLocalStorage(favList);
  paintFav(favList);
};
//Get from LocalStorage
const getFromLocalStorage = () => {
  if (getSavedFavsFromLocalStorage !== null) {
    favList = getSavedFavsFromLocalStorage;
    paintFav(getSavedFavsFromLocalStorage);
  } else {
    favList = [];
  }
};

getFromLocalStorage();
btn.addEventListener("click", getDatafromApi);
