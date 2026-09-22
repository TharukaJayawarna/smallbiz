import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUserId } from "@/lib/auth";

export async function getCurrentUser() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return null;
  }

  await connectDB();

  const user = await User.findById(userId).lean();

  return user;
}