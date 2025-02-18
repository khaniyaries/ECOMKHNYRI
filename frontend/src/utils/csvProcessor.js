export const processCSV = async (file) => {
    const text = await file.text();
    const rows = text.split('\n');
    const headers = rows[0].split(',');
    
    return rows.slice(1).map(row => {
      const values = row.split(',');
      const product = {};
      headers.forEach((header, index) => {
        product[header.trim()] = values[index]?.trim();
      });
      return product;
    });
  };
  