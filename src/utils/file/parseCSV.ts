export type Transaction = {
  [key: string]: string;
};

async function parseCSV(csvFile: File) {
  const text = await csvFile.text();

  const lines = text.trim().split('\n');
  const headers = lines[0].split(','); // ["거래일시","적요","입금액" ... ,"거래점"]

  const csv = lines.slice(1).map((line) => {
    const values = line.split(',');
    const obj: Transaction = {};
    headers.forEach((v, idx) => {
      obj[v.trim()] = values[idx]?.trim() ?? '';
    });
    return obj;
  });

  return csv;
}

export default parseCSV;
