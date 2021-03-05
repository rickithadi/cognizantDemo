import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";

const LocationList = (props: any) => {
    const [camNForecastData, setCamNForecastData] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [dateTimeAcquired, setDateTimeAcquired] = useState("selected date & time")

    useEffect(() => {
        if (props.cameraTime !== undefined) {
            let formattedDate = new Date(props.cameraTime).toLocaleString("en-AU")
            setDateTimeAcquired(formattedDate)
        }
        if (props.camNForecastData.length !== 0) {
            setCamNForecastData(props.camNForecastData)
            setLoaded(true)
        } else {
            setLoaded(false)
        }
    }, [props.camNForecastData])

    // console.log("locationlist array outside, ", camNForecastData)

    return (
        <div className="container-fluid pt-2" id="location-list-cont">
            List of traffic cameras for <span className="span">{dateTimeAcquired}</span>
            {/* table list of S/N, location, camera number */}

            <div className="container-fluid" id="table-cont" >
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Nearest Area</th>
                            <th>Camera ID</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loaded ? (
                            <>
                                {camNForecastData.map((data: any, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{data?.locationName}</td>
                                        <td>{data?.camera_id}</td>
                                        <td><Button size="sm"
                                            onClick={() => {
                                                // console.log("handle view click", data)
                                                props.handleViewClick(data);
                                            }}
                                            variant="primary"
                                        >View</Button></td>
                                    </tr>

                                ))}
                            </>
                        ) : (<tr><td>Pick a Date & Time</td></tr>)}



                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default LocationList