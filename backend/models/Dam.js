const mongoose = require('mongoose')
const damSchema =  new mongoose.Schema({
    damName:String,
    fullDepth:Number,
    fullCapacity:Number,
    currentWaterLevel:Number,
    currentStorageVolume:Number,
    inflow:Number,
    outflow:Number,
    date: String
});

module.exports = mongoose.model("Dam",damSchema)
