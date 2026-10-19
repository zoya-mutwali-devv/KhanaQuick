import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Printer,
  ArrowLeft,
  UtensilsCrossed,
  ReceiptText,
  CheckCircle2,
} from "lucide-react";
import api from "../../api/axios";

export default function Bill() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/orders/${id}/bill`)
      .then(({ data }) => setBill(data))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load bill")
      );
  }, [id]);

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 bg-white rounded-2xl border border-red-100 p-8 text-center shadow-sm">
        <p className="text-red-500 font-medium">{error}</p>
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 mt-5 text-orange-600 font-semibold hover:text-orange-700"
        >
          <ArrowLeft size={17} /> Back to Orders
        </Link>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="max-w-md mx-auto mt-8 bg-white rounded-2xl border border-orange-100 p-10 text-center shadow-sm">
        <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading your bill...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-2 pb-8">
      {/* Top actions */}
      <div className="flex items-center justify-between mb-5 print:hidden">
        <Link
          to="/orders"
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium text-sm transition-colors"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-orange-100 shadow-sm">
            <ArrowLeft size={17} />
          </span>
          Back to Orders
        </Link>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-orange-200 hover:shadow-lg transition-all duration-200"
        >
          <Printer size={17} />
          Print Bill
        </button>
      </div>

      {/* Bill card */}
      <div className="bg-white rounded-2xl shadow-md shadow-orange-100/60 border border-orange-100 overflow-hidden print:shadow-none print:border-0 print:rounded-none">
        {/* Brand header */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-6 py-7 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/10" />

          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-orange-600 shadow-md mb-3">
              <UtensilsCrossed size={28} />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight">
              KhanaQuick
            </h1>

            <p className="text-orange-100 text-sm mt-1">
              College Canteen Bill
            </p>

            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="h-px w-8 bg-white/40" />
              <span className="text-xs uppercase tracking-[0.2em] text-orange-100">
                Order Receipt
              </span>
              <span className="h-px w-8 bg-white/40" />
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Bill number */}
          <div className="flex items-center justify-between gap-3 bg-orange-50 border border-orange-100 rounded-xl p-4 mb-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl text-orange-500 shadow-sm shrink-0">
                <ReceiptText size={21} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500 mb-1">Bill / Token</p>
                <p className="font-bold text-gray-900 break-all">
                  {bill.billNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white text-green-700 border border-green-100 px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0">
              <CheckCircle2 size={14} />
              {bill.orderStatus}
            </div>
          </div>

          {/* Customer details */}
          <div className="mb-6">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Order Details
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Customer</span>
                <span className="text-gray-900 font-semibold text-right">
                  {bill.customer?.name || "Customer"}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Date & Time</span>
                <span className="text-gray-900 font-medium text-right">
                  {new Date(bill.date).toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Payment Method</span>
                <span className="text-gray-900 font-medium text-right">
                  {bill.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Payment Status</span>
                <span className="text-gray-900 font-semibold text-right">
                  {bill.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="border-t border-dashed border-gray-200 pt-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Items Ordered
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-orange-50 text-gray-600">
                    <th className="py-3 px-2 text-left font-semibold rounded-l-lg">
                      Item
                    </th>
                    <th className="py-3 px-1 text-center font-semibold">
                      Qty
                    </th>
                    <th className="py-3 px-1 text-right font-semibold">
                      Price
                    </th>
                    <th className="py-3 px-2 text-right font-semibold rounded-r-lg">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bill.items.map((i, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-3 px-2 text-gray-800 font-medium">
                        {i.name}
                      </td>

                      <td className="py-3 px-1 text-center text-gray-600">
                        {i.quantity}
                      </td>

                      <td className="py-3 px-1 text-right text-gray-600 whitespace-nowrap">
                        ₹{i.price}
                      </td>

                      <td className="py-3 px-2 text-right text-gray-900 font-semibold whitespace-nowrap">
                        ₹{i.subtotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price summary */}
          <div className="border-t border-dashed border-gray-200 mt-4 pt-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{bill.subtotal}</span>
              </div>

              {bill.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">− ₹{bill.discount}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 bg-orange-50 border border-orange-100 rounded-xl p-4 mt-5">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                <p className="text-xs text-gray-400">Inclusive of applied discount</p>
              </div>

              <span className="text-2xl font-extrabold text-orange-600 whitespace-nowrap">
                ₹{bill.totalAmount}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-dashed border-gray-200 mt-6 pt-5 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-orange-50 rounded-full mb-2">
              <UtensilsCrossed size={18} className="text-orange-500" />
            </div>

            <p className="text-gray-800 font-bold text-sm">
              Thank you for ordering!
            </p>

            <p className="text-gray-500 text-xs mt-1">
              Payment: {bill.paymentMethod} ({bill.paymentStatus})
            </p>

            <p className="text-gray-400 text-xs mt-2">
              Pay at the counter
            </p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            size: auto;
            margin: 10mm;
          }

          body {
            background: white !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          body * {
            visibility: hidden;
          }

          .max-w-md.mx-auto,
          .max-w-md.mx-auto * {
            visibility: visible;
          }

          .max-w-md.mx-auto {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
            padding: 0;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}