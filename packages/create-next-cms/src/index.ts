#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import validateNpmName from "validate-npm-package-name";

const program = new Command();

interface ProjectOptions {
  projectName: string;
  packageManager: "bun" | "npm" | "yarn" | "pnpm";
  includeExample: boolean;
  database: "postgresql" | "mysql" | "sqlite";
  template: "minimal" | "full";
}

const TEMPLATE_REPO = "https://github.com/yourusername/nextjs-cms-template.git";

program
  .name("create-next-cms")
  .description("Create a new Next.js CMS project")
  .version("1.0.0")
  .argument("[project-name]", "Name of the project")
  .option("-t, --template <template>", "Template to use (minimal|full)", "full")
  .option(
    "-p, --package-manager <pm>",
    "Package manager (bun|npm|yarn|pnpm)",
    "bun",
  )
  .option(
    "-d, --database <db>",
    "Database type (postgresql|mysql|sqlite)",
    "postgresql",
  )
  .option("--no-examples", "Skip example content")
  .action(async (projectName: string, options) => {
    await createProject(projectName, options);
  });

async function createProject(projectName?: string, cmdOptions: any = {}) {
  console.log(chalk.blue.bold("🚀 Create Next.js CMS\n"));

  // Get project name if not provided
  if (!projectName) {
    const { name } = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Projektname:",
        validate: (input: string) => {
          if (!input.trim()) return "Projektname ist erforderlich";
          const validation = validateNpmName(input);
          if (!validation.validForNewPackages) {
            return validation.errors?.[0] || "Ungültiger Projektname";
          }
          return true;
        },
      },
    ]);
    projectName = name;
  }

  // Interactive prompts for missing options
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Welches Template möchtest du verwenden?",
      choices: [
        { name: "📦 Full - Komplettes CMS mit allen Features", value: "full" },
        { name: "🎯 Minimal - Basis Setup ohne Beispiele", value: "minimal" },
      ],
      default: cmdOptions.template || "full",
      when: !cmdOptions.template,
    },
    {
      type: "list",
      name: "packageManager",
      message: "Welchen Package Manager möchtest du verwenden?",
      choices: [
        { name: "⚡ Bun (empfohlen)", value: "bun" },
        { name: "📦 npm", value: "npm" },
        { name: "🧶 Yarn", value: "yarn" },
        { name: "📋 pnpm", value: "pnpm" },
      ],
      default: cmdOptions.packageManager || "bun",
      when: !cmdOptions.packageManager,
    },
    {
      type: "list",
      name: "database",
      message: "Welche Datenbank möchtest du verwenden?",
      choices: [
        { name: "🐘 PostgreSQL (empfohlen)", value: "postgresql" },
        { name: "🐬 MySQL", value: "mysql" },
        { name: "💾 SQLite (für lokale Entwicklung)", value: "sqlite" },
      ],
      default: cmdOptions.database || "postgresql",
      when: !cmdOptions.database,
    },
    {
      type: "confirm",
      name: "includeExample",
      message: "Beispiel-Inhalte und Demo-Daten einschließen?",
      default: cmdOptions.examples !== false,
      when: cmdOptions.examples === undefined,
    },
  ]);

  const projectOptions: ProjectOptions = {
    projectName: projectName!,
    template: cmdOptions.template || answers.template || "full",
    packageManager:
      cmdOptions.packageManager || answers.packageManager || "bun",
    database: cmdOptions.database || answers.database || "postgresql",
    includeExample:
      cmdOptions.examples !== false && (answers.includeExample ?? true),
  };

  const projectPath = path.resolve(process.cwd(), projectOptions.projectName);

  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    console.log(
      chalk.red(`❌ Ordner "${projectOptions.projectName}" existiert bereits!`),
    );
    process.exit(1);
  }

  console.log(chalk.green("\n✨ Erstelle dein CMS Projekt...\n"));

  try {
    await downloadTemplate(projectOptions, projectPath);
    await setupProject(projectOptions, projectPath);
    await installDependencies(projectOptions, projectPath);

    if (projectOptions.includeExample) {
      await setupDatabase(projectOptions, projectPath);
    }

    showSuccessMessage(projectOptions);
  } catch (error) {
    console.error(chalk.red("❌ Fehler beim Erstellen des Projekts:"), error);
    process.exit(1);
  }
}

async function downloadTemplate(options: ProjectOptions, projectPath: string) {
  const spinner = ora("Template herunterladen...").start();

  try {
    // Clone repository
    execSync(`git clone ${TEMPLATE_REPO} "${projectPath}"`, { stdio: "pipe" });

    // Remove .git directory
    fs.removeSync(path.join(projectPath, ".git"));

    // Remove packages directory for minimal template
    if (options.template === "minimal") {
      fs.removeSync(path.join(projectPath, "packages"));
    }

    spinner.succeed("Template heruntergeladen");
  } catch (error) {
    spinner.fail("Fehler beim Herunterladen des Templates");
    throw error;
  }
}

