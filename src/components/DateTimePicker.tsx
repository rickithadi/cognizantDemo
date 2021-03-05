import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from 'react'
const DateTimePicker = (props: any) => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    useEffect(() => {
        // convert date obj
        const encodedDateTime = startDate && startDate.toISOString()
        // trim :000Z from end on string. im not sure what that is, timezone?
        console.log(encodedDateTime?.substring(0, encodedDateTime.length-5));
        props.setQueryString(encodedDateTime && encodedDateTime?.substring(0, encodedDateTime.length-5));
    }, [startDate]);
    return (
        <DatePicker selected={startDate} minDate={new Date()} onChange={date => date && setStartDate(date as Date)} timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm" />
    )
}
export default DateTimePicker

