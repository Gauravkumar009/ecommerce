export const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";

export const getImageUrl = (product) => {
  if (!product) return DEFAULT_PRODUCT_IMAGE;

  let imgs = product.images || product.image;
  if (!imgs) return DEFAULT_PRODUCT_IMAGE;

  // Handle string input (URL or JSON string)
  if (typeof imgs === "string") {
    const trimmed = imgs.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      return trimmed;
    }
    try {
      imgs = JSON.parse(trimmed);
    } catch {
      return DEFAULT_PRODUCT_IMAGE;
    }
  }

  // Handle array input
  if (Array.isArray(imgs) && imgs.length > 0) {
    const first = imgs[0];
    if (typeof first === "string") return first;
    if (first?.url) return first.url;
    if (first?.secure_url) return first.secure_url;
  }

  // Handle single object input
  if (typeof imgs === "object") {
    if (imgs?.url) return imgs.url;
    if (imgs?.secure_url) return imgs.secure_url;
  }

  return DEFAULT_PRODUCT_IMAGE;
};

export const handleImageError = (e, fallback = DEFAULT_PRODUCT_IMAGE) => {
  if (e?.target) {
    e.target.onerror = null; // Prevent infinite loop if fallback image fails
    e.target.src = fallback;
  }
};

export const getReviewCount = (product, ratingVal) => {
  if (!product) return 0;
  const count = Number(product.review_count ?? product.num_reviews ?? product.reviews_count ?? product.reviewCount);
  if (!isNaN(count) && count > 0) return count;

  if (ratingVal > 0) {
    const str = String(product.id || product._id || product.name || "");
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return (Math.abs(hash) % 48) + 12;
  }
  return 0;
};
