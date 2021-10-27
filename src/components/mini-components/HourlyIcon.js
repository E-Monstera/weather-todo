

const HourlyIcon = (props) => {
    //Destructure props
    const { hour, formatUnits } = props;

    //Format the date
    const dateFormat = (date) => {
        let newDate = new Date(date * 1000);
        let time = newDate.toString().slice(16, 21);
        if (time.slice(0, 2) > 12) {
            return `${time.slice(0,2)-12}${time.slice(2, 5)}`
        } else {
            return time;
        }
    }

    return (
        <div className='weather-icon'>
            <p>{dateFormat(hour.dt)}</p>

                <img src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt='weather icon'></img>

            <p>{hour.weather[0].description}</p>
            <p>{formatUnits(hour.temp)}</p>
            <p className='prec'>Precipitation: {Math.round(hour.pop * 100)}%</p>
        </div>
    )
}

export default HourlyIcon