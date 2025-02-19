export const processCSV = async (file) => {
  const text = await file.text();
  const rows = text.split('\n');
  const headers = rows[0].split(',').map(h => h.trim());
  
  return rows.slice(1).map(row => {
      const values = row.split(',');
      const product = {};
      
      headers.forEach((header, index) => {
          const value = values[index]?.trim() || '';
          
          switch(header) {
              case 'colors':
              case 'sizes':
                  product[header] = value ? value.split('|') : [];
                  break;
              case 'price':
              case 'stock':
              case 'percentageOff':
                  product[header] = value ? Number(value) : 0;
                  break;
              case 'isFlashSale':
                  product[header] = value ? value.toLowerCase() === 'true' : false;
                  break;
              default:
                  product[header] = value;
          }
      });
      
      return product;
  }).filter(product => product.name); // Only return products with names
};
