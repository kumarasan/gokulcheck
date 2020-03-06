import { DateTime } from 'luxon'

const TIME_FORMAT = 'HH:mm';
const FINAL_FORMAT = 'd-MMM -yyyy';

/**
 * formatChatDateTime() method to perform the format date & time.
 * 
 * @param {Date} date 
 * @param {string} type 
 */
export const formatChatDateTime = (date, type) => {
  const timeFormatted = formatChatTime(date, type)
  const dayFormatted = formatChatDate(date)

  if (type === 'recent-chat') {
    if (dayFormatted === 'Today') {
      return timeFormatted
    }
    return dayFormatted;
  } else {
    if (timeFormatted.match(/Now|mins? ago/i)) {
      return timeFormatted
    }
  }
}

/**
 * formatAMPM() method to perform the am or pm format with time.
 * 
 * @param {date} date 
 */
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

/**
 * convertUTCTOLocalTimeStamp() method to perform convert UTC to local time formate.
 * 
 * @param {date} date 
 */
export const convertUTCTOLocalTimeStamp = (date) => {
  var newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());
  return newDate;
}

/**
 * formatChatTime() method to perform convert time into now, min ago, mins ago and date format.
 * 
 * @param {date} date 
 * @param {string} type 
 */
export const formatChatTime = (date, type) => {
  if (type === 'recent-chat') {
    return formatAMPM(date);
  }
  const dateCurrent = DateTime.fromMillis(Date.now())
  const dateMessage = DateTime.fromJSDate(date)
  const datesDiff = dateCurrent.diff(dateMessage, 'minutes').toObject().minutes

  if (!datesDiff) {
    return '?'
  }

  const diffRounded = Math.round(datesDiff)

  if (diffRounded === 0) {
    return 'Now'
  } else if (diffRounded === 1) {
    return `${diffRounded} min ago`
  } else if (diffRounded < 60) {
    return `${diffRounded} mins ago`
  } else {
    return dateMessage.toFormat(TIME_FORMAT)
  }
}

/**
 * formatChatDate() method to perform convert into Today, Yesterday and Date format.
 * 
 * @param {date} date 
 */
export const formatChatDate = (date) => {
  const dateCurrent = DateTime.fromMillis(Date.now())
  const dateMessage = DateTime.fromJSDate(date)
  const datesDiff = dateCurrent.diff(dateMessage, 'days').toObject().days
  if (!datesDiff) {
    return '?'
  }

  const diffRounded = Math.round(datesDiff)

  if (diffRounded === 0) {
    return 'Today'
  } else if (diffRounded === 1) {
    return 'Yesterday'
  } else if (diffRounded > 1 && diffRounded <= 7) {
    return DateTime.fromJSDate(date).toFormat('cccc')
  } else {
    return DateTime.fromJSDate(date).toFormat(FINAL_FORMAT)
  }
}

export const getLastseen = (secs) => {
  var userDate = datetoTime(-secs);
  var currentDate = new Date();
  var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var HHMM = { hour: 'numeric', minute: 'numeric' };
  if (secs == 0) {
    return 'Online';
  }
  else if ((userDate.getDate() === currentDate.getDate()) && (userDate.getMonth() === currentDate.getMonth())) {
    return 'last seen today at ' + userDate.toLocaleTimeString("en-US", HHMM);
  } else if ((userDate.getDate() === (currentDate.getDate() - 1)) && (userDate.getMonth() === (currentDate.getMonth()))) {
    return 'last seen yesterday at ' + userDate.toLocaleTimeString("en-US", HHMM);
  }
  else if (((userDate.getDate() === (currentDate.getDate() - 1)) ||
    (userDate.getDate() === (currentDate.getDate() - 2)) ||
    (userDate.getDate() === (currentDate.getDate() - 3)) ||
    (userDate.getDate() === (currentDate.getDate() - 4)) ||
    (userDate.getDate() === (currentDate.getDate() - 5)) ||
    (userDate.getDate() === (currentDate.getDate() - 6)))
    &&
    ((userDate.getMonth() === (currentDate.getMonth())))) {
    return 'last seen on ' + weekday[userDate.getDay()] + ' at ' + userDate.toLocaleTimeString("en-US", HHMM);
  }
  else {
    currentDate.setSeconds(-secs);
    if (userDate.getDay().length > 1) {
      return 'last seen ' + userDate.getDay() + '-' + month[userDate.getMonth()] + '-' + userDate.getFullYear();
    } else {
      return 'last seen ' + '0' + userDate.getDay() + '-' + month[userDate.getMonth()] + '-' + userDate.getFullYear();
    }
  }
}

function datetoTime(secs) {
  var todayDate = new Date();
  todayDate.setSeconds(secs);
  return todayDate;
}
