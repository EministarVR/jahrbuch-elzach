import 'dotenv/config';
import { query } from '../lib/db';
import { createUser, findUserByUsername } from '../lib/auth';

async function main() {
  const exists = await findUserByUsername('AdminEmin');
  if (!exists) {
    await createUser('AdminEmin', '8810Emini', 'admin');
    // eslint-disable-next-line no-console
    console.log('Seeded admin: AdminEmin / 8810Emini');
  } else {
    // eslint-disable-next-line no-console
    console.log('Admin already exists');
  }
}

main().then(() => process.exit(0)).catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});



