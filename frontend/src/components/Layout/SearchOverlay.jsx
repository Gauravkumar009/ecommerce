import { useState } from "react";
import { X, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SearchOverlay = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSearchBarOpen } = useSelector((state) => state.popup);

  if (!isSearchBarOpen) return null;

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      dispatch(toggleSearchBar());
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <div className="fixed inest-0 z-50">
        {/* GLASS BACKGROUND */}
        <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]">
          {/* SEARCH CONTAINER */}
          <div className="relative z-10 animate-slide-in-top">
            <div className="glass-panel m-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary">
                  Search Products
                </h2>
                <button
                  onClick={() => dispatch(toggleSearchBar())}
                  className="p-2 rounded-lg glass-card hover:glass-on-hover animate-smooth"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchOverlay;
