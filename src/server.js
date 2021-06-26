import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import path from 'path';

const app = express();
const port = process.env.port || 8005;
const url ="mongodb://hassonb:password@192.168.0.88/my-blog?poolSize=20&writeConcern=majority";
const dbName = "my-blog";
const collection = 'articles';

// Used to translate the request body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// Include static files for the APP
app.use(express.static(path.join(__dirname, '/build')));

const withDB = async (operations, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        // Make connection to DB
        await client.connect();

        // Establish and verify connection - Connect to collections
        const db = await client.db(dbName).collection(collection);
        console.log(`DB name: ${dbName} connected to ${collection}`);
        
        // Run given operation
        await operations(db)
        
    } catch(e) {
        // Catch error and print to console
        console.error(e);
        res.status(500).json({message:'Error connecting to db',error:e});
    } finally {
        // Close connection to the DB
        await client.close();
    }
}

app.get('/api/articles/:name', async (req, res) => {
    const articleName = req.params.name;
    withDB(async (collections) => {
        // Find the given article or return null
        const articleInfo = await collections.findOne({name: articleName});
        console.log(`document GET ${articleName}`) 
        res.status(200).json(articleInfo);
    }, res);
});

app.post('/api/articles/:name/add-comment', (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;
    
    withDB(async collections => {
        // Find the given article or return null
        const articleInfo = await collections.findOne({name: articleName});

        // Set article to new value
        const newData = {$set: {comments: articleInfo.comments.concat({ username, text })}}
        const find = {name: articleName}
        await collections.updateOne(find, newData);
        console.log(`document comments in ${articleName}`);

        // Get the new updated article
        const updatedArticle = await collections.findOne({name: articleName});

        // Return article to user
        res.status(200).json(updatedArticle);

    }, res);

});

app.post('/api/articles/:name/upvote', async (req, res) => {
    const articleName = req.params.name;
    withDB(async (collections) => {
        // Find the given article or return null
        const articleInfo = await collections.findOne({name: articleName});

        // Set article to new value
        const newData = {$set: {upvotes: articleInfo.upvotes + 1,}}
        const find = {name: articleName}
        await collections.updateOne(find, newData);
        console.log(`document updated 1 ${articleName}`);

        // Get the new updated article
        const article2Info = await collections.findOne({name: articleName});

        // Return article to user
        res.status(200).json(article2Info);
    }, res );
});

// any other requests for the API get passed onto our APP
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
})

app.listen(port, () => console.log(`listening on port ${port}`));