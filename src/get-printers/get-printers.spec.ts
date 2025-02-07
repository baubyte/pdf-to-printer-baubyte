import { mocked } from "jest-mock";
import { Printer } from "..";
import execAsync from "../utils/exec-file-async";
import getPrinters from "./get-printers";

jest.mock("../utils/throw-if-unsupported-os");
jest.mock("../utils/exec-file-async");
const mockedExecAsync = mocked(execAsync);

afterEach(() => {
  // restore the original implementation
  mockedExecAsync.mockRestore();
});

const mockPrinterListStdout = `

Status                      :
Name                        : OneNote
Caption                     :
Description                 :
InstallDate                 :
StartTime                   :
UntilTime                   :
WorkOffline                 :
PSComputerName              :
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties
ShareName                   : OneNote
PrinterStatus               : Normal
Shared                      : True


Status                      :
Name                        : Microsoft XPS Document Writer
Caption                     :
Description                 :
InstallDate                 :
Availability                :
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties
ShareName                   :
PrinterStatus               : Normal
Shared                      : False


Status                      :
Name                        : Microsoft Print to PDF
Description                 :
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties
ShareName                   :
PrinterStatus               : Unknown
Shared                      : False

Status                      :
Name                        : Fax
Description                 :
InstallDate                 :
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties
ShareName                   :
PrinterStatus               : Normal
Shared                      : False

`;

it("returns list of available printers", async () => {
  mockedExecAsync.mockResolvedValue({
    stdout: mockPrinterListStdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters();

  expect(result).toStrictEqual([
    {
      name: "OneNote",
      shareName: "OneNote",
      shared: true,
      status: "idle",
      sharedStatus: "True",
    },
    {
      name: "Microsoft XPS Document Writer",
      shareName: "",
      shared: false,
      status: "idle",
      sharedStatus: "False",
    },
    {
      name: "Microsoft Print to PDF",
      shareName: "",
      shared: false,
      status: "unknown",
      sharedStatus: "False",
    },
    {
      name: "Fax",
      shareName: "",
      shared: false,
      status: "idle",
      sharedStatus: "False",
    },
  ]);
});

it("when did not find any printer info", async () => {
  const stdout = `
  Status                      :
  Caption                     :
  Description                 :
  InstallDate                 :
  Availability                :
  CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties
  `;
  mockedExecAsync.mockResolvedValue({ stdout, stderr: "" });

  const result = await getPrinters();

  return expect(result).toEqual([]);
});

it("fails with an error", () => {
  mockedExecAsync.mockRejectedValue("error");
  return expect(getPrinters()).rejects.toBe("error");
});

it("returns list of available printers with custom properties", async () => {
  const stdout = `

  Status                      : Unknown
  Name                        : Canon Printer
  Caption                     : Canon Printer
  PaperSizesSupported         : {1, 1, 1, 1...}
  PortName                    : USB001
  PrinterPaperNames           : {A4, 144mm x 100mm, 2 x 4, 4 x 4...}
  ShareName                   :
  PrinterStatus               : Normal
  Shared                      : False
  
  `;

  mockedExecAsync.mockResolvedValue({
    stdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters();

  expect(result).toStrictEqual([
    {
      name: "Canon Printer",
      shareName: "",
      shared: false,
      status: "idle",
      sharedStatus: "False",
    },
  ]);
});
