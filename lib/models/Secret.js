const pool = require('../utils/pool');

module.exports = class Secret {
    id;
    title;
    description;
    createdAt;

    constructor(row) {
        this.id = row.id;
        this.title = row.title;
        this.description = row.description;
        this.createdAt = row.created_at;
    }

    static async getSecrets() {
        const { rows } = await pool.query(
            `
            SELECT
                *
            FROM
                secrets
            `
        );
        console.log('|||||||ROWS|||||||', rows);

        return rows.map(row => new Secret(row));
    }

    static async createSecret ({ title, description }) {
      const { rows } = await pool.query(
          `
          INSERT INTO
            secrets (title, description)
        VALUES
            ($1, $2)
        RETURNING
            *
        `,
        [title, description]
      );
      return new Secret(rows[0]);
    }
};