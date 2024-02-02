import { NewUser, insertUser, NewProvider } from "@/lib/db";

async function main() {
  const user: NewProvider = {
    email: "vswaroop04@gmail.com",
    name: "VsWaroop",
  };
  const res = await insertUser(user);
  console.log(res);
  process.exit();
}

main();
