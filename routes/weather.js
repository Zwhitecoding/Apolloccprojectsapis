const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports.routes = {
    name: "Weather",
    desc: "The latest weather information from PAGASA.",
    category: "Others",
    usages: "/api/weather",
    method: "get",
};

async function fetchWeatherData() {
    try {
        const { data } = await axios.get('https://www.pagasa.dost.gov.ph/weather', {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });

        const $ = cheerio.load(data);

        const synopsisSection = $('#daily-weather-forecast').next('.article-content').find('.synopsis');
        const synopsis = synopsisSection.find('.panel-body p').text().trim();
        const issuedAt = synopsisSection.find('.panel-heading h5.dev').text().trim();

        const tempHumiditySection = $('h3.text-center:contains("Temperature and Relative Humidity")').next('h5.text-center').next('h5.text-center').next('table');
        const temperatureRow = tempHumiditySection.find('tbody tr').first();
        const humidityRow = tempHumiditySection.find('tbody tr').last();

        const temperature = {
            max: {
                value: temperatureRow.find('.max-temp').first().text().trim(),
                time: temperatureRow.find('.max-temp').last().text().trim()
            },
            min: {
                value: temperatureRow.find('.min-temp').first().text().trim(),
                time: temperatureRow.find('.min-temp').last().text().trim()
            }
        };

        const humidity = {
            max: {
                value: humidityRow.find('.max-humidity').first().text().trim(),
                time: humidityRow.find('.max-humidity').last().text().trim()
            },
            min: {
                value: humidityRow.find('.min-humidity').first().text().trim(),
                time: humidityRow.find('.min-humidity').last().text().trim()
            }
        };

        const weatherInfo = {
            synopsis,
            issuedAt,
            temperature,
            humidity
        };

        return weatherInfo;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
}

module.exports.onAPI = async (req, res) => {
    try {
        const weatherData = await fetchWeatherData();
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
};
