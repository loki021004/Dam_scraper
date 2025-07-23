const express = require('express');
const router = express.Router();
const dam = require('../models/dam');
const scrapeDamLevels = require('../scraper/scraper');
const jwt = require('jsonwebtoken');

const getUserIdFromToken = (req) => {
    const token = req.header("x-auth-token");
    if (!token) throw new Error("No token provided");

    const verified = jwt.verify(token, process.env.JWTPRIVATEKEY);
    return verified._id;
};


router.get('/',async (req,res)=>{
    try{
        const userId = getUserIdFromToken(req);
        const Dam = await dam.find({ userId }).sort({ date: -1 });
        res.json(Dam);
    }catch{
        console.log('couldn\'t get dam');
        res.status(500).json({ message: 'Error fetching dams' });
    }
});

router.post('/', async (req, res)=>{
    const damName = req.body.name
    const userId = getUserIdFromToken(req);

    try{

        const existingDam = await dam.findOne({ damName: { $regex: new RegExp(`^${damName}$`, 'i') } });
        if (existingDam) {
            return res.status(409).json({ message: `Dam "${damName}" already exists.` });
        }

        const damList = await scrapeDamLevels()
        const record = damList.find(r=>{
            return r && r.damName && damName && 
            r.damName.toLowerCase().includes(damName.toLowerCase());
        });
        if (!record){
            console.log('Dam not found in API');
            return res.status(404).json({ message: 'Dam not found' });
        }
        const cleanNumber = (val) => {
            return (val === '--' || val === '-' || val === '' || isNaN(Number(val)))
                ? 0
                : Number(val.toString().replace(/,/g, ''));
        };

        const saved = await dam.create({
            damName : record.damName,
            fullDepth: record.fullDepth,
            fullCapacity:record.fullCapacity,
            currentWaterLevel: record.currentWaterLevel,
            currentStorageVolume:record.currentStorageVolume,
            inflow:cleanNumber(record.inflow),
            outflow:cleanNumber(record.outflow),
            date:record.date,
            userId: userId
        });
        res.json({ message: `Saved data for dam: ${saved.reservoir}` });
    }catch(err){
        console.error("Error in POST /ourdams:",err.message);
        res.status(500).json({ message: 'Failed to fetch or save dam data' });
    }
})

router.delete('/:id', async(req,res)=>{
    const userId = getUserIdFromToken(req);
    const deleted = await dam.findOneAndDelete({ _id: req.params.id, userId });
    if (!deleted) return res.status(403).json({ message: 'Unauthorized or not found' });

    res.json({ message: 'Deleted' });

})

router.get('/search', async (req, res) => {
  const query = req.query.q || '';
  try {
    const scrapedData = await scrapeDamLevels();

    const results = scrapedData.filter(dam =>
      dam &&
      dam.damName &&
      dam.damName.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 10); 

    res.json(results);
  } catch (err) {
    console.error("Scraped search failed:", err.message);
    res.status(500).json({ message: 'Failed to fetch live suggestions' });
  }
});


router.put('/', async(req,res)=>{
    const name = req.body.name
    const userId = getUserIdFromToken(req);

    try{
        const response = await scrapeDamLevels()
        const record = response.find(r=>
            r && r.damName && r.damName.trim().toLowerCase() === name.toLowerCase()
        );

        const updatedDam = await dam.findOneAndUpdate(
            {damName: name, userId},
            {
                damName : record.damName,
                fullDepth: record.fullDepth,
                fullCapacity:record.fullCapacity,
                currentWaterLevel: record.currentWaterLevel,
                currentStorageVolume:record.currentStorageVolume,
                inflow:record.inflow,
                outflow:record.outflow,
                date:record.date
            }
        );

        if (!record) {
            return res.status(404).json({ message: 'Dam not found in scraped data' });
        }

        if (!updatedDam) {
          return res.status(404).json({ message: 'Dam not found in database to update' });
        }

        res.json({ message: 'Dam updated', updated: updatedDam });

        console.log('updated')
    }catch(error){
        console.error("Error fetching dam data:",error.message);
        console.log(name)
        res.status(500).json({ message: "Failed to update dam data" });
    }
})

module.exports = router