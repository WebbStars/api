const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Vaga = db.vaga;
const validator = require("validator");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

  const { email, password, name } = req.body;

  // Verifica se o email é válido
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  // Verifica se a senha tem pelo menos 8 caracteres
  if (!validator.isLength(password, { min: 8 })) {
    return res.status(400).json({ error: "A senha deve ter pelo menos 8 caracteres" });
  }

  // Cria o usuário se todos os campos estiverem válidos
  const user = new User({
    email,
    password: bcrypt.hashSync(password, 8),
    name,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.roles === "user") {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
    else if (req.body.roles === "aupair") {
      Role.findOne({ name: "aupair" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
    else if (req.body.roles === "family") {
      Role.findOne({ name: "family" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "Family was registered successfully!" });
        });
      });
    }
    else if (req.body.roles === "agency") {
      Role.findOne({ name: "agency" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "Agency was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      var token = jwt.sign({ id: user.id, roles: authorities }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      res.status(200).send({
        id: user._id,
        email: user.email,
        name: user.name,
        roles: authorities,
        accessToken: token
      });
    });
};
