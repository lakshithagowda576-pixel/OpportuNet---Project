import { seedCompanies } from "../../lib/db/src/seed-companies";

async function main() {
  try {
    await seedCompanies();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
