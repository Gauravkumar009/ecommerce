import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { addToCart, updateQuantity, removeFromCart } from "../../store/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { getImageUrl, handleImageError, getReviewCount } from "../../utils/imageHelper";

const ProductSlider = ({ title, products }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart || { cart: [] });

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleIncrement = (product, currentQty, e) => {
    e.preventDefault();
    e.stopPropagation();
    const prodId = product.id || product._id;
    if (product.stock > 0 && currentQty >= product.stock) return;
    dispatch(updateQuantity({ id: prodId, quantity: currentQty + 1 }));
  };

  const handleDecrement = (product, currentQty, e) => {
    e.preventDefault();
    e.stopPropagation();
    const prodId = product.id || product._id;
    if (currentQty <= 1) {
      dispatch(removeFromCart(prodId));
    } else {
      dispatch(updateQuantity({ id: prodId, quantity: currentQty - 1 }));
    }
  };

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 glass-card hover:glow-on-hover animate-smooth"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 glass-card hover:glow-on-hover animate-smooth"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-6 h-6 text-primary" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
      >
        {products && products.map((product) => {
          const createdAtDate = product.created_at || product.createdAt;
          const isNew = createdAtDate
            ? (new Date() - new Date(createdAtDate)) < 30 * 24 * 60 * 60 * 1000
            : false;
          const imageUrl = getImageUrl(product);
          const ratingVal = Number(product.ratings ?? product.rating) || 0;
          const reviewCount = getReviewCount(product, ratingVal);

          const isNewSection = title && title.toLowerCase().includes("new");
          const isTopRatedSection = title && (title.toLowerCase().includes("top rated") || title.toLowerCase().includes("rating"));

          // Check if item is in cart
          const cartItem = (cart || []).find(
            (item) => (item.product?.id || item.product?._id) === product.id
          );
          const cartQuantity = cartItem ? cartItem.quantity : 0;

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="flex-shrink-0 w-80 glass-card hover:glow-on-hover animate-smooth group"
            >
              {/* PRODUCT IMAGE */}
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={imageUrl}
                  alt={product.name || "Product"}
                  onError={handleImageError}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* CART BUTTON / QUANTITY CONTROLLER (- count +) */}
                {cartQuantity > 0 ? (
                  <div
                    className="absolute bottom-3 right-3 flex items-center bg-primary text-primary-foreground rounded-full px-2 py-1 shadow-lg z-10 animate-smooth"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <button
                      onClick={(e) => handleDecrement(product, cartQuantity, e)}
                      className="p-1 hover:bg-black/20 dark:hover:bg-white/20 rounded-full transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-2 text-sm font-bold min-w-[20px] text-center select-none">
                      {cartQuantity}
                    </span>
                    <button
                      onClick={(e) => handleIncrement(product, cartQuantity, e)}
                      className="p-1 hover:bg-black/20 dark:hover:bg-white/20 rounded-full transition-colors"
                      disabled={product.stock > 0 && cartQuantity >= product.stock}
                      title="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="absolute bottom-3 right-3 p-2 glass-card hover:glow-on-hover animate-smooth opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={product.stock === 0}
                    title="Add to cart"
                  >
                    <ShoppingCart className="w-5 h-5 text-primary" />
                  </button>
                )}
              </div>

              {/* PRODUCT INFO */}
              <div>
                {/* PRODUCT TITLE */}
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors truncate">
                  {product.name}
                </h3>

                {/* PRODUCT RATINGS */}
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                      const filled = ratingVal >= i + 1;
                      const half = !filled && ratingVal >= i + 0.5;
                      return (
                        <span key={i} className="relative w-4 h-4 inline-block">
                          {/* Background empty star */}
                          <Star className="w-4 h-4 text-gray-300 absolute inset-0" />
                          {/* Filled or half-filled overlay */}
                          {(filled || half) && (
                            <span
                              className="absolute top-0 left-0 overflow-hidden"
                              style={{ width: filled ? "100%" : "50%", height: "100%" }}
                            >
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <span className="text-sm font-bold text-yellow-500">
                    {ratingVal.toFixed(1)}
                  </span>
                </div>

                {/* PRODUCT PRICE */}
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl font-bold text-primary">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>

                {/* PRODUCT AVAILABILITY */}
                <div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      product.stock > 5
                        ? "bg-green-500/20 text-green-400"
                        : product.stock > 0
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {product.stock > 5
                      ? "In Stock"
                      : product.stock > 0
                      ? "Limited Stock"
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ProductSlider;
