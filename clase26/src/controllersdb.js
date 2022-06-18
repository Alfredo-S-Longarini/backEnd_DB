import mongoose from "mongoose";

let baseDeDatosConectada = false;

export function conectarDB(url, cb) {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, authSource: "admin"}, err => {
    if (!err) {
      baseDeDatosConectada = true;
    }
    if (cb != null) {
      cb(err);
    }
  });
}
