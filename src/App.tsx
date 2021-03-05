import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from './components/Header'
import DateTimePicker from './components/DateTimePicker'
import LocationList from './components/LocationList'
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import ImageContainer from "./components/ImageContainer";
function App() {
    const [queryString, setQueryString] = useState("");
    // TS complaining variable doesnt exist on {}. An interface would be a better option
    let empty: any = {};
    const [cameraData, setCameraData] = useState(empty);
    const [weatherData, setWeatherData] = useState([]);
    const [camNForecastData, setCamNForecastData] = useState([]);
    const [chosenLocation, setChosenLocation] = useState({});
    const [showWeatherCam, setShowWeatherCam] = useState(false);
    useEffect(() => {
        if (queryString !== "") {
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
                        setCameraData(response1.data.items[0]); //10/10 API design
                        let areaNforecastArray: any = [];
                        const forecast = response2.data.items[0].forecasts; //[{area:"AMK", forecast="Fair"}, {},{}]
                        const area_metadata = response2.data.area_metadata; //[{name:"AMK", label_location:{}}]
                        // Loop the area_metadata, for each {} in array, filter forecast [{}] with matching name, combined forecast with area_metadata
                        for (let i = 0; i < area_metadata.length; i++) {
                            //filter the {} with matching area
                            let correspondingForecast = forecast.filter(
                                (forecastData: any) =>
                                    forecastData.area === area_metadata[i].name
                            ); //[{area:"AMK", forcast:"windy"}]
                            //have a combined {} of name, label_location, forecast
                            let areaNforecast = {
                                ...area_metadata[i],
                                forecast: correspondingForecast[0].forecast,
                            };
                            areaNforecastArray.push(areaNforecast);
                        }
                        setWeatherData(areaNforecastArray);
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

    // if cameraData & weatherData is not empty, find nearest area for camera based on long & lat
    let cameraNforecastArray: any = [];
    useEffect(() => {//form camNForecastData
        if (Object.keys(cameraData).length !== 0 && weatherData.length !== 0) {

            for (let i = 0; i < cameraData.cameras.length; i++) { //walk through camera array 
                const closestLocation = (targetLocation: object, locationArray: any) => {
                    //Step 1: Function to calculate the hypotenus
                    const findHypotenus = (dx: number, dy: number) => {
                        return Math.sqrt(dx * dx + dy * dy);
                    }
                    // Step 2: Using input to calculate hypotenus
                    const distanceBtwLocation = (targetLocation: any, locationArray: any) => {
                        const dx = targetLocation.latitude - locationArray.label_location.latitude;
                        const dy = targetLocation.longitude - locationArray.label_location.longitude;
                        // console.log("dy", dy, ". dx", dx)
                        return findHypotenus(dx, dy);
                    }

                    // Step 3: for each {} in locationArray, calculate the distanceBtwLocation,
                    //return the location nearest to it, if equal distance will return in order of array, hence the one with lowest alphabetical :/
                    return locationArray.reduce((prev: number, curr: number) => {
                        let prevDistance = distanceBtwLocation(targetLocation, prev);
                        let currDistance = distanceBtwLocation(targetLocation, curr);
                        return (prevDistance < currDistance) ? prev : curr;
                    });
                }

                let closest = closestLocation(cameraData.cameras[i].location, weatherData)
                // console.log("for", cameraData.cameras[i], " cloest location is ", closest)

                //have a combined [{}] of camera, locaitonName, location_longlat, location_forecast
                let combinedCameraNForecast = { ...cameraData.cameras[i], locationName: closest.name, locationName_longlat: closest.label_location, locationName_forecast: closest.forecast };
                cameraNforecastArray.push(combinedCameraNForecast)
            }
            setCamNForecastData(cameraNforecastArray)
            // console.log("cameraNforecastArray", cameraNforecastArray)
        }
    }, [cameraData, weatherData])

    useEffect(() => {//if search date-time, dont show weatherCam
        if (queryString !== "") {
            setShowWeatherCam(false)
        }
    }, [queryString])


    const handleViewClick = (data: any) => {
        setChosenLocation(data)
        setShowWeatherCam(true)
    }

    return (
        <div>
            <Header />
            <div style={{ textAlign: 'center', fontSize: '22px', padding: '20px' }}>
                <DateTimePicker setQueryString={setQueryString} />
            </div>
            <Container >
                <Row>
                    <Col>
                        <LocationList cameraTime={cameraData?.timestamp} camNForecastData={camNForecastData} handleViewClick={handleViewClick} />
                    </Col>
                    <Col>
                        <ImageContainer chosenLocation={chosenLocation} showWeatherCam={showWeatherCam} />
                    </Col>



                </Row>
            </Container>
        </div>
    );
}

export default App;
