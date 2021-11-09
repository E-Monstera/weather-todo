const htmlDecode = (input) => {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

const formatUnits = (unit, value) => {
  if (unit === 'imperial') {
    return `${Math.round((value*1.8) + 32)}°F`
  } else {
    // Units are metric
    return `${Math.round(value)}°C`
  }
}

const dateFormat = (date) => {
  
  let newDate = new Date(date * 1000);
  return (newDate.toString());
}


export { htmlDecode, formatUnits, dateFormat }