import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from './components/Header'
import DateTimePicker from './components/DateTimePicker'
import { Container } from "react-bootstrap";
import axios from "axios";
function App() {
    const [queryString, setQueryString] = useState("");
    const [cameraData, setCameraData] = useState({});
    const [weatherData, setWeatherData] = useState([]);
    const [camNForecastData, setCamNForecastData] = useState([]);
    const [chosenLocation, setChosenLocation] = useState({});
    const [showWeatherCam, setShowWeatherCam] = useState(false);
    useEffect(() => {
        //setCameraData & setWeatherData
        if (queryString !== "") {
            //axios API if querystring not empty
            //TODO abstract out calls to api file
            axios
                .all([
                    axios.get(
                        "https://api.data.gov.sg/v1/transport/traffic-images?date_time=" +
                        queryString
                    ),
                    axios.get(
                        "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast?date_time=" +
                        queryString
                    ),
                ])
                .then(
                    axios.spread((response1, response2) => {
                        setCameraData(response1.data.items[0]); //object

                        //     let areaNforecastArray: any = [];
                        //     const forecast = response2.data.items[0].forecasts; //[{area:"AMK", forecast="Fair"}, {},{}]
                        //     const area_metadata = response2.data.area_metadata; //[{name:"AMK", label_location:{}}]
                        //     // Loop the area_metadata, for each {} in array, filter forecast [{}] with matching name, combined forecast with area_metadata
                        //     for (let i = 0; i < area_metadata.length; i++) {
                        //         //filter the {} with matching area
                        //         let correspondingForecast = forecast.filter(
                        //             (forecastData: any) =>
                        //                 forecastData.area === area_metadata[i].name
                        //         ); //[{area:"AMK", forcast:"windy"}]
                        //         //have a combined {} of name, label_location, forecast
                        //         let areaNforecast = {
                        //             ...area_metadata[i],
                        //             forecast: correspondingForecast[0].forecast,
                        //         };
                        //         areaNforecastArray.push(areaNforecast);
                        //     }
                        //     setWeatherData(areaNforecastArray);
                    })
                )
                .catch(
                    axios.spread((error1, error2) => {
                        console.log("axios traffic error", error1);
                        console.log("axios weather error", error2);
                    })
                );
        }
    }, [queryString]);
    return (
        <div>
            <Header />
            <Container >
                <DateTimePicker setQueryString={setQueryString} />
                {/*      <LocationList />
                <ImageContainer />  */}

            </Container>
        </div>
    );
}

export default App;
