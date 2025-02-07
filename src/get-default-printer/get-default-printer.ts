import execFileAsync from "../utils/exec-file-async";
import throwIfUnsupportedOperatingSystem from "../utils/throw-if-unsupported-os";
import isValidPrinter from "../utils/windows-printer-valid";
import { Printer } from "..";

async function getDefaultPrinter(): Promise<Printer | null> {
  try {
    throwIfUnsupportedOperatingSystem();

    const { stdout } = await execFileAsync("Powershell.exe", [
      "-Command",
      "Get-Printer | Where-Object { $_.IsDefault -eq $true } | Format-List Name,ShareName,PrinterStatus,Shared",
    ]);

    const printer = stdout.trim();

    if (!stdout) return null;

    const { isValid, printerData } = isValidPrinter(printer);

    if (!isValid) return null;

    return printerData;
  } catch (error) {
    throw error;
  }
}

export default getDefaultPrinter;
