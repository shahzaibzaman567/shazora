import { execFileSync, execSync } from 'node:child_process';
import path from 'node:path';

const workspacePath = path.resolve(process.cwd()).replace(/\\/g, '\\\\');
const currentPid = process.pid;

function run(command) {
  return execSync(command, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function killWindowsShazoraProcesses() {
  const powershellCommand = `
$workspace = "${workspacePath}"
$currentPid = ${currentPid}
$targets = Get-CimInstance Win32_Process | Where-Object {
  $_.Name -eq 'node.exe' -and
  $_.ProcessId -ne $currentPid -and
  $_.CommandLine -match $workspace -and
  $_.CommandLine -match 'concurrently|vite|nodemon'
} | Select-Object -ExpandProperty ProcessId -Unique

if ($targets) {
  $targets | ForEach-Object { Stop-Process -Id $_ -Force }
  ($targets -join ',')
}
`.trim();

  const output = execFileSync(
    'powershell',
    ['-NoProfile', '-Command', powershellCommand],
    {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  ).trim();
  return output ? output.split(',').filter(Boolean).map((pid) => Number(pid)) : [];
}

function killUnixShazoraProcesses() {
  const output = run(
    `ps -eo pid=,command= | grep "${process.cwd()}" | grep -E "concurrently|vite|nodemon" | grep -v grep || true`
  );

  if (!output) return [];

  const pids = output
    .split('\n')
    .map((line) => Number(line.trim().split(/\s+/, 1)[0]))
    .filter((pid) => Number.isInteger(pid) && pid !== currentPid);

  for (const pid of pids) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {
      // ignore stale pids
    }
  }

  return pids;
}

try {
  const killed =
    process.platform === 'win32'
      ? killWindowsShazoraProcesses()
      : killUnixShazoraProcesses();

  if (killed.length > 0) {
    console.log(`Cleared stale dev processes: ${killed.join(', ')}`);
  } else {
    console.log('No stale dev processes found.');
  }
} catch (error) {
  console.warn('Dev cleanup skipped:', error.message);
}
