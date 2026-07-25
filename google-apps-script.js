const SHEET_NAME = "Pedidos";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheet_();
    const data = parseRequest_(e);
    const now = new Date();

    sheet.appendRow([
      now,
      data.producto || "Gafas de Sol Inteligentes Pro Max",
      data.precio || "39",
      data.nombre || "",
      data.telefono || "",
      data.provincia || "",
      data.ciudad || "",
      data.direccion || "",
      data.pais || "El Salvador",
      data.pago || "COD",
      data.envio || "Gratis",
      data.origen || "",
      data.fecha || ""
    ]);

    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, message: "Order endpoint is live." });
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Fecha de Registro",
      "Producto",
      "Precio",
      "Nombre y Apellido",
      "Telefono",
      "Provincia",
      "Ciudad/Municipio",
      "Direccion Completa",
      "Pais",
      "Pago",
      "Envio",
      "Origen",
      "Fecha del Cliente"
    ]);
  }

  return sheet;
}

function parseRequest_(e) {
  if (!e || !e.postData) return {};

  const raw = e.postData.contents || "";
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (error) {
    const params = e.parameter || {};
    return Object.keys(params).length ? params : {};
  }
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
