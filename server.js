const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');

const app = express();
const port = 3002;

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const uri = 'mongodb+srv://s224066334:Yash%40123@cluster1.1kwkxeo.mongodb.net/';
const client = new MongoClient(uri, { serverApi: ServerApiVersion.latest });

let collection;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const database = client.db();
        collection = database.collection('Cat');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

connectToDatabase();

// Defining Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/cards', async (req, res) => {
    try {
        const cards = await getAllCards();
        res.json(cards);
    } catch (err) {
        console.error('Error fetching cards:', err);
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
});

app.post('/api/cards', async (req, res) => {
    const card = req.body;
    try {
        await postCard(card);
        res.status(201).json({ message: 'Card added successfully' });
    } catch (err) {
        console.error('Error adding card:', err);
        res.status(500).json({ error: 'Failed to add card' });
    }
});

app.delete('/api/cards', async (req, res) => {
    try {
        await collection.deleteMany({});
        res.status(200).json({ message: 'All cards deleted successfully' });
    } catch (err) {
        console.error('Error deleting all cards:', err);
        res.status(500).json({ error: 'Failed to delete all cards' });
    }
});

// Database Operations Functions
async function postCard(card) {
    try {
        await collection.insertOne(card);
    } catch (err) {
        console.error('Error posting card:', err);
        throw err;
    }
}

async function getAllCards() {
    try {
        const cards = await collection.find({}).toArray();
        return cards;
    } catch (err) {
        console.error('Error fetching cards:', err);
        throw err;
    }
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});