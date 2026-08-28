import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const dataPath = path.join(root, 'src', 'data.js');
const source = fs.readFileSync(dataPath, 'utf8');
const window = {};
vm.runInNewContext(source, { window });

const records = window.CAD_PROJECTS;
const failures = [];
const assetRefs = [];
const sourceCad = /\.(sldprt|sldasm|slddrw|f3d|f3z|step|iges)$/i;

if (!Array.isArray(records) || records.length === 0) {
  failures.push('window.CAD_PROJECTS is empty or missing');
}

for (const record of records || []) {
  if (!record.id) failures.push('record without id');
  if (record.placeholder) failures.push(`${record.id}: active placeholder`);

  for (const field of ['preview', 'drawing', 'model3d']) {
    const value = typeof record[field] === 'string' ? record[field] : record[field]?.src;
    if (value) assetRefs.push({ id: record.id, field, value });
  }

  for (const field of ['images', 'additionalImages']) {
    for (const value of record[field] || []) {
      assetRefs.push({ id: record.id, field, value });
    }
  }
}

for (const asset of assetRefs) {
  if (sourceCad.test(asset.value)) {
    failures.push(`${asset.id}: source CAD exposed in ${asset.field}`);
    continue;
  }
  if (!asset.value.startsWith('./')) {
    failures.push(`${asset.id}: ${asset.field} must use a relative ./assets path`);
    continue;
  }
  const localPath = path.join(root, asset.value.slice(2));
  if (!fs.existsSync(localPath)) failures.push(`${asset.id}: missing ${asset.value}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`CAD gallery valid: ${records.length} records, ${assetRefs.length} assets, no active placeholders.`);
