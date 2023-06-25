const getDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate() + 1}`.padStart(2, "0");
  const time = `${date.toISOString()}`;
  return `${year}${month}${day}${time}`;
};

module.exports = {
  getDateString,
};
