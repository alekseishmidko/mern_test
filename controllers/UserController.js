import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import { validationResult } from "express-validator";
//
export const register = async (req, res) => {
  try {
    const password = req.body.password;
    // соль это чтото вроде алгоритма шифрования
    const salt = await bcrypt.genSalt(10);
    const Hash = await bcrypt.hash(password, salt);
    // документ на создание пользователя
    const doc = new UserModel({
      email: req.body.email,
      passwordHash: Hash,
      avatarUrl: req.body.avatarUrl,
      fullName: req.body.fullName,
    });
    // создание самого пользователя в монгоДБ
    const user = await doc.save();
    // создание токена в случае если получилось создать пользователя. 2й параметр это метод шифрации
    const token = jwt.sign({ _id: user._id }, "secret123", {
      expiresIn: "30d",
    });
    // избавление от параметра passwordHash в информации от юзера. она не нужна
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: " fault during registration(register)",
    });
  }
};
export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne();
    if (!user) {
      return res.status(404).json({ message: "dont find the user(login)" });
    }
    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(400).json({ message: "incorrect  password(login)" });
    }
    const token = jwt.sign({ _id: user._id }, "secret123", {
      expiresIn: "30d",
    });
    // избавление от параметра passwordHash в информации от юзера. она не нужна
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: " fault during autorization",
    });
  }
};
export const me = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: " dont find user",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    // res.json(token);
    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: " fault during registration(register)",
    });
  }
};
