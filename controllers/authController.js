const Usuario = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registrarUsuario = async (req, res) => {
  const { email, password } = req.body;
  // Función de simulación de combate
  console.log(email, password);

  if (!email || !password) {
    return res.status(400).json({
      msg: "Por favor, proporciona tanto el correo electrónico como la contraseña.",
    });
  }

  try {
    // Buscar si ya existe el usuario
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario con el modelo
    usuario = new Usuario({
      email,
      password: hashedPassword,
      // vidas y puntaje son valores por defecto, así que no es necesario establecerlos aquí
    });

    // Guardar el usuario
    await usuario.save();

    // Crear y enviar el token
    const payload = { usuario: { id: usuario.id } }; // Mongoose utiliza id en lugar de _id
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};

exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    // Preparar el usuario para devolverlo en la respuesta, excluyendo la contraseña
    const usuarioSinPassword = {
      id: usuario.id,
      email: usuario.email,
      vidas: usuario.vidas,
      puntaje: usuario.puntaje,
    };

    const payload = { usuario: { id: usuario.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, usuario: usuarioSinPassword }); // Devuelve el token y la información del usuario
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
};
