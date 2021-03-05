import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from 'react'
const DateTimePicker = () => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    useEffect(() => {
        //manipulate the formData {date:YYYY-MM-DD, time:HH:MM} to to form a valid query string
        const encodedDateTime =startDate&& encodeURIComponent(startDate.toISOString() + "T10:00:00")
        // defaulting the time to 10am
        console.log(encodedDateTime)
        // props.setQueryString(encodedDateTime);
    }, [startDate]);
    return (
        <DatePicker selected={startDate} minDate={new Date()} onChange={date => date && setStartDate(date as Date)} />
    )
}
export default DateTimePicker

