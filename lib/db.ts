import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDb() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in environment variables.");
  }

  let normalizedMongoUri = mongoUri;
  try {
    const parsed = new URL(mongoUri);
    // Guard against unsupported Mongo option accidentally added in URI.
    parsed.searchParams.delete("alumni_db");
    normalizedMongoUri = parsed.toString();
  } catch {
    normalizedMongoUri = mongoUri;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(normalizedMongoUri, {
      dbName: "amtoli",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
