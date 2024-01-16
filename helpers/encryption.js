const CryptoJS = require("crypto-js");
const errorHandler = require("./errorHandler");

const encryptLink = (link) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(link, getSecretKey(), {
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.ECB,
    }).toString();

    const encoded = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(encrypted)
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return encoded;
  } catch (err) {
    errorHandler(`Error! Cannot encrypt employee ID: ${error}`, 500);
  }
};

const decryptLink = (link) => {
  try {
    const decoded = CryptoJS.enc.Base64.parse(
      link.replace(/-/g, "+").replace(/_/g, "/")
    ).toString(CryptoJS.enc.Utf8);

    const decrypted = CryptoJS.AES.decrypt(decoded, getSecretKey(), {
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.ECB,
    }).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    errorHandler(`Error! Cannot decrypt employee ID: ${error}`, 500);
  }
};
const getSecretKey = async () => {
  const secret = process.env.SECRETKEY;
  return secret;
};

module.exports = { encryptLink, decryptLink };
