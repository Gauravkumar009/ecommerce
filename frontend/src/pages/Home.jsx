import React, { useEffect } from "react";
import HeroSlider from "../components/Home/HeroSlider";
import CategoryGrid from "../components/Home/CategoryGrid";
import ProductSlider from "../components/Home/ProductSlider";
import FeatureSection from "../components/Home/FeatureSection";
import NewsletterSection from "../components/Home/NewsletterSection";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedProducts } from "../store/slices/productSlice";

const Index = () => {
  const dispatch = useDispatch();
  const { topRatedProducts, newProducts, products, featuredLoading } = useSelector(
    (state) => state.product || {}
  );

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const displayNewProducts =
    newProducts && newProducts.length > 0
      ? newProducts
      : (products || []).slice(0, 50);

  const fallbackTopRatedProducts = (products || [])
    .filter((product) => {
      const rating = Math.max(Number(product.ratings ?? product.rating) || 0, Number(product.rating ?? product.ratings) || 0);
      return rating >= 4;
    })
    .sort((a, b) => {
      const ratingA = Math.max(Number(a.ratings ?? a.rating) || 0, Number(a.rating ?? a.ratings) || 0);
      const ratingB = Math.max(Number(b.ratings ?? b.rating) || 0, Number(b.rating ?? b.ratings) || 0);
      return ratingB - ratingA;
    });

  const displayTopRatedProducts = (topRatedProducts && topRatedProducts.length > 0)
    ? topRatedProducts
    : fallbackTopRatedProducts;

  return (
    <div className="min-h-screen">
      <HeroSlider />
      <div className="container mx-auto px-4 pt-20">
        <CategoryGrid />
        <ProductSlider
          title="New Arrivals"
          products={displayNewProducts}
          emptyMessage={featuredLoading ? "Loading new arrivals..." : "No new arrivals yet."}
        />
        <ProductSlider
          title="Top Rated Products"
          products={displayTopRatedProducts}
          emptyMessage={featuredLoading ? "Loading top-rated products..." : "No rated products yet."}
        />
        <FeatureSection />
        <NewsletterSection />
      </div>
    </div>
  );
};

export default Index;
