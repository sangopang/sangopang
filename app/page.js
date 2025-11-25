import Image from "next/image";
import Link from "next/link";
import { createClient } from "@sanity/client";

export const dynamic = "force-dynamic";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
});

async function getCategoryPosts(categorySlug, limit = 6) {
  return await client.fetch(
    `
    *[_type == "post" && category->slug.current == $slug] | order(publishedAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      "mainImageUrl": mainImage,
      mainImageAlt,
      publishedAt,
      category->{name, slug}
    }
  `,
    { slug: categorySlug }
  );
}

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getCategoryColors = (categorySlug) => {
  const colors = {
    jaipur: {
      bg: "bg-red-100",
      text: "text-red-700",
      button: "text-red-600 hover:text-red-700",
    },
    "nagar-dagar": {
      bg: "bg-green-100",
      text: "text-green-700",
      button: "text-green-600 hover:text-green-700",
    },
    "duniya-jahan": {
      bg: "bg-orange-100",
      text: "text-orange-700",
      button: "text-orange-600 hover:text-orange-700",
    },
    "jeevan-ke-rang": {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      button: "text-yellow-600 hover:text-yellow-700",
    },
    "khel-sansar": {
      bg: "bg-blue-100",
      text: "text-blue-700",
      button: "text-blue-600 hover:text-blue-700",
    },
    vividh: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      button: "text-purple-600 hover:text-purple-700",
    },
  };
  return (
    colors[categorySlug] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
      button: "text-gray-600 hover:text-gray-700",
    }
  );
};

const getGradientByCategory = (categorySlug) => {
  const gradients = {
    jaipur: "from-purple-600 via-pink-600 to-red-600",
    "nagar-dagar": "from-green-400 to-emerald-600",
    "duniya-jahan": "from-orange-400 to-red-600",
    "jeevan-ke-rang": "from-yellow-400 to-orange-500",
    "khel-sansar": "from-blue-400 to-cyan-600",
    vividh: "from-purple-400 to-indigo-600",
  };
  return gradients[categorySlug] || "from-gray-400 to-gray-600";
};

export default async function HomePage() {
  const jaipurPosts = await getCategoryPosts("jaipur", 6);
  const nagarPosts = await getCategoryPosts("nagar-dagar", 6);
  const duniyaPosts = await getCategoryPosts("duniya-jahan", 6);
  const photoPosts = await getCategoryPosts("jeevan-ke-rang", 6);
  const khelPosts = await getCategoryPosts("khel-sansar", 6);
  const vividhPosts = await getCategoryPosts("vividh", 6);

  const allPosts = [
    ...jaipurPosts,
    ...nagarPosts,
    ...duniyaPosts,
    ...photoPosts,
    ...khelPosts,
    ...vividhPosts,
  ];

  const latestPosts = allPosts
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, 15);

  if (!latestPosts || latestPosts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">कोई पोस्ट उपलब्ध नहीं है।</p>
        </div>
      </div>
    );
  }

  const featuredPost = latestPosts[0];
  const listPosts = latestPosts.slice(1, 11);

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Featured Post Banner */}
        {featuredPost && (
          <div className="mb-8 relative overflow-hidden rounded-2xl">
            {featuredPost.mainImageUrl ? (
              <div className="relative h-80">
                <Image
                  src={featuredPost.mainImageUrl}
                  alt={featuredPost.mainImageAlt || featuredPost.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
              </div>
            ) : (
              <div
                className={`h-80 bg-gradient-to-r ${getGradientByCategory(featuredPost.category?.slug?.current)}`}
              />
            )}
            <div className="absolute inset-0 flex items-end">
              <div className="p-8 text-white">
                <span className="bg-red-500 px-3 py-1 rounded text-sm font-semibold">
                  FEATURED
                </span>
                <h2 className="text-4xl font-bold mt-4 mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-lg mb-4 opacity-90">
                  {featuredPost.title.substring(0, 100)}...
                </p>
                <Link
                  href={`/${featuredPost.category?.slug?.current}/${featuredPost.slug?.current}`}
                  className="inline-block bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
                >
                  पूरा पढ़ें →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* List Posts */}
        <div className="space-y-6">
          {listPosts.map((post) => {
            const colors = getCategoryColors(post.category?.slug?.current);
            const gradient = getGradientByCategory(
              post.category?.slug?.current
            );

            return (
              <article
                key={post._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {post.mainImageUrl ? (
                    <div className="md:w-80 h-64 md:h-auto relative flex-shrink-0">
                      <Image
                        src={post.mainImageUrl}
                        alt={post.mainImageAlt || post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`md:w-80 h-64 md:h-auto bg-gradient-to-br ${gradient} flex-shrink-0`}
                    />
                  )}
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`${colors.bg} ${colors.text} px-3 py-1 rounded-full text-xs font-semibold`}
                      >
                        {post.category?.name || "सामान्य"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.title.length > 150
                        ? `${post.title.substring(0, 150)}...`
                        : post.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                          {post.category?.name?.split("-")[0] || "टैग"}
                        </span>
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                          समाचार
                        </span>
                      </div>
                      <Link
                        href={`/${post.category?.slug?.current}/${post.slug?.current}`}
                        className={`${colors.button} font-semibold`}
                      >
                        पढ़ें →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <button className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md">
            ← पिछला
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
            1
          </button>
          <button className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md">
            2
          </button>
          <button className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md">
            3
          </button>
          <button className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md">
            अगला →
          </button>
        </div>
      </div>
    </>
  );
}
