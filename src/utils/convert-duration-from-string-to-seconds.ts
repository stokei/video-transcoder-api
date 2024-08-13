export const convertDurationFromStringToSeconds = (
  duration: string
): number => {
  const timeParts = duration?.split(':');

  if (timeParts.length !== 3) {
    return 0;
  }
  const hours = parseFloat(timeParts[0]);
  const minutes = parseFloat(timeParts[1]);
  const seconds = parseFloat(timeParts[2]);

  return hours * 3600 + minutes * 60 + seconds;
};
