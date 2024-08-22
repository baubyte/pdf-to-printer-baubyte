import { Printer } from "../index";

// map windows-printer key to final printerData key
const properties: { [key: string]: keyof Printer } = {
  DeviceID: "deviceId",
  Name: "name",
  PrinterPaperNames: "paperSizes",
  ShareName: "shareName",
  PrinterState: "printerState",
};

export default function isValidPrinter(printer: string): {
  isValid: boolean;
  printerData: Printer;
} {
  const printerData: Printer = {
    deviceId: "",
    name: "",
    paperSizes: [],
    shared: false,
    shareName: "",
    printerState:"",
    status:""
  };

  printer.split(/\r?\n/).forEach((line) => {
    let [label, value] = line.split(":").map((el) => el.trim());

    // handle array dots
    if (value.match(/^{(.*)(\.{3})}$/)) {
      value = value.replace("...}", "}");
    }

    // handle array returns
    const matches = value.match(/^{(.*)}$/);

    if (matches && matches[1]) {
      // @ts-ignore
      value = matches[1].split(", ");
    }

    const key = properties[label];

    if (key === undefined) return;

    // @ts-ignore
    printerData[key] = value;
  });
  printerData.shared = !!printerData.shareName;
  printerData.status = printerData.printerState === '0' ? 'idle': 'unknown';
  const isValid = !!(printerData.deviceId && printerData.name);

  return {
    isValid,
    printerData,
  };
}
