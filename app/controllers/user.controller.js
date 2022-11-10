const config = require("../config/auth.config");
const { vaga, user } = require("../models");
const db = require("../models");
const User = db.user;
const Vaga = db.vaga;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  User.findOne({
    email: "rafaelA@gmail.com"
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

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      res.status(200).send({
        id: user._id,
        email: user.email,
        name: user.name,
        roles: authorities,
      });
    }); 

};

exports.Vaga = (req, res) => {

  if(req.query.roles  === "ROLE_FAMILY")
  {
    Vaga.find({ 'user.0': mongoose.Types.ObjectId(req.query.userID) })
    .exec((err, vaga) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!vaga) {
        return res.status(404).send({ message: "Vaga Not found." });
      }

      res.json(vaga);
    }); 
  }
  else if(req.query.roles === "ROLE_AUPAIR")
  {
    Vaga.find()
    .exec((err, vaga) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!vaga) {
        return res.status(404).send({ message: "Vaga Not found." });
      }

      res.json(vaga);
    });

  }


};

exports.deleteVaga = (req, res) => {
  Vaga.findByIdAndDelete(req.query.vagaID)
  .exec((err, vaga) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!vaga) {
      return res.status(404).send({ message: "Vaga Not found." });
    }

    res.json(vaga);
  }); 

}

