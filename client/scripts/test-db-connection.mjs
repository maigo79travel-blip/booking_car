import { Client } from "pg";

const client = new Client({
  connectionString:
    "postgresql://postgres.qysxwmujksnqxppluxey:bW.Q%2165SEEpk%3FBu@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function test() {
  await client.connect();
  console.log("Testing user verification in auth.users & profiles...");
  
  const res = await client.query(`
    SELECT u.id, u.email, p.role,
           (u.encrypted_password = extensions.crypt('Admin@123456', u.encrypted_password)) as pwd_match
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE u.email IN ('admin@inoibai.vn', 'admin@maigo79.com');
  `);
  
  console.log("Admin Query Result:", res.rows);
  await client.end();
}

test().catch(console.error);
