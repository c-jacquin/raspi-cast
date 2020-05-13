export function formaTime(timeInSecond: number) {
  const date = new Date(timeInSecond * 1000);

  let minutes: string | number = date.getMinutes();
  let seconds: string | number = date.getSeconds();

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  let time = `${minutes}:${seconds}`;
  let hours: string | number = date.getHours();

  if (hours > 1) {
    if (hours < 10) {
      hours = '0' + hours;
    }

    time = `${hours}:${time}`;
  }

  return time;
}
