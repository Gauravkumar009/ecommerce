import React, { useState, useEffect } from "react";
import { LoaderCircle, Plus, Eye, Edit, Trash2 } from "lucide-react";
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
  const { products, loading } = useSelector((state) => state.product);
  const {
    isCreateProductModalOpened,
    isUpdateProductModalOpened,
    isViewProductModalOpened,
  } = useSelector((state) => state.extra);

  const [selectedProduct, setSelectedProduct] = useState(null);

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

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Products</h2>
            <p className="text-sm text-gray-500">Manage store inventory</p>
          </div>
          <button
            onClick={() => dispatch(toggleCreateProductModal())}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoaderCircle className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products && products.length > 0 ? (
                    products.map((prod) => {
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
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                                No img
                              </div>
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
                              {prod.stock > 0 ? `${prod.stock} in stock` : "Out of stock"}
                            </span>
                          </td>
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
                                className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                title="Edit Product"
                              >
                                <Edit className="w-4 h-4" />
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
                        colSpan={5}
                        className="text-center py-12 text-gray-400"
                      >
                        No products found. Click "Add Product" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
