const nanoid = require("nanoid")
const util = require("util");
const knex = require("knex")({
  client: "pg",
  connection: "postgres://postgres:postgres@localhost/test?sslmode=disable"
});

const createUser = async ({ email, name }) => {
  const insert = knex("users")
    .insert({ email, name })
    .toString();

  const update = knex("users")
    .update({ name })
    .whereRaw(`users.email = '${email}'`);
  const query = util.format(
    "%s ON CONFLICT (email) DO UPDATE SET %s",
    insert.toString(),
    update.toString().replace(/^update\s.*\sset\s/i, "")
  );

  await knex.raw(query);
};

async function main() {
  await createUser({ email: "test@example.com", name: "Jake " + nanoid() });

  knex.destroy();
}

main();
