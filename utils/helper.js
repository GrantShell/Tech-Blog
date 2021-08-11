const { User } = require("../models");

module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },

  truncate_post: (body) => {
    const preview = body.split(" ");
    preview.length = 20;
    return `${preview.join(" ")}...`;
  },
};
