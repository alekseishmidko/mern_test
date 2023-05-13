import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations/validation.js";

//
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "./controllers/PostController.js";
import checkAuth from "./utils/checkAuth.js";
import { login, me, register } from "./controllers/UserController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
//
const app = express();
//
app.use(express.json());
// делаю так чтобы можно было по ссылке выйти на картинку или др статичный объект
app.use("/uploads", express.static("uploads"));
// подключение к БД
mongoose
  .connect(
    // "mongodb+srv://alex:0000@archakov.lneqfbf.mongodb.net/?retryWrites=true&w=majority"
    "mongodb+srv://alex:1234@cluster0.gle9jsl.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB is active!");
  })
  .catch((error) => {
    console.log(error, "DB error");
  });
//
app.get("/", (req, res) => {
  res.send(`req is ${req}`);
});
// скачивание изображения
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// запрос на сервер чтоб залить данные пользователя
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  register
);
//
app.post("/auth/login", loginValidation, handleValidationErrors, login);
// проверка авторизации
app.get("/auth/me", checkAuth, me);
//
app.get("/posts", getAll);
app.get("/posts/:id", getOne);
app.post("/posts", checkAuth, postCreateValidation, create);
app.delete("/posts/:id", checkAuth, remove);
app.patch("/posts/:id", checkAuth, handleValidationErrors, update);
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({ url: `/uploads/${req.file.originalname}` });
});
// запуск приложения
app.listen(3001, (error) => {
  if (error) console.log(error, "err");
  else {
    console.log("3001 is running");
  }
});
