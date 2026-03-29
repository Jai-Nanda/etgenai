/**
 * Validates a user-selected file for bank-style CSV upload.
 * Browsers often omit MIME type for .csv; extension is the reliable signal.
 */
export function validateCsvFile(file) {
  if (!file) {
    return { ok: false, message: 'No file selected.' }
  }
  const name = file.name.toLowerCase()
  if (!name.endsWith('.csv')) {
    return {
      ok: false,
      message: 'Please upload a .csv file (bank export).',
    }
  }
  const type = file.type
  const allowed =
    type === '' ||
    type === 'text/csv' ||
    type === 'application/csv' ||
    type === 'application/vnd.ms-excel' ||
    type === 'text/plain' ||
    type === 'text/comma-separated-values' ||
    type === 'application/octet-stream'
  if (!allowed) {
    return {
      ok: false,
      message: 'This file type is not supported. Use a CSV export.',
    }
  }
  return { ok: true, message: '' }
}
