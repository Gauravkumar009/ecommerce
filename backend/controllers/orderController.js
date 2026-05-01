import ErrorHandler from "../middlewares/errorMiddleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import database from "../database/db.js";
import { generatePaymentIntent } from "../utils/generatePaymentIntent.js";

export const placeNewOrder = catchAsyncError(async (req, res, next) => {
    const {
        full_name,
        state,
        city,
        country,
        address,
        pincode,
        phone,
        ordereditems
    } = req.body;

    if (!full_name || !state || !city || !country || !address || !pincode || !phone) {
        return next(new ErrorHandler("Please provide all complete shipping details.", 400));
    }

    const item = Array.isArray(orderedItems) ? orderedItems : JSON.stringify(orderedItems);

    if (!item || item.length === 0) {
        return next(new ErrorHandler("No items in the cart.", 400));
    }

    const productIds = items.map((item) => item.product.id);
    const { rows: products } = await database.query(`SELECT id, price FROM products WHERE id = ANY($1::uuid[])`, [productIds]);

    let total_price = 0;
    const values = [];
    const placeholders = [];

    items.forEach((item, index) => {
        const product = products.find(p => p.id === item.product.id);

        if (!product) {
            new ErrorHandler(`Product not found for ID: ${item.product.id}`, 404);
        }

        if (item.quantity > product.stock) {
            return next(new ErrorHandler(`Only ${product.stock} units available for ${product.name}`, 400));
        }

        const itemTotal = product.price * item.quantity;
        total_price += itemTotal;

        values.push(
            null,
            product.id,
            item.quantity,
            product.price,
            item.product.images[0].url || " ",
            product.name
        );

        const offset = index * 6;
        placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`);
    })

    const tax_price = 0.008;
    const shipping_price = 2;
    total_price = Math.round(
        total_price + total_price * tax_price + shipping_price
    );

    const orderResult = await database.query(`INSERT INTO orders (buyer_id, total_price,tax_price, shipping_price) VALUES ($1,$2,$3,$4) RETURNING *`,
        [req.user.id, total_price, tax_price, shipping_price]
    );

    const orderId =  orderResult.rows[0].id;

    for(let i = 0; i < values.length; i += 6){
        values[i] = orderId;
    }

    await database.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price, image, title) VALUES ${placeholders.join(", ")} RETURNING *    
        `, values
    );

    await database.query(`
        INSERT INTO shipping_details (order_id, full_name, state, city, country, address, pincode, phone) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
        `, [orderId, full_name, state, city, country, address, pincode, phone]      
        );
});

