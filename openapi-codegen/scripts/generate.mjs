import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const defaultInput = path.join(root, "openapi", "petstore.yaml");
const outputs = {
  javascript: path.join(root, "generated", "javascript"),
  typescript: path.join(root, "generated", "typescript-fetch"),
};
const cli = process.platform === "win32" ? "npx.cmd" : "npx";

function parseArgs(args) {
  const command = args[0] ?? "all";
  let input = defaultInput;
  let force = false;
  for (let i = 1; i < args.length; i += 1) {
    if (args[i] === "--input") {
      if (!args[i + 1]) throw new Error("--input requires a file path.");
      input = path.resolve(process.cwd(), args[++i]);
    } else if (args[i] === "--force") {
      force = true;
    } else if (args[i] === "--help" || args[i] === "-h") {
      console.log("Usage: node scripts/generate.mjs <validate|javascript|typescript|all> [--input <file>] [--force]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${args[i]}`);
    }
  }
  if (!["validate", "javascript", "typescript", "all"].includes(command)) {
    throw new Error(`Unknown command: ${command}`);
  }
  return { command, input, force };
}

function run(args) {
  const result = spawnSync(cli, ["--yes", "@openapitools/openapi-generator-cli", ...args], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`OpenAPI Generator exited with status ${result.status ?? "unknown"}.`);
  }
}

function validate(input) {
  if (!existsSync(input)) throw new Error(`Specification not found: ${input}`);
  run(["validate", "-i", input]);
}

function generate(target, input, force) {
  const output = outputs[target];
  if (existsSync(output)) {
    if (!force) {
      throw new Error(`Output exists: ${path.relative(root, output)}. Review it or pass --force to replace this managed directory.`);
    }
    rmSync(output, { recursive: true, force: true });
  }
  mkdirSync(path.dirname(output), { recursive: true });
  const generator = target === "javascript" ? "javascript" : "typescript-fetch";
  run(["generate", "-i", input, "-g", generator, "-o", output, "--additional-properties=hideGenerationTimestamp=true"]);
}

try {
  const { command, input, force } = parseArgs(process.argv.slice(2));
  if (command === "validate") {
    validate(input);
    console.log("OpenAPI specification validation passed.");
  } else {
    validate(input);
    const targets = command === "all" ? ["javascript", "typescript"] : [command];
    for (const target of targets) {
      generate(target, input, force);
      console.log(`Generated ${target} client at ${path.relative(root, outputs[target])}`);
    }
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
