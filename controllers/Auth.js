import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });

  if (user.status !== "active") {
    return res
      .status(403)
      .json({ msg: "User is not active. Please contact administrator" });
  }
  const match = await argon2.verify(user.password, req.body.password); //? validasi password yang dikirim dengan password di database
  if (!match) return res.status(400).json({ msg: "Wrong Password!!!" });
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  const office = user.office;
  const division = user.role;
  res.status(200).json({ uuid, name, email, role, office, division });
};

export const Me = async (req, res) => {
  //? belum login
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Please login to your account!!!" });
  }
  const user = await User.findOne({
    attributes: ["uuid", "name", "email", "role", "office", "division"],
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User not found" });
  res.status(200).json(user);
};

export const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Cannot log out" });
    res.status(200).json({ msg: "You have logged out" });
  });
};
