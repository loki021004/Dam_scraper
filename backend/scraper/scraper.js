const axios = require('axios');
const cheerio = require('cheerio');

const scrapeDamLevels = async () => {
  try {
    const url = 'https://tnagriculture.in/ARS/home/reservoir';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const damData = [];

    $('table tbody tr').each((i, row) => {
      const columns = $(row).find('td');
      if (columns.length >= 5) {
        damData.push({
          damName: $(columns[0]).text().trim(),
          fullDepth: $(columns[1]).text().trim(),
          fullCapacity: $(columns[2]).text().trim(),
          currentWaterLevel: $(columns[3]).text().trim(),
          currentStorageVolume: $(columns[4]).text().trim(),
          inflow: $(columns[5]).text().trim(),
          outflow: $(columns[6]).text().trim()
        });
      }
    });
    const dateText = $('p.text-center').text().trim();
    const match = dateText.match(/\d{2}-\d{2}-\d{4}/); 
    const date = match ? match[0] : null;
    const updatedDamData = damData.map(dam=>({
        ...dam,
        date:date
    }));

    return updatedDamData;
  } catch (err) {
    console.error('Scraping Error:', err.message);
    return [];
  }
};

scrapeDamLevels()

module.exports = scrapeDamLevels;