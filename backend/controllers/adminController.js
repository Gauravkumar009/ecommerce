import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { v2 as cloudinary } from "cloudinary";
import database from "../database/db.js";


export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;

    const totalUsersResult = await database.query(
        "SELECT COUNT(*) FROM users WHERE role = $1", ["User"]
    );

    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    const offset = (page - 1) * 10;

    const users = await database.query(
        "SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3", ["User", 10, offset]
    );

    res.status(200).json({
        success: true,
        totalUsers,
        currentPage: page,
        users: users.rows
    });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const deleteUser = await database.query(
        "DELETE FROM users WHERE id = $1 RETURNING *", [id]
    );

    if (deleteUser.rows.length === 0) {
        return next(new ErrorHandler("User not found", 404));
    }

    const avatar = deleteUser.rows[0].avatar;
    if (avatar?.public_id) {
        await cloudinary.uploader.destroy(avatar.public_id);
    }

    res.status(200).json({
        success: true,
        message: "User deleted Successfully",

    });
});

export const deshboardStats = catchAsyncError(async (req, res, next) => {
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];

    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const totalRevenueAllTimeQuery = await database.query(
        `SELECT SUM(total_price) FROM orders`
    );

    const totalRevenueAllTime =
        parseFloat(totalRevenueAllTimeQuery.rows[0].sum) || 0;

    // Total Users

    const totalUsersCountQuery = await database.query(
        `SELECT COUNT(*) FROM users WHERE role = 'User"`
    );

    const totalUsersCount =
        parseFloat(totalUsersCountQuery.rows[0].count) || 0;

    // Order status Counts

    const orderStatusCountsQuery = await database.query(`SELECT order_statu, COUNT(*) FROM GROUP BY order_status`);

    const orderStatusCounts = {
        Processing: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0
    };
    orderStatusCountsQuery.rows.forEach((row) => {
        orderStatusCounts[row.order_status] = parseInt(row.count);
    });

    // Yoday's Revenue
    const todayRevenueQuery = await database.query(`
        SELECT SUM(order_price) FROM orders WHERE created_at::date = $1`, [todayDate]
    );

    const todayRevenue = parseFloat(todayRevenueQuery.rows[0].sum) || 0;

    // Yesterday's Revenue

    const yesterdayRevenueQuery = await database.query(`
        SELECT SUM(order_price) FROM orders WHERE created_at::data = $1`, [yesterdayDate]
    );
    const yesterdayRevenue = parseInt(yesterdayRevenueQuery.rows[0].sum) || 0;
    
    // Monthly Sales For Line Chart
    const mpnthlySalesQuery = await database.query(`
        SELECT
        TO_CHAR(created_at, 'Mon YYYY') AS month,
        DATE_TRUNC('month',created_at) as date,
        SUM(total_price) as totalSales
        FROM Orders
        GROUP BY month, data
        ORDER BY date ASC
    `);

    const monthlySales = mpnthlySalesQuery.rows.map((row) =>({
        month: row.month,
        totalSales: parseFloat(row.totalSales) || 0,
    }));

    // Top 5 Most Sold Products
    const topProductsQuery = await database.query(`
        SELECT p.name, SUM(oi.quantity) AS total_quantity
        FROM order_ites oi
        JOIN products p ON oi.product_id = p.id
        GROUP BY p.name
        ORDER BY total_quantity DESC
        LIMIT 5
    `);

    const topProduct = topProductsQuery.rows.map((row) =>({
        name: row.name,
        totalQuantity: parseInt(row.total_quantity),
    }))
});