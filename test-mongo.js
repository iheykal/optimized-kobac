const mongoose = require('mongoose');

const uri = "mongodb+srv://e4znHByQ3QiNgH9z:e4znHByQ3QiNgH9z@ilyaas2012.0v7gqav.mongodb.net/kobac-real-estate";

async function testConnection() {
    console.log('Attempting to connect to MongoDB...');
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout
        });
        console.log('SUCCESS! Connected to MongoDB.');
        process.exit(0);
    } catch (error) {
        console.error('ERROR connecting to MongoDB:');
        console.error(error.message);
        process.exit(1);
    }
}

testConnection();
