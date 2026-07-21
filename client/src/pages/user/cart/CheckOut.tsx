
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "../../../redux/store";
import { CreditCard, MapPin, User } from "lucide-react";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import { useCreateOrderMutation } from "../../../queries/orderQueries";
import { useCreateCheckoutSessionMutation } from "../../../queries/paymentQueries";
import { useCart } from "../../../hooks/useCart";

const CheckOut = () => {
  const navigate = useNavigate();

  // Cart and user state
  const { cartItems } = useCart();
  const { user, token } = useSelector((state: RootState) => state.user);

  // Mutations
  const createOrderMutation = useCreateOrderMutation();
  const checkoutSessionMutation = useCreateCheckoutSessionMutation();

  const loading = createOrderMutation.isPending || checkoutSessionMutation.isPending;
  const error =
    createOrderMutation.error?.message ?? checkoutSessionMutation.error?.message ?? null;

  // Non-logged-in users see a Guest/Login choice first; logged-in users skip straight to the form
  const [guestCheckoutStarted, setGuestCheckoutStarted] = useState(false);
  const showChoiceScreen = !token && !guestCheckoutStarted;

  const [formData, setFormData] = useState({
    customerName: `${user?.firstName || ""} ${user?.lastName || ""}`,
    customerEmail: user?.email || "",
    customerPhone: user?.phoneNumber || "",
    shippingStreet: "",
    shippingCity: "",
    shippingState: "",
    shippingPostalCode: "",
    shippingCountry: "Pakistan",
    paymentMethod: "COD",
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/web/cart");
    }
  }, [cartItems, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () =>
    cartItems.reduce((total: number, item: any) => total + item.totalPrice, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.paymentMethod === "COD") {
      // Normal COD order flow
      try {
        const result = await createOrderMutation.mutateAsync({ ...formData, cartItems });
        const orderId = result?.data?.id;
        navigate("/web/thankyou", {
          state: { orderId, email: formData.customerEmail },
        });
      } catch (err) {
        console.error("Failed to create order:", err);
      }
    }
    // Stripe disabled - Stripe doesn't support Pakistan, COD is the only
    // checkout method for now. To re-enable: uncomment this block, restore
    // the "Credit Card" <option> below, and the backend route mounts in
    // server/app.js.
    // else if (formData.paymentMethod === "CreditCard") {
    //   // Stripe Payment Flow
    //   try {
    //     const data = await checkoutSessionMutation.mutateAsync({
    //       items: cartItems.map((item: any) => ({
    //         name: item.Product?.title,
    //         price: item.totalPrice / item.quantity,
    //         quantity: item.quantity,
    //       })),
    //       customerName: formData.customerName,
    //       customerEmail: formData.customerEmail,
    //       customerPhone: formData.customerPhone,
    //       shippingStreet: formData.shippingStreet,
    //       shippingCity: formData.shippingCity,
    //       shippingState: formData.shippingState,
    //       shippingPostalCode: formData.shippingPostalCode,
    //       shippingCountry: formData.shippingCountry,
    //       totalAmount: cartItems.reduce(
    //         (sum: number, item: any) => sum + item.totalPrice,
    //         0
    //       ),
    //     });
    //     if (data?.url) {
    //       window.location.href = data.url; // Redirect to Stripe checkout page
    //     }
    //   } catch (err) {
    //     console.error("Failed to create checkout session:", err);
    //   }
    // }
    else {
      alert("Other payment methods not yet implemented.");
    }
  };

  if (cartItems.length === 0) return null;

  if (showChoiceScreen) {
    return (
      <div className="min-h-screen pt-[80px] bg-luxury-ink py-12 flex items-center justify-center px-4">
        <div className="bg-luxury-card border border-luxury-gold/10 rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h1 className="font-logo text-2xl font-bold text-luxury-cream mb-2">
            Checkout
          </h1>
          <p className="text-luxury-cream/70 mb-6">
            How would you like to continue?
          </p>

          <button
            onClick={() => setGuestCheckoutStarted(true)}
            className="w-full bg-luxury-gold text-luxury-ink py-3 rounded-lg hover:bg-luxury-gold-bright transition-colors duration-300 font-semibold mb-4"
          >
            Continue as Guest
          </button>

          <Link
            to="/login"
            className="text-sm text-luxury-cream/70 hover:text-luxury-gold-bright transition-colors duration-300"
          >
            Already have an account? Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[80px] bg-luxury-ink py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Breadcrumb
          items={[
            { label: "Home", path: "/web" },
            { label: "Cart", path: "/web/cart" },
            { label: "Checkout" },
          ]}
        />
        <h1 className="font-logo text-3xl font-bold text-luxury-cream mb-8">
          Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-luxury-card border border-luxury-gold/10 rounded-lg shadow-md p-6">
              <h2 className="font-logo text-xl font-semibold text-luxury-cream mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-luxury-gold" /> Personal Information
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="customerName"
                  placeholder="Full Name"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
                />
                <input
                  type="email"
                  name="customerEmail"
                  placeholder="Email"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
                />
                <input
                  type="tel"
                  name="customerPhone"
                  placeholder="Phone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-luxury-card border border-luxury-gold/10 rounded-lg shadow-md p-6">
              <h2 className="font-logo text-xl font-semibold text-luxury-cream mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-luxury-gold" /> Shipping Address
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="shippingStreet"
                  placeholder="Street Address"
                  value={formData.shippingStreet}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="shippingCity"
                    placeholder="City"
                    value={formData.shippingCity}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
                  />
                  <input
                    type="text"
                    name="shippingState"
                    placeholder="State"
                    value={formData.shippingState}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
                  />
                </div>
                <input
                  type="text"
                  name="shippingPostalCode"
                  placeholder="Postal Code"
                  value={formData.shippingPostalCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
                />
                <input
                  type="text"
                  name="shippingCountry"
                  placeholder="Country"
                  value={formData.shippingCountry}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 placeholder:text-luxury-cream/40 focus:border-luxury-gold-bright/60"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-luxury-card border border-luxury-gold/10 rounded-lg shadow-md p-6">
              <h2 className="font-logo text-xl font-semibold text-luxury-cream mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-luxury-gold" /> Payment Method
              </h2>
              {/* Stripe disabled - Stripe doesn't support Pakistan. COD is the
                  only method for now; re-add the CreditCard <option> below
                  (and the handleSubmit branch above) to re-enable. */}
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-luxury-gold/20 bg-luxury-ink text-luxury-cream outline-none transition-colors duration-300 focus:border-luxury-gold-bright/60"
              >
                <option value="COD">Cash on Delivery</option>
                {/* <option value="CreditCard">Credit Card</option> */}
              </select>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-luxury-card border border-luxury-gold/10 rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="font-logo text-xl font-semibold text-luxury-cream mb-4">Order Summary</h2>

              {cartItems.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-3 mb-3">
                  <img
                    src={item.Product?.productImage}
                    alt={item.Product?.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-luxury-cream">{item.Product?.title}</h3>
                    <p className="text-sm text-luxury-cream/60">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-luxury-gold">Rs. {item.totalPrice}</span>
                </div>
              ))}

              <hr className="my-4 border-luxury-gold/15" />

              <div className="flex justify-between text-luxury-cream font-bold text-lg mb-4">
                <span>Total:</span>
                <span className="text-luxury-gold">Rs. {calculateTotal()}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-luxury-gold text-luxury-ink py-3 rounded-lg font-semibold transition-colors duration-300 hover:bg-luxury-gold-bright disabled:opacity-50"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>

              {error && (
                <p className="text-red-400 mt-3 text-sm">⚠ {error}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckOut;
