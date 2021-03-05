import DatePicker from 'react-datepicker'
import { useState } from 'react'
const DateTimePicker = () => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    return (
        <DatePicker selected={startDate} onChange={date => date && setStartDate(date as Date)} />
    )
}
export default DateTimePicker

