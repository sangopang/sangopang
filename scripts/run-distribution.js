import {
  distributePostsToCategories,
  updatePosts,
} from "./distribute-posts.js";

async function main() {
  console.log("🚀 शुरू कर रहे हैं...\n");

  const updates = await distributePostsToCategories();

  console.log("\n✅ Summary देख लो ऊपर!");
  console.log("⚠️  5 seconds में updates apply होंगे...\n");

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await updatePosts(updates);

  console.log("🎉 सब posts categories में distribute हो गए!\n");
}

main().catch(console.error);
