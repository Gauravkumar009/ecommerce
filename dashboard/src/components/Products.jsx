import React, { useState, useEffect, useMemo } from "react";
import { LoaderCircle, Plus, Eye, Edit3, Trash2, RefreshCw, Search, Star, Package } from "lucide-react";
import CreateProductModal from "../modals/CreateProductModal";
import UpdateProductModal from "../modals/UpdateProductModal";
import ViewProductModal from "../modals/ViewProductModal";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import {
  toggleCreateProductModal,
  toggleUpdateProductModal,
  toggleViewProductModal,
} from "../store/slices/extraSlice";
import { fetchAllProducts, deleteProduct } from "../store/slices/productsSlice";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, totalProducts } = useSelector((state) => state.product);
  const {
    isCreateProductModalOpened,
    isUpdateProductModalOpened,
    isViewProductModalOpened,
  } = useSelector((state) => state.extra);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleView = (prod) => {
    setSelectedProduct(prod);
    dispatch(toggleViewProductModal());
  };

  const handleEdit = (prod) => {
    setSelectedProduct(prod);
    dispatch(toggleUpdateProductModal());
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const categories = useMemo(
    () => ["All", ...new Set((products || []).map((product) => product.category).filter(Boolean))],
    [products]
  );
  const visibleProducts = useMemo(() => (products || []).filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const searchable = `${product.name || ""} ${product.category || ""} ${product.id || ""}`.toLowerCase();
    return matchesCategory && searchable.includes(search.trim().toLowerCase());
  }), [products, category, search]);

  return (
    <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-[#f7f8fc]">
      <Header />
      <div className="max-w-[1440px] w-full mx-auto p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div>
            <h2 className="text-[26px] font-bold tracking-tight text-slate-800">Products</h2>
            <p className="text-sm text-slate-500">{totalProducts || products?.length || 0} products in catalogue</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => dispatch(fetchAllProducts())} disabled={loading} className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm disabled:opacity-60"><RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
            <button onClick={() => dispatch(toggleCreateProductModal())} className="flex items-center gap-2 bg-[#2d68e8] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm"><Plus className="w-4 h-4" /> Add Product</button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <label className="relative block w-full max-w-md"><Search className="pointer-events-none absolute left-4 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by product name..." className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label>
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="sm:w-40 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 outline-none focus:border-blue-400">
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoaderCircle className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] font-bold tracking-wide text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleProducts.length > 0 ? (
                    visibleProducts.map((prod) => {
                      const image =
                        Array.isArray(prod.images) && prod.images.length > 0
                          ? prod.images[0]?.url || prod.images[0]
                          : typeof prod.images === "string"
                          ? prod.images
                          : null;

                      return (
                        <tr key={prod.id} className="hover:bg-gray-50/80">
                          <td className="px-6 py-4 flex items-center gap-3">
                            {image ? (
                              <img
                                src={image}
                                alt={prod.name}
                                className="w-12 h-12 rounded-lg object-cover border"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400"><Package className="w-5 h-5" /></div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-800">
                                {prod.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                ID: {prod.id}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">{prod.category}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            ₹{Number(prod.price || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                prod.stock > 5
                                  ? "bg-emerald-50 text-emerald-600"
                                  : prod.stock > 0
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-rose-50 text-rose-600"
                              }`}
                            >
                              {prod.stock > 0 ? `In Stock (${prod.stock})` : "Out of stock"}
                            </span>
                          </td>
                          <td className="px-6 py-4"><span className="inline-flex items-center gap-1 font-bold text-amber-600"><Star className="w-4 h-4 fill-amber-400 text-amber-400" />{Number(prod.ratings || 0).toFixed(1)}</span></td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => handleView(prod)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEdit(prod)}
                                className="p-2 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg transition"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(prod.id)}
                                className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-gray-400"
                      >
                        No products found. Click "Add Product" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3 text-sm text-slate-500">Showing {visibleProducts.length} of {products?.length || 0} products</div>
          </div>
        )}
      </div>

      {isCreateProductModalOpened && <CreateProductModal />}
      {isUpdateProductModalOpened && (
        <UpdateProductModal selectedProduct={selectedProduct} />
      )}
      {isViewProductModalOpened && (
        <ViewProductModal selectedProduct={selectedProduct} />
      )}
    </div>
  );
};

export default Products;
