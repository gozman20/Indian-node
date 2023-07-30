const mongoose = require("mongoose");
const validateMongoDbId = (id) => {
  const isValid = mongoose.Schema.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("This id is not valid or not found");
};
module.exports = validateMongoDbId;