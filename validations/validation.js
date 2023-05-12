import { body } from "express-validator";
//
export const loginValidation = [
  body("email", "Incorrect email!!!").isEmail(),
  body("password", "password length should be more then 5 synbols").isLength({
    min: 5,
  }),
  body("fullName", "fullname length should be more then 2 synbols").isLength({
    min: 2,
  }),
  body("avatarUrl", "Incorrect link to avatar img").optional().isURL(),
];
//
export const registerValidation = [
  body("email", "Incorrect email!!!").isEmail(),
  body("password", "password length should be more then 5 synbols").isLength({
    min: 5,
  }),
  body("fullName", "fullname length should be more then 2 synbols").isLength({
    min: 2,
  }),
  body("avatarUrl", "Incorrect link to avatar img").optional().isURL(),
];
//
export const postCreateValidation = [
  body("title", "need title!!!").isLength({ min: 3 }).isString(),
  body("text", "need text").isLength({ min: 3 }).isString(),
  body("tags", "incorrect tags format").optional().isString(),
  body("imageUrl", "Incorrect link to img").optional().isString(),
  body("user", "need user!!!").isString(),
];
