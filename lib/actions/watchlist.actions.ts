"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";

export const getWatchlistSymbolsByEmail = async (email: string): Promise<string[]> => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      console.error("Database connection not established");
      return [];
    }

    // Find the user by email in the users collection (Better Auth)
    const user = await db.collection("users").findOne(
      { email },
      { projection: { _id: 1, id: 1 } }
    );

    if (!user) {
      console.log(`No user found with email: ${email}`);
      return [];
    }

    // Use the user's id or _id as userId
    const userId = user.id || user._id?.toString();

    if (!userId) {
      console.error("User found but has no valid ID");
      return [];
    }

    // Query the Watchlist by userId and return just the symbols
    const watchlistItems = await Watchlist.find(
      { userId },
      { symbol: 1, _id: 0 }
    ).sort({ addedAt: -1 });

    return watchlistItems.map(item => item.symbol);

  } catch (error) {
    console.error("Error fetching watchlist symbols:", error);
    return [];
  }
};
