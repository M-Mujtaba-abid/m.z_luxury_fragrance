// // src/components/Admin/OrderSlip.tsx
// import React, { useRef } from "react";

// interface OrderItem {
//   id: number;
//   productName: string;
//   quantity: number;
//   priceAtPurchase: number;
//   subtotal: number;
//   Product: {
//     id: number;
//     title: string;
//     productImage: string;
//     price: number;
//   };
// }

// interface Order {
//   customerName: string;
//   customerEmail: string;
//   customerPhone?: string;
//   shippingStreet: string;
//   shippingCity: string;
//   shippingState?: string;
//   shippingPostalCode?: string;
//   shippingCountry: string;
//   totalAmount: number;
//   paymentMethod: string;
//   status: string;
//   createdAt: string;
//   OrderItems: OrderItem[];
// }

// interface Props {
//   order: Order;
// }

// const OrderSlip: React.FC<Props> = ({ order }) => {
//   const printRef = useRef<HTMLDivElement>(null);

//   const handlePrint = () => {
//     if (printRef.current) {
//       const printContents = printRef.current.innerHTML;
//       const originalContents = document.body.innerHTML;

//       document.body.innerHTML = printContents;
//       window.print();
//       document.body.innerHTML = originalContents;
//       window.location.reload(); // reload to restore React app
//     }
//   };

//   return (
//     <div>
//       <button
//         onClick={handlePrint}
//         className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//       >
//         Print / Download Slip
//       </button>

//       <div ref={printRef} className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
//         <h1 className="text-2xl font-bold mb-4 text-center">Order Slip</h1>

//         <section className="mb-4">
//           <h2 className="font-semibold text-lg mb-2">Customer Info</h2>
//           <p>Name: {order.customerName}</p>
//           <p>Email: {order.customerEmail}</p>
//           <p>Phone: {order.customerPhone || "N/A"}</p>
//         </section>

//         <section className="mb-4">
//           <h2 className="font-semibold text-lg mb-2">Shipping Address</h2>
//           <p>
//             {order.shippingStreet}, {order.shippingCity}, {order.shippingState || ""},{" "}
//             {order.shippingPostalCode || ""}, {order.shippingCountry}
//           </p>
//         </section>

//         <section className="mb-4">
//           <h2 className="font-semibold text-lg mb-2">Order Items</h2>
//           <table className="w-full border border-gray-300">
//             <thead className="bg-gray-100 dark:bg-gray-800">
//               <tr>
//                 <th className="border px-2 py-1 text-left">#</th>
//                 <th className="border px-2 py-1 text-left">Product</th>
//                 <th className="border px-2 py-1 text-left">Qty</th>
//                 <th className="border px-2 py-1 text-left">Price</th>
//                 <th className="border px-2 py-1 text-left">Subtotal</th>
//               </tr>
//             </thead>
//             <tbody>
//               {order.OrderItems.map((item, index) => (
//                 <tr key={item.id}>
//                   <td className="border px-2 py-1">{index + 1}</td>
//                   <td className="border px-2 py-1">{item.productName}</td>
//                   <td className="border px-2 py-1">{item.quantity}</td>
//                   <td className="border px-2 py-1">${item.priceAtPurchase}</td>
//                   <td className="border px-2 py-1">${item.subtotal}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         <section className="mb-4 text-right">
//           <p className="font-semibold text-lg">Total Amount: ${order.totalAmount}</p>
//           <p>Payment Method: {order.paymentMethod}</p>
//           <p>Status: {order.status}</p>
//           <p>Order Date: {new Date(order.createdAt).toLocaleString()}</p>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default OrderSlip;



// src/components/Admin/OrderSlip.tsx
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React from "react";

interface OrderItem {
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
}

interface Order {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState?: string;
  shippingPostalCode?: string;
  shippingCountry: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  OrderItems: OrderItem[];
}

interface Props {
  order: Order;
}

const OrderSlip: React.FC<Props> = ({ order }) => {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text("Order Slip", 105, 15, { align: "center" });

    // Customer Info
    doc.setFontSize(12);
    doc.text(`Customer Name: ${order.customerName}`, 14, 30);
    doc.text(`Email: ${order.customerEmail}`, 14, 37);
    doc.text(`Phone: ${order.customerPhone || "N/A"}`, 14, 44);

    // Shipping Address
    const address = `${order.shippingStreet}, ${order.shippingCity}, ${order.shippingState || ""}, ${order.shippingPostalCode || ""}, ${order.shippingCountry}`;
    doc.text(`Shipping Address: ${address}`, 14, 51);

    // Order Meta
    doc.text(`Payment Method: ${order.paymentMethod}`, 14, 58);
    doc.text(`Status: ${order.status}`, 14, 65);
    doc.text(`Order Date: ${new Date(order.createdAt).toLocaleString()}`, 14, 72);

    // Table Data
    const tableColumn = ["#", "Product", "Qty", "Price", "Subtotal"];
    const tableRows: any[] = [];

    order.OrderItems.forEach((item, index) => {
      const row = [
        index + 1,
        // item.productName,
        item.quantity,
        `Rs.${item.priceAtPurchase}`,
        `Rs.${item.subtotal}`,
      ];
      tableRows.push(row);
    });

    autoTable(doc, {
      startY: 80,
      head: [tableColumn],
      body: tableRows,
    });

    // Total Amount at bottom
    const finalY = (doc as any).lastAutoTable.finalY || 0;
    doc.text(`Total Amount: Rs.${order.totalAmount}`, 14, finalY + 10);

    // Save PDF
    doc.save(`Order_${order.customerName}_${order.createdAt}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Download Order PDF
    </button>
  );
};

export default OrderSlip;
