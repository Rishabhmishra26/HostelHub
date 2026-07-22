/**
 * db.ts
 * --------------------------------------------------------------
 * Sets up ONE shared MongoDB connection using Mongoose.
 *
 * Why a cache?  Next.js reloads modules a lot in development
 * (hot reload) and serverless functions can be invoked many
 * times. Without caching, every request would open a brand new
 * database connection, which is slow and can exhaust the
 * connection pool. We store the connection on the Node.js
 * `global` object so it survives module reloads.
 * --------------------------------------------------------------
 */
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

// Extend the NodeJS global type so TypeScript knows about our cache.
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  // If we already have a live connection, reuse it.
  if (cached.conn) return cached.conn;

  // If a connection attempt is already in progress, wait for it
  // instead of starting a second one.
  if (!cached.promise) {
    // console.log("Mongo URI:", MONGODB_URI);
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
