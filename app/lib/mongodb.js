
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI);
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    clientPromise = client.connect();
    global._mongoClientPromise = clientPromise;
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}


export default clientPromise;
