//This will request WeatherAPI to Autocomplete on KEYSTROKE (not including backspace)
const searchBox = document.querySelector(".search");
const searchSection = document.querySelector(".autoCompleteBox");
let currentTime = document.querySelector("#currentTime");
const form = document.querySelector(".searchForm");
let query = "";

fetch("https://www.weatherapi.com/docs/weather_conditions.json")
  .then((res) => res.json())
  .then((out) => {
    const allWeather = out;
    // console.log("Output: ", allWeather);
  })
  .catch((err) => console.error(err));

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

  getCurrentWeather();
  searchBox.value = "";
  // form.submit();
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
  if (min < 10) {
    min = `0${min}`;
  }
  currentTime.textContent = `${hour}:${min} ${amOrpm}`;
}

async function getCurrentWeather(e) {
  // e.preventDefault();
  console.log(searchBox.value);
  const config = { params: { q: searchBox.value } };
  const res = await axios.get(
    `https://api.weatherapi.com/v1/current.json?key=30832b5a2a13422485f64334231003`,
    config
  );
  let dayOrNight = isDay(res.data.current);
  console.log(dayOrNight);
  console.log(res.data.current);
  setCurrentWeather(res.data.current);
}

function setCurrentWeather(currentWeather) {
  const displayTemp = document.querySelector(".displayTemp");
  const celsius = document.createElement("span");
  const feel = document.querySelector(".feelsLike");
  const condition = document.querySelector(".condition");
  displayTemp.innerText = `${currentWeather.temp_c}°`;
  celsius.textContent = "C";
  celsius.classList.add("celsius");
  displayTemp.appendChild(celsius);
  // celsius.textContent = "C";
  feel.textContent = `Feels Like ${currentWeather.feelslike_c}°`;
  condition.textContent = currentWeather.condition.text;
  console.dir(celsius);
}

function isDay(info) {
  if (info.is_day === 1) {
    return "day";
  } else {
    return "night";
  }
}

addEventListener("DOMContentLoaded", getCurrentTime);
searchBox.addEventListener("input", autoComplete);
searchSection.addEventListener("click", selectItem);
// form.addEventListener("submit", getCurrentWeather);
