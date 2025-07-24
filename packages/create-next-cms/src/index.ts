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
}

const TEMPLATE_REPO = "https://github.com/next-levels/nextjs-cms-template.git";

program
  .name("create-next-cms")
  .description("Create a new Next.js CMS project")
  .version("1.0.0")
  .argument("[project-name]", "Name of the project")
  .option(
    "-p, --package-manager <pm>",
    "Package manager (bun|npm|yarn|pnpm)",
    "bun",
  )
  .option("--no-examples", "Skip example content")
  .action(async (projectName: string, options) => {
    await createProject(projectName, options);
  });

async function createProject(projectName?: string, cmdOptions: any = {}) {
  console.log(chalk.blue.bold("🚀 Create Next.js CMS\n"));

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

  const answers = await inquirer.prompt([
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
      type: "confirm",
      name: "includeExample",
      message: "Beispiel-Inhalte und Demo-Daten einschließen?",
      default: cmdOptions.examples !== false,
      when: cmdOptions.examples === undefined,
    },
  ]);

  const projectOptions: ProjectOptions = {
    projectName: projectName!,
    packageManager:
      cmdOptions.packageManager || answers.packageManager || "bun",
    includeExample:
      cmdOptions.examples !== false && (answers.includeExample ?? true),
  };

  const projectPath = path.resolve(process.cwd(), projectOptions.projectName);

  if (fs.existsSync(projectPath)) {
    console.log(
      chalk.red(`❌ Ordner "${projectOptions.projectName}" existiert bereits!`),
    );
    process.exit(1);
  }

  console.log(chalk.green("\n✨ Erstelle dein CMS Projekt...\n"));

  try {
    await downloadTemplate(projectPath);
    await setupProject(projectOptions, projectPath);
    await installDependencies(projectOptions, projectPath);

    showSuccessMessage(projectOptions);
  } catch (error) {
    console.error(chalk.red("❌ Fehler beim Erstellen des Projekts:"), error);
    process.exit(1);
  }
}

async function downloadTemplate(projectPath: string) {
  const spinner = ora("Template herunterladen...").start();

  try {
    const branch = "template-clean";

    execSync(`git clone -b ${branch} ${TEMPLATE_REPO} "${projectPath}"`, {
      stdio: "pipe",
    });

    fs.removeSync(path.join(projectPath, ".git"));

    spinner.succeed("Template heruntergeladen");
  } catch (error) {
    spinner.fail("Fehler beim Herunterladen des Templates");
    throw error;
  }
}

async function setupProject(options: ProjectOptions, projectPath: string) {
  const spinner = ora("Projekt konfigurieren...").start();

  try {
    const packageJsonPath = path.join(projectPath, "package.json");
    const packageJson = fs.readJsonSync(packageJsonPath);

    packageJson.name = options.projectName;
    packageJson.description = `${options.projectName} - Next.js CMS`;

    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

    const envExamplePath = path.join(projectPath, ".env.example");
    const envPath = path.join(projectPath, ".env");

    if (fs.existsSync(envExamplePath)) {
      let envContent = fs.readFileSync(envExamplePath, "utf-8");

      fs.writeFileSync(envPath, envContent);
    }

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

function showSuccessMessage(options: ProjectOptions) {
  console.log(chalk.green.bold("\n🎉 Projekt erfolgreich erstellt!\n"));
  console.log(chalk.bold("📁 Nächste Schritte:\n"));
  console.log(chalk.cyan(`   cd ${options.projectName}`));
  console.log(
    chalk.cyan(
      `   ${options.packageManager === "bun" ? "bun" : options.packageManager === "npm" ? "npm run" : options.packageManager} dev\n`,
    ),
  );
  console.log(chalk.bold("🔗 Nützliche Links:\n"));
  console.log(chalk.blue("   🌐 http://localhost:3000"));
  console.log(chalk.blue("   ⚙️  http://localhost:3000/admin"));

  console.log(
    chalk.gray("💡 Tipp: Bearbeite die .env Datei für deine Umgebung"),
  );
  console.log(
    chalk.gray(
      "📖 Dokumentation: https://github.com/next-levels/nextjs-cms-template\n",
    ),
  );
}

program.parse(process.argv);