async function setupProject(options: ProjectOptions, projectPath: string) {
  const spinner = ora("Projekt konfigurieren...").start();

  try {
    // Update package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = fs.readJsonSync(packageJsonPath);

    packageJson.name = options.projectName;
    packageJson.description = `${options.projectName} - Next.js CMS`;

    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

    // Create .env file
    const envExamplePath = path.join(projectPath, ".env.example");
    const envPath = path.join(projectPath, ".env");

    if (fs.existsSync(envExamplePath)) {
      let envContent = fs.readFileSync(envExamplePath, "utf-8");

      // Update database URL based on selection
      const dbUrls = {
        postgresql:
          "postgresql://username:password@localhost:5432/" +
          options.projectName.replace(/-/g, "_"),
        mysql:
          "mysql://username:password@localhost:3306/" +
          options.projectName.replace(/-/g, "_"),
        sqlite: "file:./" + options.projectName + ".db",
      };

      envContent = envContent.replace(
        /DATABASE_URL=".*"/,
        `DATABASE_URL="${dbUrls[options.database]}"`,
      );

      fs.writeFileSync(envPath, envContent);
    }

    // Update seed data emails
    const seedPath = path.join(projectPath, "prisma", "seed.ts");
    if (fs.existsSync(seedPath)) {
      let seedContent = fs.readFileSync(seedPath, "utf-8");
      const domain = options.projectName + ".local";

      seedContent = seedContent.replace(/template\.de/g, domain);
      fs.writeFileSync(seedPath, seedContent);
    }

    // Initialize git
    execSync("git init", { cwd: projectPath, stdio: "pipe" });

    spinner.succeed("Projekt konfiguriert");
  } catch (error) {
    spinner.fail("Fehler bei der Projekt-Konfiguration");
    throw error;
  }
}

async function installDependencies(
  options: ProjectOptions,
  projectPath: string,
) {
  const spinner = ora(
    `Dependencies installieren (${options.packageManager})...`,
  ).start();

  try {
    const installCommands = {
      bun: "bun install",
      npm: "npm install",
      yarn: "yarn install",
      pnpm: "pnpm install",
    };

    execSync(installCommands[options.packageManager], {
      cwd: projectPath,
      stdio: "pipe",
    });

    spinner.succeed("Dependencies installiert");
  } catch (error) {
    spinner.fail("Fehler bei der Installation der Dependencies");
    throw error;
  }
}

async function setupDatabase(options: ProjectOptions, projectPath: string) {
  const spinner = ora("Datenbank einrichten...").start();

  try {
    const runCommands = {
      bun: "bun",
      npm: "npm run",
      yarn: "yarn",
      pnpm: "pnpm",
    };

    const runner = runCommands[options.packageManager];

    // Generate Prisma client
    execSync(`${runner} db:push`, {
      cwd: projectPath,
      stdio: "pipe",
    });

    // Seed database if examples included
    if (options.includeExample) {
      execSync(`${runner} db:seed`, {
        cwd: projectPath,
        stdio: "pipe",
      });
    }

    spinner.succeed("Datenbank eingerichtet");
  } catch (error) {
    spinner.fail("Fehler bei der Datenbank-Einrichtung");
    throw error;
  }
}

function showSuccessMessage(options: ProjectOptions) {
  console.log(chalk.green.bold("\n🎉 Projekt erfolgreich erstellt!\n"));

  console.log(chalk.bold("📁 Nächste Schritte:\n"));
  console.log(chalk.cyan(`   cd ${options.projectName}`));

  if (options.database !== "sqlite") {
    console.log(chalk.yellow(`   # Datenbank-URL in .env anpassen`));
    console.log(
      chalk.cyan(
        `   ${options.packageManager === "bun" ? "bun" : options.packageManager === "npm" ? "npm run" : options.packageManager} db:push`,
      ),
    );

    if (options.includeExample) {
      console.log(
        chalk.cyan(
          `   ${options.packageManager === "bun" ? "bun" : options.packageManager === "npm" ? "npm run" : options.packageManager} db:seed`,
        ),
      );
    }
  }

  console.log(
    chalk.cyan(
      `   ${options.packageManager === "bun" ? "bun" : options.packageManager === "npm" ? "npm run" : options.packageManager} dev\n`,
    ),
  );

  if (options.includeExample) {
    console.log(chalk.bold("👤 Demo Login:\n"));
    console.log(
      chalk.gray(
        "   Admin: admin@" + options.projectName + ".local / admin123",
      ),
    );
    console.log(
      chalk.gray(
        "   User:  user@" + options.projectName + ".local / user123\n",
      ),
    );
  }

  console.log(chalk.bold("🔗 Nützliche Links:\n"));
  console.log(chalk.blue("   🌐 http://localhost:3000"));
  console.log(chalk.blue("   ⚙️  http://localhost:3000/admin"));
  console.log(chalk.blue("   📊 http://localhost:5555 (Prisma Studio)\n"));

  console.log(
    chalk.gray("💡 Tipp: Bearbeite die .env Datei für deine Umgebung"),
  );
  console.log(
    chalk.gray(
      "📖 Dokumentation: https://github.com/yourusername/nextjs-cms-template\n",
    ),
  );
}

program.parse(process.argv);
