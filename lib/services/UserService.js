const bcryptjs = require('bcryptjs');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
      const passwordHash = await bcryptjs.hashSync( password, Number(process.env.SALT_ROUNDS));

      const user = await User.insert({ email, passwordHash, });

      return user;
  }

  static async signIn({ email, password }) {
    const user = await User.findByEmail(email);
    if (!user) throw new Error('invalid email/password');
    const passwordsMatch = bcryptjs.compareSync(password, user.passwordHash);
    if (!passwordsMatch) throw new Error('invalid email/password');

    return user;
  }
}