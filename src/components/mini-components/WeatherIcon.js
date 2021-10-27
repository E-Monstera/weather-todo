

const WeatherIcon = (props) => {
    //Destructure props
    const { day, formatUnits } = props;

    //Format the date
    const dateFormat = (date) => {
        let newDate = new Date(date * 1000);
        return (newDate.toString());
    }

    return (
        <div className='weather-icon'>
            <p>{dateFormat(props.day.dt).slice(0, 3)}</p>
            <p>{day.weather[0].description}</p>
            <div>
                <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt='weather icon'></img>
                <div>
                    <p>{formatUnits(day.temp.max)}</p>
                    <p>{formatUnits(day.temp.min)}</p>
                </div>
            </div>
            <p className='prec'>Precipitation: {Math.round(day.pop * 100)}%</p>
        </div>
    )
}

export default WeatherIcon