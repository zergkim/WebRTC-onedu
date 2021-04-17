const {MongoClient} = require("mongodb");
const url = "mongodb+srv://zergkim:kimsh060525@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });
client.connect(async e=>{
    if(e){
        console.error(e)
    }
    console.log('connection_complete!')
    const db = client.db('streamingdata')
    const df = db.collection("videodata")
    const arr = await df.find({}).toArray()
    let d = await df.insertOne({"dfd":["Dfdf"]})
    //const amq = await db.createCollection("eeee")
    //const b =await amq.find({}).toArray()
    console.log(d.insertedId)
})