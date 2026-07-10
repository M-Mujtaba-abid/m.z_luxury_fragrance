import User from "./user.model.js";
import Order from "./order.model.js";
import OrderItem from "./orderItem.model.js";
import Product from "./product.model.js";

// relations
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

OrderItem.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(OrderItem, { foreignKey: "productId" });

export { User, Order, OrderItem, Product };
