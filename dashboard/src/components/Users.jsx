import React, { useEffect } from "react";
import avatarDefault from "../assets/avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { getAllUsers, deleteUser } from "../store/slices/adminSlice";
import { LoaderCircle, Trash2, ShieldCheck, User as UserIcon } from "lucide-react";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, totalUsers } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Users</h2>
            <p className="text-sm text-gray-500">
              Registered customers ({totalUsers || users.length || 0})
            </p>
          </div>
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
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users && users.length > 0 ? (
                    users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/80">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={u.avatar?.url || avatarDefault}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              u.role === "Admin"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {u.role === "Admin" ? (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            ) : (
                              <UserIcon className="w-3.5 h-3.5" />
                            )}
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {u.role !== "Admin" ? (
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 italic">Protected</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-400">
                        No registered users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
