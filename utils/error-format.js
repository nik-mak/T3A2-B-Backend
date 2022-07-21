const errorFormatter = (error) => {
  let errors = {};
  const entireMessage = error.substring(error.indexOf(":") + 1).trim();
  const messages = entireMessage.split(",").map((err) => err.trim());
  messages.forEach((err) => {
    const [key, value] = err.split(":").map((err) => err.trim());
    errors[key] = value;
  });
  return errors;
};

module.exports = errorFormatter;