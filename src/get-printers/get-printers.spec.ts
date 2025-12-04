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
DeviceID                    : OneNote
StartTime                   :
UntilTime                   :
WorkOffline                 :
PSComputerName              :
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties
ShareName                   : OneNote
PrinterState                : 0
Shared                      : True
ServerName                  : \\DESKTOP-PC


Status                      :
Name                        : Microsoft XPS Document Writer
Caption                     :
Description                 :
InstallDate                 :
Availability                :
DeviceID                    : Microsoft-XPS-Document-Writer
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties
ShareName                   :
PrinterState                : 0
Shared                      : False
ServerName                  :


Status                      :
Name                        : Microsoft Print to PDF
Description                 :
DeviceID                    : Microsoft_Print_to_PDF
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties
ShareName                   :
PrinterState                : 1
Shared                      : False
ServerName                  :

Status                      :
Name                        : Fax
Description                 :
InstallDate                 :
DeviceID                    : Fax
CimClass                    : root/cimv2:Win32_Printer
CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties
ShareName                   :
PrinterState                : 0
Shared                      : False
ServerName                  :

`;

it("returns list of available printers", async () => {
  mockedExecAsync.mockResolvedValue({
    stdout: mockPrinterListStdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters();

  expect(result).toStrictEqual([
    {
      deviceId: "OneNote",
      name: "OneNote",
      paperSizes: [],
      shareName: "OneNote",
      shared: true,
      printerState: "idle",
      serverName: "\\DESKTOP-PC",
    },
    {
      deviceId: "Microsoft-XPS-Document-Writer",
      name: "Microsoft XPS Document Writer",
      paperSizes: [],
      shareName: "",
      shared: false,
      printerState: "idle",
      serverName: "",
    },
    {
      deviceId: "Microsoft_Print_to_PDF",
      name: "Microsoft Print to PDF",
      paperSizes: [],
      shareName: "",
      shared: false,
      printerState: "unknown",
      serverName: "",
    },
    {
      deviceId: "Fax",
      name: "Fax",
      paperSizes: [],
      shareName: "",
      shared: false,
      printerState: "idle",
      serverName: "",
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
  DeviceID                    : Canon-Printer
  PaperSizesSupported         : {1, 1, 1, 1...}
  PortName                    : USB001
  PrinterPaperNames           : {A4, 144mm x 100mm, 2 x 4, 4 x 4...}
  ShareName                   :
  PrinterState                : 0
  ServerName                  :
  `;

  mockedExecAsync.mockResolvedValue({
    stdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters();

  expect(result).toStrictEqual([
    {
      deviceId: "Canon-Printer",
      name: "Canon Printer",
      paperSizes: ["A4", "144mm x 100mm", "2 x 4", "4 x 4"],
      shareName: "",
      shared: false,
      printerState: "idle",
      serverName: "",
    },
  ]);
});
it("should handle multiple printers with empty properties without throwing errors", async () => {
  const stdout = `
  Status                      :
  Name                        : Microsoft XPS Document Writer
  Caption                     :
  Description                 :
  InstallDate                 :
  Availability                :
  ConfigManagerErrorCode      :
  ConfigManagerUserConfig     :
  CreationClassName           :
  DeviceID                    : Microsoft XPS Document Writer
  ErrorCleared                :
  ErrorDescription            :
  LastErrorCode               :
  PNPDeviceID                 :
  PowerManagementCapabilities :
  PowerManagementSupported    :
  StatusInfo                  :
  SystemCreationClassName     :
  SystemName                  :
  AvailableJobSheets          :
  Capabilities                :
  CapabilityDescriptions      :
  CharSetsSupported           :
  CurrentCapabilities         :
  CurrentCharSet              :
  CurrentLanguage             :
  CurrentMimeType             :
  CurrentNaturalLanguage      :
  CurrentPaperType            :
  DefaultCapabilities         :
  DefaultCopies               :
  DefaultLanguage             :
  DefaultMimeType             :
  DefaultNumberUp             :
  DefaultPaperType            :
  DetectedErrorState          :
  ErrorInformation            :
  HorizontalResolution        :
  JobCountSinceLastReset      :
  LanguagesSupported          :
  MarkingTechnology           :
  MaxCopies                   :
  MaxNumberUp                 :
  MaxSizeSupported            :
  MimeTypesSupported          :
  NaturalLanguagesSupported   :
  PaperSizesSupported         :
  PaperTypesAvailable         :
  PrinterStatus               :
  TimeOfLastReset             :
  VerticalResolution          :
  Attributes                  :
  AveragePagesPerMinute       :
  Comment                     :
  Default                     :
  DefaultPriority             :
  Direct                      :
  DoCompleteFirst             :
  DriverName                  :
  EnableBIDI                  :
  EnableDevQueryPrint         :
  ExtendedDetectedErrorState  :
  ExtendedPrinterStatus       :
  Hidden                      :
  KeepPrintedJobs             :
  Local                       :
  Location                    :
  Network                     :
  Parameters                  :
  PortName                    :
  PrinterPaperNames           : {Carta, Carta pequeña, Tabloide, Doble carta...}
  PrinterState                : 0
  PrintJobDataType            :
  PrintProcessor              :
  Priority                    :
  Published                   :
  Queued                      :
  RawOnly                     :
  SeparatorFile               :
  ServerName                  :
  Shared                      : False
  ShareName                   :
  SpoolEnabled                :
  StartTime                   :
  UntilTime                   :
  WorkOffline                 :
  PSComputerName              :
  CimClass                    : root/cimv2:Win32_Printer
  CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
  CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties






  Status                      :
  Name                        : Microsoft Print to PDF
  Caption                     :
  Description                 :
  InstallDate                 :
  Availability                :
  ConfigManagerErrorCode      :
  ConfigManagerUserConfig     :
  CreationClassName           :
  DeviceID                    : Microsoft Print to PDF
  ErrorCleared                :
  ErrorDescription            :
  LastErrorCode               :
  PNPDeviceID                 :
  PowerManagementCapabilities :
  PowerManagementSupported    :
  StatusInfo                  :
  SystemCreationClassName     :
  SystemName                  :
  AvailableJobSheets          :
  Capabilities                :
  CapabilityDescriptions      :
  CharSetsSupported           :
  CurrentCapabilities         :
  CurrentCharSet              :
  CurrentLanguage             :
  CurrentMimeType             :
  CurrentNaturalLanguage      :
  CurrentPaperType            :
  DefaultCapabilities         :
  DefaultCopies               :
  DefaultLanguage             :
  DefaultMimeType             :
  DefaultNumberUp             :
  DefaultPaperType            :
  DetectedErrorState          :
  ErrorInformation            :
  HorizontalResolution        :
  JobCountSinceLastReset      :
  LanguagesSupported          :
  MarkingTechnology           :
  MaxCopies                   :
  MaxNumberUp                 :
  MaxSizeSupported            :
  MimeTypesSupported          :
  NaturalLanguagesSupported   :
  PaperSizesSupported         :
  PaperTypesAvailable         :
  PrinterStatus               :
  TimeOfLastReset             :
  VerticalResolution          :
  Attributes                  :
  AveragePagesPerMinute       :
  Comment                     :
  Default                     :
  DefaultPriority             :
  Direct                      :
  DoCompleteFirst             :
  DriverName                  :
  EnableBIDI                  :
  EnableDevQueryPrint         :
  ExtendedDetectedErrorState  :
  ExtendedPrinterStatus       :
  Hidden                      :
  KeepPrintedJobs             :
  Local                       :
  Location                    :
  Network                     :
  Parameters                  :
  PortName                    :
  PrinterPaperNames           : {Carta, Tabloide, Oficio, Estamento...}
  PrinterState                : 0
  PrintJobDataType            :
  PrintProcessor              :
  Priority                    :
  Published                   :
  Queued                      :
  RawOnly                     :
  SeparatorFile               :
  ServerName                  :
  Shared                      : False
  ShareName                   :
  SpoolEnabled                :
  StartTime                   :
  UntilTime                   :
  WorkOffline                 :
  PSComputerName              :
  CimClass                    : root/cimv2:Win32_Printer
  CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
  CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties






  Status                      :
  Name                        : Generic / Text Only
  Caption                     :
  Description                 :
  InstallDate                 :
  Availability                :
  ConfigManagerErrorCode      :
  ConfigManagerUserConfig     :
  CreationClassName           :
  DeviceID                    : Generic / Text Only
  ErrorCleared                :
  ErrorDescription            :
  LastErrorCode               :
  PNPDeviceID                 :
  PowerManagementCapabilities :
  PowerManagementSupported    :
  StatusInfo                  :
  SystemCreationClassName     :
  SystemName                  :
  AvailableJobSheets          :
  Capabilities                :
  CapabilityDescriptions      :
  CharSetsSupported           :
  CurrentCapabilities         :
  CurrentCharSet              :
  CurrentLanguage             :
  CurrentMimeType             :
  CurrentNaturalLanguage      :
  CurrentPaperType            :
  DefaultCapabilities         :
  DefaultCopies               :
  DefaultLanguage             :
  DefaultMimeType             :
  DefaultNumberUp             :
  DefaultPaperType            :
  DetectedErrorState          :
  ErrorInformation            :
  HorizontalResolution        :
  JobCountSinceLastReset      :
  LanguagesSupported          :
  MarkingTechnology           :
  MaxCopies                   :
  MaxNumberUp                 :
  MaxSizeSupported            :
  MimeTypesSupported          :
  NaturalLanguagesSupported   :
  PaperSizesSupported         :
  PaperTypesAvailable         :
  PrinterStatus               :
  TimeOfLastReset             :
  VerticalResolution          :
  Attributes                  :
  AveragePagesPerMinute       :
  Comment                     :
  Default                     :
  DefaultPriority             :
  Direct                      :
  DoCompleteFirst             :
  DriverName                  :
  EnableBIDI                  :
  EnableDevQueryPrint         :
  ExtendedDetectedErrorState  :
  ExtendedPrinterStatus       :
  Hidden                      :
  KeepPrintedJobs             :
  Local                       :
  Location                    :
  Network                     :
  Parameters                  :
  PortName                    :
  PrinterPaperNames           : {Carta, Tabloide, Doble carta, Oficio...}
  PrinterState                : 6
  PrintJobDataType            :
  PrintProcessor              :
  Priority                    :
  Published                   :
  Queued                      :
  RawOnly                     :
  SeparatorFile               :
  ServerName                  :
  Shared                      : False
  ShareName                   : Generic  Text Only
  SpoolEnabled                :
  StartTime                   :
  UntilTime                   :
  WorkOffline                 :
  PSComputerName              :
  CimClass                    : root/cimv2:Win32_Printer
  CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
  CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties






  Status                      :
  Name                        : Fax
  Caption                     :
  Description                 :
  InstallDate                 :
  Availability                :
  ConfigManagerErrorCode      :
  ConfigManagerUserConfig     :
  CreationClassName           :
  DeviceID                    : Fax
  ErrorCleared                :
  ErrorDescription            :
  LastErrorCode               :
  PNPDeviceID                 :
  PowerManagementCapabilities :
  PowerManagementSupported    :
  StatusInfo                  :
  SystemCreationClassName     :
  SystemName                  :
  AvailableJobSheets          :
  Capabilities                :
  CapabilityDescriptions      :
  CharSetsSupported           :
  CurrentCapabilities         :
  CurrentCharSet              :
  CurrentLanguage             :
  CurrentMimeType             :
  CurrentNaturalLanguage      :
  CurrentPaperType            :
  DefaultCapabilities         :
  DefaultCopies               :
  DefaultLanguage             :
  DefaultMimeType             :
  DefaultNumberUp             :
  DefaultPaperType            :
  DetectedErrorState          :
  ErrorInformation            :
  HorizontalResolution        :
  JobCountSinceLastReset      :
  LanguagesSupported          :
  MarkingTechnology           :
  MaxCopies                   :
  MaxNumberUp                 :
  MaxSizeSupported            :
  MimeTypesSupported          :
  NaturalLanguagesSupported   :
  PaperSizesSupported         :
  PaperTypesAvailable         :
  PrinterStatus               :
  TimeOfLastReset             :
  VerticalResolution          :
  Attributes                  :
  AveragePagesPerMinute       :
  Comment                     :
  Default                     :
  DefaultPriority             :
  Direct                      :
  DoCompleteFirst             :
  DriverName                  :
  EnableBIDI                  :
  EnableDevQueryPrint         :
  ExtendedDetectedErrorState  :
  ExtendedPrinterStatus       :
  Hidden                      :
  KeepPrintedJobs             :
  Local                       :
  Location                    :
  Network                     :
  Parameters                  :
  PortName                    :
  PrinterPaperNames           : {Carta, Carta pequeña, Oficio, Estamento...}
  PrinterState                : 0
  PrintJobDataType            :
  PrintProcessor              :
  Priority                    :
  Published                   :
  Queued                      :
  RawOnly                     :
  SeparatorFile               :
  ServerName                  :
  Shared                      : False
  ShareName                   :
  SpoolEnabled                :
  StartTime                   :
  UntilTime                   :
  WorkOffline                 :
  PSComputerName              :
  CimClass                    : root/cimv2:Win32_Printer
  CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
  CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties






  Status                      :
  Name                        : AnyDesk Printer
  Caption                     :
  Description                 :
  InstallDate                 :
  Availability                :
  ConfigManagerErrorCode      :
  ConfigManagerUserConfig     :
  CreationClassName           :
  DeviceID                    : AnyDesk Printer
  ErrorCleared                :
  ErrorDescription            :
  LastErrorCode               :
  PNPDeviceID                 :
  PowerManagementCapabilities :
  PowerManagementSupported    :
  StatusInfo                  :
  SystemCreationClassName     :
  SystemName                  :
  AvailableJobSheets          :
  Capabilities                :
  CapabilityDescriptions      :
  CharSetsSupported           :
  CurrentCapabilities         :
  CurrentCharSet              :
  CurrentLanguage             :
  CurrentMimeType             :
  CurrentNaturalLanguage      :
  CurrentPaperType            :
  DefaultCapabilities         :
  DefaultCopies               :
  DefaultLanguage             :
  DefaultMimeType             :
  DefaultNumberUp             :
  DefaultPaperType            :
  DetectedErrorState          :
  ErrorInformation            :
  HorizontalResolution        :
  JobCountSinceLastReset      :
  LanguagesSupported          :
  MarkingTechnology           :
  MaxCopies                   :
  MaxNumberUp                 :
  MaxSizeSupported            :
  MimeTypesSupported          :
  NaturalLanguagesSupported   :
  PaperSizesSupported         :
  PaperTypesAvailable         :
  PrinterStatus               :
  TimeOfLastReset             :
  VerticalResolution          :
  Attributes                  :
  AveragePagesPerMinute       :
  Comment                     :
  Default                     :
  DefaultPriority             :
  Direct                      :
  DoCompleteFirst             :
  DriverName                  :
  EnableBIDI                  :
  EnableDevQueryPrint         :
  ExtendedDetectedErrorState  :
  ExtendedPrinterStatus       :
  Hidden                      :
  KeepPrintedJobs             :
  Local                       :
  Location                    :
  Network                     :
  Parameters                  :
  PortName                    :
  PrinterPaperNames           : {Carta, Tabloide, Oficio, Ejecutivo...}
  PrinterState                : 0
  PrintJobDataType            :
  PrintProcessor              :
  Priority                    :
  Published                   :
  Queued                      :
  RawOnly                     :
  SeparatorFile               :
  ServerName                  :
  Shared                      : True
  ShareName                   : AnyDesk Printer
  SpoolEnabled                :
  StartTime                   :
  UntilTime                   :
  WorkOffline                 :
  PSComputerName              :
  CimClass                    : root/cimv2:Win32_Printer
  CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
  CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties






  Status                      :
  Name                        : A8 MiniPrinter
  Caption                     :
  Description                 :
  InstallDate                 :
  Availability                :
  ConfigManagerErrorCode      :
  ConfigManagerUserConfig     :
  CreationClassName           :
  DeviceID                    : A8 MiniPrinter
  ErrorCleared                :
  ErrorDescription            :
  LastErrorCode               :
  PNPDeviceID                 :
  PowerManagementCapabilities :
  PowerManagementSupported    :
  StatusInfo                  :
  SystemCreationClassName     :
  SystemName                  :
  AvailableJobSheets          :
  Capabilities                :
  CapabilityDescriptions      :
  CharSetsSupported           :
  CurrentCapabilities         :
  CurrentCharSet              :
  CurrentLanguage             :
  CurrentMimeType             :
  CurrentNaturalLanguage      :
  CurrentPaperType            :
  DefaultCapabilities         :
  DefaultCopies               :
  DefaultLanguage             :
  DefaultMimeType             :
  DefaultNumberUp             :
  DefaultPaperType            :
  DetectedErrorState          :
  ErrorInformation            :
  HorizontalResolution        :
  JobCountSinceLastReset      :
  LanguagesSupported          :
  MarkingTechnology           :
  MaxCopies                   :
  MaxNumberUp                 :
  MaxSizeSupported            :
  MimeTypesSupported          :
  NaturalLanguagesSupported   :
  PaperSizesSupported         :
  PaperTypesAvailable         :
  PrinterStatus               :
  TimeOfLastReset             :
  VerticalResolution          :
  Attributes                  :
  AveragePagesPerMinute       :
  Comment                     :
  Default                     :
  DefaultPriority             :
  Direct                      :
  DoCompleteFirst             :
  DriverName                  :
  EnableBIDI                  :
  EnableDevQueryPrint         :
  ExtendedDetectedErrorState  :
  ExtendedPrinterStatus       :
  Hidden                      :
  KeepPrintedJobs             :
  Local                       :
  Location                    :
  Network                     :
  Parameters                  :
  PortName                    :
  PrinterPaperNames           : {Roll Paper 80 x 40 mm, Roll Paper 80 x 80 mm, Roll Paper 80 x 120 mm, Roll Paper 80
                                x 160 mm...}
  PrinterState                : 1030
  PrintJobDataType            :
  PrintProcessor              :
  Priority                    :
  Published                   :
  Queued                      :
  RawOnly                     :
  SeparatorFile               :
  ServerName                  :
  Shared                      : False
  ShareName                   : A8 MiniPrinter
  SpoolEnabled                :
  StartTime                   :
  UntilTime                   :
  WorkOffline                 :
  PSComputerName              :
  CimClass                    : root/cimv2:Win32_Printer
  CimInstanceProperties       : {Caption, Description, InstallDate, Name...}
  CimSystemProperties         : Microsoft.Management.Infrastructure.CimSystemProperties
  `;
  mockedExecAsync.mockResolvedValue({
    stdout,
    stderr: "",
  });

  const result: Printer[] = await getPrinters();
  console.log(result);
  return expect(result.length).toBe(6);
});