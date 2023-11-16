const CryptoJS = require("crypto-js");

const {
  encryptLink,
  decryptLink,
  getSecretKey,
} = require("../../helpers/encryption");

exports.encryptEmployeeId = (req, res, next) => {
  const { employeeID } = req.body;

  const encryptedEmployee = encryptLink(employeeID.toString());

  res.status(200).send({ success: true, encrypted: encryptedEmployee });
};

exports.decryptEmployeeId = (req, res, next) => {
  const { employeeID } = req.body;

  const decryptedEmployee = decryptLink(employeeID.toString());

  res.status(200).send({ success: true, decrypted: decryptedEmployee });
};
