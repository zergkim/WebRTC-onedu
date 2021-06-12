import {MongoClient} from 'mongodb';
const url = "";
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