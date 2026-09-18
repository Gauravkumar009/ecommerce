import React from "react";
import { useSelector } from "react-redux";
import { Star } from "lucide-react";

const TopSellingProducts = () => {
  const { topSellingProducts } = useSelector((state) => state.admin);

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-base font-bold text-gray-800 mb-4">
        Top Selling Products List
      </h3>
      {topSellingProducts && topSellingProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3 rounded-r-lg text-right">Units Sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topSellingProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-medium text-gray-900 flex items-center gap-3">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-md border"
                      />
                    )}
                    <span className="truncate max-w-xs">{p.name}</span>
                  </td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3 flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {p.ratings || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">
                    {p.total_sold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-sm text-center py-6">
          No top selling products recorded yet.
        </p>
      )}
    </div>
  );
};

export default TopSellingProducts;
