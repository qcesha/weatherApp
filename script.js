const api = {
    endpoint: 'https://api.openweathermap.org/data/2.5/',
    key: '21fb11cf880bae45d62b41007980d15a' 
};

document.querySelector('#showWeather').addEventListener('click', async () => {
    const latitude = document.querySelector('#latitude').value.trim();
    const longitude = document.querySelector('#longitude').value.trim();

    try {
        validateCoordinates(latitude, longitude); 
        const weatherData = await getWeatherData(latitude, longitude);
        displayResult(weatherData);
        updateMap(latitude, longitude);
    } catch (error) {
        alert(error.message); 
    }
});

function validateCoordinates(lat, lon) {
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
        throw new Error('Введите числовые значения широты и долготы.');
    }
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
        throw new Error('Широта должна быть от -90 до 90, а долгота от -180 до 180.');
    }
}

async function getWeatherData(lat, lon) {
    const url = `${api.endpoint}weather?lat=${lat}&lon=${lon}&units=metric&lang=ru&appid=${api.key}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Не удалось получить данные о погоде. Проверьте координаты.');
    }
    return await response.json();
}

function displayResult(result) {
    const city = document.querySelector('#city');
    city.textContent = `${result.name}, ${result.sys.country}`;

    const temperature = document.querySelector('#temperature');
    temperature.innerHTML = `${Math.round(result.main.temp)}<span>°C</span>`;

    const feelsLike = document.querySelector("#feelsLike");
    feelsLike.innerHTML = `Ощущается как: ${Math.round(result.main.feels_like)}<span>°C</span>`;

    const conditions = document.querySelector("#conditions");
    conditions.textContent = `Условия: ${result.weather[0].description}`;

    const variation = document.querySelector("#variation");
    variation.innerHTML = `Минимум: ${Math.round(result.main.temp_min)}°C, Максимум: ${Math.round(result.main.temp_max)}°C`;

    const weatherIcon = document.querySelector("#weatherIcon");
    const weatherCondition = result.weather[0].main.toLowerCase();
    let iconPath = './icons/default.png'; 

    if (weatherCondition.includes('clear')) {
        iconPath = './icons/clear.png';
    } else if (weatherCondition.includes('clouds')) {
        iconPath = './icons/cloudy.png';
    } else if (weatherCondition.includes('rain')) {
        iconPath = './icons/rain.png';
    } else if (weatherCondition.includes('snow')) {
        iconPath = './icons/snow.png';
    } else if (weatherCondition.includes('thunderstorm')) {
        iconPath = './icons/thunderstorm.png';
    } else if (weatherCondition.includes('fog') || weatherCondition.includes('mist')) {
        iconPath = './icons/fog.png';
    }

    weatherIcon.src = iconPath; 
    getOurDate();
}


function getOurDate() {
    const myDate = new Date();
    const days = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    const months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
    
    const nowDay = days[myDate.getDay()];
    const todayDate = myDate.getDate();
    const nowMonths = months[myDate.getMonth()];

    const showDate = document.querySelector('#date');
    showDate.innerHTML = `${nowDay}, ${todayDate} ${nowMonths}`;
}

function updateMap(lat, lon) {
    const mapDiv = document.querySelector('#map');
    mapDiv.innerHTML = ''; 

    ymaps.ready(() => {
        const map = new ymaps.Map(mapDiv, {
            center: [lat, lon], 
            zoom: 10,
        });

        const placemark = new ymaps.Placemark([lat, lon], {
            balloonContent: 'Вы здесь!',
        });
        map.geoObjects.add(placemark);
    });
}

