import React, { useEffect, useMemo, useState } from "react";
import avatarDefault from "../assets/avatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { getAllUsers, deleteUser } from "../store/slices/adminSlice";
import { LoaderCircle, Trash2, ShieldCheck, User as UserIcon, RefreshCw, Search, Eye, Mail, CalendarDays, X } from "lucide-react";

const Users = () => {
  const dispatch = useDispatch();
  const { users, loading, totalUsers } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const visibleUsers = useMemo(() => (users || []).filter((user) =>
    `${user.name || ""} ${user.email || ""}`.toLowerCase().includes(search.trim().toLowerCase())
  ), [users, search]);

  return (
    <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-[#f7f8fc]">
      <Header />
      <div className="max-w-[1440px] w-full mx-auto p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
          <div>
            <h2 className="text-[26px] font-bold tracking-tight text-slate-800">Users</h2>
            <p className="text-sm text-slate-500">{totalUsers || users.length || 0} registered users in total</p>
          </div>
          <button onClick={() => dispatch(getAllUsers())} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh</button>
        </div>

        <label className="relative block w-full max-w-md"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email..." className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoaderCircle className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wide text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined On</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleUsers.length > 0 ? (
                    visibleUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={u.avatar?.url || avatarDefault}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">{u.name || "Unnamed user"}</p>
                            <p className="truncate text-xs text-slate-400">{String(u.id || "").slice(0, 10)}...</p>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 text-slate-600"><Mail className="h-4 w-4 text-slate-400" />{u.email || "—"}</span></td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              u.role === "Admin"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-blue-100 text-blue-700"
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
                        <td className="px-6 py-4 text-slate-500">
                          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-slate-400" />{u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => setSelectedUser(u)} className="mr-2 rounded-lg border border-blue-100 bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100" title="View user"><Eye className="h-4 w-4" /></button>
                          {u.role !== "Admin" ? (
                            <button
                              onClick={() => handleDelete(u.id)}
                              className="rounded-lg border border-rose-100 bg-rose-50 p-2 text-rose-500 transition hover:bg-rose-100"
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
                      <td colSpan={5} className="text-center py-12 text-gray-400">
                        No users match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3 text-sm text-slate-500">Showing {visibleUsers.length} of {users?.length || 0} users</div>
          </div>
        )}
      </div>
      {selectedUser && <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
};

const UserProfileModal = ({ user, onClose }) => {
  const joinedOn = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : "Not available";
  const isAdmin = user.role === "Admin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="user-profile-title" onMouseDown={onClose}>
      <div className="relative w-full max-w-[385px] rounded-2xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 id="user-profile-title" className="text-base font-bold text-slate-800">User Profile</h3>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Close user profile"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-6 flex flex-col items-center text-center">
          <img src={user.avatar?.url || avatarDefault} alt={user.name || "User"} className="h-20 w-20 rounded-full border-2 border-blue-100 object-cover shadow-sm" />
          <h4 className="mt-3 text-lg font-bold text-slate-800">{user.name || "Unnamed user"}</h4>
          <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
            {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" />}{user.role || "User"}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <ProfileDetail icon={Mail} label="Email" value={user.email || "Not available"} />
          <ProfileDetail icon={CalendarDays} label="Joined On" value={joinedOn} />
          <ProfileDetail icon={UserIcon} label="User ID" value={user.id || "Not available"} mono />
        </div>

        <button onClick={onClose} className="mt-5 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Close</button>
      </div>
    </div>
  );
};

const ProfileDetail = ({ icon: Icon, label, value, mono = false }) => (
  <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3.5">
    <Icon className="h-5 w-5 shrink-0 text-blue-500" />
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-0.5 truncate text-sm font-semibold text-slate-700 ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
    </div>
  </div>
);

export default Users;
