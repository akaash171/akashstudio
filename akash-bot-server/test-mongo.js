require('dns').setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require("mongoose");
require("dotenv").config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected Successfully");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

test();