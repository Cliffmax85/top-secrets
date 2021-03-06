const pool = require('../utils/pool');
const jwt = require('jsonwebtoken');

module.exports = class User {
    id;
    email;
    #passwordHash;

    constructor(row) {
        this.id = row.id;
        this.email = row.email;
        this.#passwordHash = row.password;
    }

    static async insert({ email, passwordHash }) {
        const { rows } = await pool.query(
            `
            INSERT INTO
                users(email, password)
            VALUES
                ($1, $2)
            RETURNING 
                *
            `,
            [email, passwordHash]
        );
        return new User(rows[0]);
    }

    static async findByEmail(email) {
        const { rows } = await pool.query(
            `
            SELECT
                *
            FROM
                users
            WHERE
                email=$1
            `,
            [email]
        );
        if (!rows[0]) return null;
        return new User(rows[0]);
        
        }
    get passwordHash() {
        return this.#passwordHash;
    }
        
    authToken() {
        return jwt.sign({ ...this }, process.env.JWT_SECRET, { expiresIn: '1 day' });
        
    }
};