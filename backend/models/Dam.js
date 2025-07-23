const mongoose = require('mongoose');

const damSchema = new mongoose.Schema({
    damName: String,
    fullDepth: Number,
    fullCapacity: Number,
    currentWaterLevel: Number,
    currentStorageVolume: Number,
    inflow: Number,
    outflow: Number,
    date: String,

    // 👇 Add this line to link dam with a specific user
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

module.exports = mongoose.model("DamUser", damSchema);