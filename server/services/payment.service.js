import stripe from "../config/stripe.js";
import ApiError from "../utils/apiError.js";

export const createCheckoutSession = async ({
  items,
  userId,
  guestId,
  customerName,
  customerEmail,
  customerPhone,
  shippingStreet,
  shippingCity,
  shippingState,
  shippingPostalCode,
  shippingCountry,
  totalAmount,
}) => {
  // Stripe line items
  const line_items = items.map((item) => ({
    price_data: {
      currency: "pkr",
      product_data: {
        name: item.name,
      },
      unit_amount: item.price * 100, // stripe me amount in cents
    },
    quantity: item.quantity,
  }));

  // FRONTEND_URL lets local dev point back to localhost instead of the
  // hardcoded production domain; falls back to CLIENT_URL if not set
  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL;

  // Carried through so the order-confirmation email sent from the webhook
  // can list items (Stripe metadata values are capped at 500 chars, so this
  // is skipped for large carts - the email still sends, just without the
  // itemized list, same as before this was added).
  const itemsJson = JSON.stringify(
    items.map((item) => ({ name: item.name, price: item.price, quantity: item.quantity }))
  );

  // Checkout Session create
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${frontendUrl}/web/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/web/cancel?session_id={CHECKOUT_SESSION_ID}`,

    // metadata bhejna bohot important hai
    metadata: {
      userId: userId || "",
      guestId: userId ? "" : guestId || "",
      customerName,
      customerEmail,
      customerPhone,
      shippingStreet,
      shippingCity,
      shippingState,
      shippingPostalCode,
      shippingCountry,
      totalAmount,
      items: itemsJson.length <= 500 ? itemsJson : "",
    },
  });

  return { id: session.id, url: session.url };
};

export const getCheckoutSession = async ({ sessionId }) => {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer_details", "payment_intent"],
    });
  } catch (error) {
    throw new ApiError(500, "Failed to fetch session");
  }
};
