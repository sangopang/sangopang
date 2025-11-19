import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "w7c95t9q",
  dataset: "production",
  apiVersion: "2024-01-01",
  token:
    "skuJK9h0WIxdwhYw1luNlc8AgYKDFN4ot84Xv19iTcq0GXUWerJHgfHbmM7GaURL0IRKkVTm5ksa802ROmX9oMqN6eCm365ayPjZOwFfxRKtkXDpazw7XbMjAMcjTObyFh1yDq8RYCW3W46d3G2Bk5nrOTHoXId6Y32lq32j6jctQfSYfeuM",
  useCdn: false,
});

// Categories for equal distribution
const targetCategories = [
  "jayapura-20251116081606",
  "nagardagara-20251116081650",
  "khela-snsaara-20251116082055",
  "photo-pheechara-20251116082033",
  "sangopang-english-20251116082148",
];

// Extract plain text from Portable Text
function getPlainText(blocks) {
  if (!blocks) return "";

  return blocks
    .filter((block) => block._type === "block")
    .map((block) => {
      if (block.children) {
        return block.children.map((child) => child.text).join("");
      }
      return "";
    })
    .join(" ");
}

// Extract first image from content as featured image
function extractFeaturedImage(content) {
  if (!content) return null;

  const imageBlock = content.find((block) => block._type === "cloudinaryImage");

  if (imageBlock && imageBlock.url) {
    return {
      url: imageBlock.url,
      alt: imageBlock.caption || imageBlock.alt || "",
      caption: imageBlock.caption || "",
    };
  }

  return null;
}

// Shuffle array randomly
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function distributePostsToCategories() {
  console.log("🚀 Starting Random Equal Distribution...\n");

  // Load and cache categories
  console.log("📦 Loading categories...");
  const categories = await client.fetch(
    `*[_type == "category"] { _id, "slug": slug.current }`
  );
  const categoryCache = {};
  categories.forEach((cat) => {
    categoryCache[cat.slug] = { _type: "reference", _ref: cat._id };
  });
  console.log(`✅ Loaded ${categories.length} categories\n`);

  // Fetch all posts from duniya-jahan
  const posts = await client.fetch(`
    *[_type == "post" && category->slug.current == "duniya-jahan"] {
      _id,
      title,
      content,
      mainImageUrl,
      mainImageAlt,
      mainImageCaption,
      slug
    }
  `);

  console.log(`📊 Found ${posts.length} posts in duniya-jahan\n`);

  // Shuffle posts randomly
  const shuffledPosts = shuffleArray(posts);

  // Calculate posts per category
  const postsPerCategory = Math.floor(
    shuffledPosts.length / targetCategories.length
  );
  console.log(`📐 Dividing into ${postsPerCategory} posts per category\n`);

  const categoryDistribution = {};
  const updates = [];

  console.log("🔄 Processing posts...\n");

  for (let i = 0; i < shuffledPosts.length; i++) {
    const post = shuffledPosts[i];

    // Progress indicator
    if ((i + 1) % 100 === 0) {
      console.log(`⏳ Processed ${i + 1}/${shuffledPosts.length} posts...`);
    }

    // Assign category based on index (equal distribution)
    const categoryIndex = Math.floor(i / postsPerCategory);
    const assignedCategory =
      categoryIndex < targetCategories.length
        ? targetCategories[categoryIndex]
        : targetCategories[targetCategories.length - 1];

    // Track distribution
    categoryDistribution[assignedCategory] =
      (categoryDistribution[assignedCategory] || 0) + 1;

    // Extract featured image if not present
    let featuredImage = null;
    if (!post.mainImageUrl && post.content) {
      featuredImage = extractFeaturedImage(post.content);
    }

    // Get category reference
    const categoryRef = categoryCache[assignedCategory];

    if (!categoryRef) {
      console.log(`⚠️  Category not in cache: ${assignedCategory}`);
      continue;
    }

    const updateData = { category: categoryRef };

    // Add featured image if found
    if (featuredImage) {
      updateData.mainImageUrl = featuredImage.url;
      updateData.mainImageAlt = featuredImage.alt;
      updateData.mainImageCaption = featuredImage.caption;
    }

    updates.push({
      id: post._id,
      title: post.title,
      category: assignedCategory,
      data: updateData,
    });
  }

  console.log("\n📈 Distribution Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  for (const [cat, count] of Object.entries(categoryDistribution)) {
    console.log(`${cat.padEnd(40)} : ${count} posts`);
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`⚠️  Ready to update ${updates.length} posts\n`);

  return updates;
}

async function updatePosts(updates) {
  console.log("🔄 Updating posts in Sanity...\n");

  let successCount = 0;
  let errorCount = 0;
  let featuredImagesAdded = 0;

  const batchSize = 10;

  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (update) => {
        try {
          await client.patch(update.id).set(update.data).commit();
          successCount++;
          if (update.data.mainImageUrl) {
            featuredImagesAdded++;
          }
        } catch (error) {
          errorCount++;
          console.error(`❌ Error: ${update.title.substring(0, 50)}...`);
        }
      })
    );

    console.log(
      `✅ Updated ${Math.min(i + batchSize, updates.length)}/${updates.length} posts...`
    );
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`✅ Success: ${successCount} posts`);
  console.log(`🖼️  Featured Images Added: ${featuredImagesAdded}`);
  console.log(`❌ Errors: ${errorCount} posts`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("🎉 Done!\n");
}

export { distributePostsToCategories, updatePosts };
