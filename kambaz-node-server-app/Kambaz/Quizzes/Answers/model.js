// Kambaz/Modules/Answers/model.js
import mongoose from "mongoose";
import schema from "./schema.js";
const model = mongoose.model("AnswerModel", schema);
export default model;