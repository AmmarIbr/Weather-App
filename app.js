//This will request WeatherAPI to Autocomplete on KEYSTROKE (not including backspace)
const searchBox = document.querySelector(".search");
const searchSection = document.querySelector(".autoCompleteBox");
let currentTime = document.querySelector("#currentTime");
console.log(searchSection);
let query = "";
/*
async function autoComplete(e) {
  if (query.length <= 3 || query === "") {
    query = searchBox.value;
  } else {
    query = searchBox.value;
    console.log(query);
    const config = { params: { q: query } };
    const res = await axios.get(
      `https://api.weatherapi.com/v1/search.json?key=30832b5a2a13422485f64334231003`,
      config
    );
    for (let i = 0; i < searchResult.length; i++) {
      if (res.data[i] === undefined) {
        break;
      } else if (query.length < 4) {
        searchResult[i].classList.remove("active");
      } else {
        searchResult[
          i
        ].textContent = `${res.data[i].name}, ${res.data[i].region}, ${res.data[i].country}`;
        searchResult[i].classList.add("active");
        console.log(res.data);
      }
    }
  }
}
*/
async function autoComplete(e) {
  let searchResult = document.querySelectorAll(".searchResult");
  searchResult.forEach((element) => {
    element.remove();
  });
  let query = e.target.value;
  if (query.length >= 3) {
    let suggestions = await searchRequest(query);
    console.log(suggestions);
    for (let i = 0; i < 5; i++) {
      try {
        addDivElement(
          `${suggestions[i].name}, ${suggestions[i].region}, ${suggestions[i].country}`
        );
      } catch (e) {
        console.log("No match found:", e);
      }
    }
  }
}

async function searchRequest(inputValue) {
  try {
    const config = { params: { q: inputValue } };
    const res = await axios.get(
      `https://api.weatherapi.com/v1/search.json?key=30832b5a2a13422485f64334231003`,
      config
    );
    return res.data;
  } catch (e) {
    console.log("Error making request:", e);
  }
}

function addDivElement(value) {
  let divElement = document.createElement("div");
  divElement.classList.add("searchResult", "active");
  searchSection.append(divElement);
  divElement.textContent = value;
}

function selectItem(e) {
  if (e.target.tagName === "DIV") {
    searchBox.value = e.target.textContent;
  }

  let searchResult = document.querySelectorAll(".searchResult");
  searchResult.forEach((element) => {
    element.remove();
  });
  //   console.log(e);
  //   console.log(searchBox.value);
}

function getCurrentTime() {
  let time = new Date();
  let hour = time.getHours();
  let min = time.getMinutes();
  let amOrpm = "";
  if (hour % 12 === 0) {
    hour = 12;
    amOrpm = "AM";
  } else if (hour >= 12) {
    hour = hour % 12;
    amOrpm = "PM";
  } else {
    amOrpm = "AM";
  }
  currentTime.textContent = `${hour}:${min} ${amOrpm}`;
}
addEventListener("DOMContentLoaded", getCurrentTime);
searchBox.addEventListener("input", autoComplete);
searchSection.addEventListener("click", selectItem);
