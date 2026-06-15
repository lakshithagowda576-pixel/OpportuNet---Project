#!/usr/bin/env node

/**
 * FULL PROJECT SETUP SCRIPT
 * This script will:
 * 1. Create database tables
 * 2. Seed 1000+ job applications and data
 * 3. Build the backend
 * 4. Start both backend and frontend
 */

import { spawn } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const projectRoot = process.cwd();

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  red: "\x1b[31m"
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  log("\n" + "=".repeat(70), "blue");
  log(`🚀 ${title}`, "bright");
  log("=".repeat(70), "blue");
}

async function runCommand(command, args = [], cwd = projectRoot, name = "Command") {
  return new Promise((resolve, reject) => {
    log(`\n▶️ ${name}...`, "yellow");
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: true
    });

    child.on("close", (code) => {
      if (code === 0) {
        log(`✅ ${name} completed successfully!`, "green");
        resolve();
      } else {
        log(`❌ ${name} failed with code ${code}`, "red");
        reject(new Error(`${name} failed`));
      }
    });

    child.on("error", (error) => {
      log(`❌ ${name} error: ${error.message}`, "red");
      reject(error);
    });
  });
}

async function main() {
  try {
    section("OPPORTUNET FULL SETUP - STEP 1: DATABASE SETUP");

    // Step 1: Create database tables
    log("Creating database tables using Drizzle migrations...", "blue");
    await runCommand("pnpm", ["run", "push"], join(projectRoot, "lib/db"), "Database Migration");

    // Step 2: Install dependencies and seed data
    log("\nInstalling dependencies for seeding...", "blue");
    await runCommand("pnpm", ["install"], join(projectRoot, "lib/db"), "Install DB Dependencies");

    log("\nSeeding 1000+ applications and data...", "blue");
    await runCommand("pnpm", ["run", "seed-full"], join(projectRoot, "lib/db"), "Database Seeding");

    section("OPPORTUNET FULL SETUP - STEP 2: BUILD BACKEND");

    // Step 3: Install root dependencies
    log("Installing workspace dependencies...", "blue");
    await runCommand("pnpm", ["install"], projectRoot, "Install Workspace Dependencies");

    // Step 4: Build backend
    log("Building backend API server...", "blue");
    await runCommand(
      "pnpm",
      ["run", "build"],
      join(projectRoot, "artifacts/api-server"),
      "Build Backend"
    );

    section("OPPORTUNET FULL SETUP - COMPLETE!");

    log("\n✨ SUCCESS! All setup complete!", "green");
    log("\nNext steps:", "bright");
    log("1. Start Backend:  cd artifacts/api-server && pnpm run start", "yellow");
    log("2. Start Frontend: cd artifacts/job-portal && pnpm run dev", "yellow");
    log("3. Open Browser:   http://localhost:5173", "yellow");

    log("\nDatabase Info:", "bright");
    log("✅ Tables Created", "green");
    log("✅ 8 Companies Seeded", "green");
    log("✅ 40 Job Postings Seeded", "green");
    log("✅ 500 Users Created", "green");
    log("✅ 1200 Job Applications Seeded", "green");
    log("✅ 16 Colleges Seeded", "green");
    log("✅ 5 Exams with 20 Study Materials", "green");

    process.exit(0);
  } catch (error) {
    log(`\n❌ Setup failed: ${error.message}`, "red");
    log("\nTroubleshooting:", "yellow");
    log("1. Ensure DATABASE_URL is set in .env", "yellow");
    log("2. Verify Supabase connection", "yellow");
    log("3. Check internet connection", "yellow");
    process.exit(1);
  }
}

main();
