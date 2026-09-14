import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../../store/slices/cartSlice";
import { toggleCart } from "../../store/slices/popupSlice";
import { getImageUrl, handleImageError } from "../../utils/imageHelper";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { isCartOpen } = useSelector((state) => state.popup || {});
  const { cart } = useSelector((state) => state.cart || { cart: [] });

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateCartQuantity({ id, quantity }));
    }
  };

  let total = 0;
  if (cart) {
    total = cart.reduce(
      (sum, item) => sum + (Number(item.product?.price) || 0) * (item.quantity || 1),
      0
    );
  }

  if (!isCartOpen) return null;

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => dispatch(toggleCart())}
      />

      {/* CART SIDEBAR */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl flex flex-col justify-between animate-slide-in-right">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Shopping Cart</h2>
          </div>
          <button
            onClick={() => dispatch(toggleCart())}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CART CONTENT */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {cart && cart.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/40 mb-4" />
              <p className="text-muted-foreground text-lg font-medium">Your cart is empty.</p>
              <Link
                to={"/products"}
                onClick={() => dispatch(toggleCart())}
                className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all shadow-md"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            cart &&
            cart.map((item) => {
              const productId = item.product?.id || item.product?._id;
              const imgUrl = getImageUrl(item.product);
              const priceVal = Number(item.product?.price) || 0;

              return (
                <div
                  key={productId}
                  className="bg-card/70 border border-border/60 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-3">
                    {/* PRODUCT IMAGE */}
                    <img
                      src={imgUrl}
                      alt={item.product?.name || "Product"}
                      onError={handleImageError}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-secondary"
                    />

                    {/* PRODUCT NAME & PRICE */}
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-semibold text-foreground text-sm line-clamp-2 leading-tight mb-1">
                        {item.product?.name}
                      </h3>
                      <p className="text-primary font-bold text-base">
                        ${priceVal.toFixed(2)}
                      </p>
                    </div>

                    {/* REMOVE BUTTON */}
                    <button
                      className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                      onClick={() => dispatch(removeFromCart(productId))}
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                    <span className="text-xs text-muted-foreground font-medium">Quantity</span>
                    <div className="flex items-center space-x-3 bg-secondary/60 rounded-lg px-2 py-1">
                      <button
                        className="p-1 rounded-md hover:bg-primary/20 hover:text-primary transition-colors text-foreground"
                        onClick={() => updateQuantity(productId, item.quantity - 1)}
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        className="p-1 rounded-md hover:bg-primary/20 hover:text-primary transition-colors text-foreground"
                        onClick={() => updateQuantity(productId, item.quantity + 1)}
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER & TOTAL */}
        {cart && cart.length > 0 && (
          <div className="p-6 border-t border-border bg-background/80 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-semibold text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
            <Link
              to={"/cart"}
              onClick={() => dispatch(toggleCart())}
              className="w-full block text-center bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-all font-bold shadow-lg"
            >
              View Cart & Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
