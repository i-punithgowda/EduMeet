const dateGenerator = () => {
  const currentDate = new Date();

  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = currentDate.getFullYear();

  const formattedDate = `${day}/${month}/${year}`;
  // console.log(formattedDate);
  return formattedDate;
};

module.exports = dateGenerator;
