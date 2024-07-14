const { MongoClient } = require('mongodb')
// Replace the uri string with your MongoDB deployment's connection string.
const uri = ""; //connection string.
const client = new MongoClient(uri);
var status = "1";
exports.insertlocal = async function (txtname, txtemail, number, numseats, numtime, passdata) {
  console.log(`${txtname} + ${txtemail} + ${number} + ${numseats} + ${numtime} + ${passdata}`);
async function run() {
    try {

      await client.connect();
      const database = client.db("sugar_sip"); // replace db name
      const customers = database.collection("customers"); // replace collection name
      
      const doc = JSON.parse(`${passdata}`);
      const result = await  customers.insertOne(doc); 
        
     
      console.log(`document inserted with the _id: ${result.insertedId}`);
      
      if(!result){
          status = "0";
    }
      
    } finally {
     await client.close();
    }   
  }
  run().catch(console.dir);
 return Date() + status;
}