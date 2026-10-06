// src/utils/exportUtils.js — pass the CURRENTLY FILTERED rows (feature.properties objects)
const COLS = ["id","station_name","state","district","source_table","status","commenced_on","closed_on",
  "mast_height_m","latitude","longitude","elevation_m","maws","mawpd","project_type","pdf_page"];
const COLORS = { Operational: "ff00aa00", Closed: "ff0000ff", Unknown: "ff888888" };
const esc = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

function download(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  Object.assign(document.createElement("a"), { href: url, download: filename }).click();
  URL.revokeObjectURL(url);
}

export function exportCSV(rows, filename = "stations_filtered.csv") {
  const cell = (v) => (v == null ? "" : `"${String(v).replace(/"/g, '""')}"`);
  const csv = [COLS.join(","), ...rows.map((r) => COLS.map((c) => cell(r[c])).join(","))].join("\r\n");
  download("\ufeff" + csv, filename, "text/csv;charset=utf-8");   // BOM so Excel reads UTF-8
}

export async function exportExcel(rows, filename = "stations_filtered.xlsx") {
  const XLSX = await import("xlsx");                              // npm i xlsx (loaded only on click)
  const ws = XLSX.utils.json_to_sheet(rows.map((r) => Object.fromEntries(COLS.map((c) => [c, r[c] ?? ""]))));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Stations");
  XLSX.writeFile(wb, filename);
}

export function exportKML(rows, filename = "stations_filtered.kml") {
  const styles = Object.entries(COLORS).map(([k, c]) =>
    `<Style id="${k}"><IconStyle><color>${c}</color><Icon><href>http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png</href></Icon></IconStyle></Style>`).join("");
  const byState = {};
  rows.filter((r) => r.latitude != null && r.longitude != null)
      .forEach((r) => (byState[r.state] ??= []).push(r));
  const folders = Object.entries(byState).map(([state, list]) =>
    `<Folder><name>${esc(state)} (${list.length})</name>${list.map((r) =>
      `<Placemark><name>${esc(r.station_name)}</name><description><![CDATA[<table>` +
      `<tr><td>District</td><td>${esc(r.district ?? "")}</td></tr><tr><td>Status</td><td>${r.status}</td></tr>` +
      `<tr><td>Commenced</td><td>${r.commenced_on ?? ""}</td></tr><tr><td>Closed</td><td>${r.closed_on ?? ""}</td></tr>` +
      `<tr><td>Mast height (m)</td><td>${r.mast_height_m ?? ""}</td></tr></table>]]></description>` +
      `<styleUrl>#${r.status}</styleUrl><Point><coordinates>${r.longitude},${r.latitude},0</coordinates></Point></Placemark>`).join("")}</Folder>`).join("");
  download(`<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document>${styles}${folders}</Document></kml>`,
    filename, "application/vnd.google-earth.kml+xml");
}