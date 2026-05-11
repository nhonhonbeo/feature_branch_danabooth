import { cpSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import os from "node:os";
import process from "node:process";

const repoRoot = resolve(dirname(new URL(import.meta.url).pathname), "..");
const codexDir = join(repoRoot, ".codex");
const skillsDir = join(repoRoot, ".agents", "skills");
const homeCodex = join(os.homedir(), ".codex");
const homeAgents = join(homeCodex, "agents");
const homeSkills = join(homeCodex, "skills");
const force = process.argv.includes("--force");

function copyIfNeeded(source, target) {
  if (existsSync(target) && !force) {
    console.log(`skip ${target}`);
    return;
  }

  cpSync(source, target, { recursive: true, force: true });
  console.log(`copy ${target}`);
}

mkdirSync(homeCodex, { recursive: true });
mkdirSync(homeAgents, { recursive: true });
mkdirSync(homeSkills, { recursive: true });

copyIfNeeded(join(codexDir, "AGENTS.md"), join(homeCodex, "AGENTS.digital-passport-fe.md"));

for (const file of readdirSync(join(codexDir, "agents"))) {
  copyIfNeeded(join(codexDir, "agents", file), join(homeAgents, file));
}

for (const skill of readdirSync(skillsDir)) {
  copyIfNeeded(join(skillsDir, skill), join(homeSkills, skill));
}

console.log("");
console.log("Repo-local Codex setup is already enough inside this repository.");
console.log("This script only copies the project skills and sample agent roles into ~/.codex for optional reuse.");
console.log("Use --force if you intentionally want to overwrite existing files.");
