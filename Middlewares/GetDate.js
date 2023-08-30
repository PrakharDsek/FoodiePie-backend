/**
 * The function `getDate` returns the current date in the format "YYYY-MM-DD".
 * @returns The function `getDate` returns the current date in the format "YYYY-MM-DD".
 */
export const getDate = () => {
  const currentTime = new Date();
  const currentYear = currentTime.getFullYear();
  const currentMonth = currentTime.getMonth() + 1; // Adding 1 because months are zero-based
  const currentDay = currentTime.getDate();
  return currentYear + "-" + currentMonth + "-" + currentDay;
};
