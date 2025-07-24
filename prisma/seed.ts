import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Super Admin User
  const hashedSuperAdminPassword = await bcrypt.hash("superadmin123", 12);
  const superAdminUser = await db.user.create({
    data: {
      name: "Super Administrator",
      email: "superadmin@next-levels.de",
      password: hashedSuperAdminPassword,
      role: "SUPERADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created superadmin user:", superAdminUser.email);

  // Admin User
  const hashedAdminPassword = await bcrypt.hash("admin123", 12);
  const adminUser = await db.user.create({
    data: {
      name: "Template Admin",
      email: "admin@next-levels.de",
      password: hashedAdminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created admin user:", adminUser.email);

  const users = [
    {
      name: "Max Mustermann",
      email: "user@next-levels.de",
      password: await bcrypt.hash("user123", 12),
      role: "USER" as const,
    },
  ];

  for (const userData of users) {
    const user = await db.user.create({
      data: {
        ...userData,
        emailVerified: new Date(),
      },
    });
    console.log("✅ Created regular user:", user.email);
  }

  console.log("🎉 Seeding completed!");
  console.log("\n📝 Login credentials:");
  console.log("SuperAdmin: superadmin@next-levels.de / superadmin123");
  console.log("Admin:      admin@next-levels.de / admin123");
  console.log("Users:      user@next-levels.de / user123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(() => void db.$disconnect());
