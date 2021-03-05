import React, { useState, useEffect } from "react";
// import { Image } from "react-bootstrap";

const ImageContainer = (props: any) => {
    const [locationChosen, setLocationChosen] = useState(false);
    const [imageTime, setImageTime] = useState("");
    let empty: any = {};
    const [geolocation, setGeoLocation] = useState(empty)

    useEffect(() => {
        if (Object.keys(props.chosenLocation).length !== 0) {
            setLocationChosen(true)
            let formattedDate = new Date(props.chosenLocation.timestamp).toLocaleString("en-AU")
            setImageTime(formattedDate)
            let newGeo = { "latitude": (props.chosenLocation.location.latitude).toFixed(3), "longitude": (props.chosenLocation.location.longitude).toFixed(3) }
            setGeoLocation(newGeo)
        } else {
            setLocationChosen(false)
        }
    }, [props.chosenLocation])

    const haveDetails =
        (
            <>
                <div>
                    <h6>Nearest Available Weather Info</h6>
                    <p><strong>Area: </strong>{props.chosenLocation.locationName}
                        <br />
                        <strong>Weather: </strong>{props.chosenLocation.locationName_forecast}
                    </p>
                </div>
                <div>
                    <h6>Traffic Camera Info</h6>
                    <p>
                        <strong>Camera ID: </strong>{props.chosenLocation.camera_id}
                        <br />
                        <strong>Exact Geo-location:  </strong>({(geolocation.latitude)}, {(geolocation.longitude)})
                        <br />
                        <strong>Time of image: </strong>{imageTime}
                    </p>
                </div>
            </>
        )

    const noDetails = (
        <> Select a camera from the list above
        </>
    )

    const haveImage = (
        <>
            <img src={props.chosenLocation.image} id="traffic-cam-image" alt="traffic camera image" />
            {/* <Image src={props.chosenLocation.image} fluid alt="traffic camera image" /> */}
        </>
    )

    const renderDetails = (locationChosen === true) ? haveDetails : noDetails

    const renderImage = (locationChosen === true) ? haveImage : <></>

    const noShow = (
        <></>
    )

    const showWeatherCamImage = (
        <>
            <div className="container-fluid row">
                <div className="container-fluid col-sm-12 col-md-5 py-1"><h5 id="details-h5">Details for camera <span className="span">{props.chosenLocation.camera_id}</span></h5>
                    {renderDetails}
                </div >

                <div className="container-fluid col-sm-12 col-md-7 py-1" id="traffic-cam-image-div">
                    {renderImage}
                </div>
            </div>
        </>
    )


    const showOrNoShow = (props.showWeatherCam === true) ? showWeatherCamImage : noShow

    return (
        <div className="container-fluid d-flex py-2" id="weather-cam-image-cont">
            {showOrNoShow}
        </div>
    )
}

export default ImageContainer