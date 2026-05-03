import { useState, useEffect } from "react";
import OrderDetails from "../components/OrderDetails";
import {
  fetchOrders,
  markOrderPaid,
  completeOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "../services/api.service.js";

const Orders = () => {
  const [orderDetails, setOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isUpdating, setIsUpdating] = useState(false);
  const [tabCounts, setTabCounts] = useState({
    all: 0,
    johns: 0,
    swift: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data.orders);
      setTabCounts(data.tabCounts);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOrderDetails(true);
  };

  const handleMarkAsPaid = async (orderId) => {
    setIsUpdating(true);
    try {
      await markOrderPaid(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId
            ? { ...o, paymentStatus: "Paid", orderStatus: "Processing" }
            : o,
        ),
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          paymentStatus: "Paid",
          orderStatus: "Processing",
        }));
      }
    } catch (error) {
      console.error("Failed to mark as paid:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    setIsUpdating(true);
    try {
      await completeOrder(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, orderStatus: "Completed" } : o,
        ),
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: "Completed" }));
      }
    } catch (error) {
      console.error("Failed to complete order:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await updateOrderStatus(selectedOrder._id, status);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, orderStatus: status } : o,
        ),
      );
      setSelectedOrder((prev) => ({ ...prev, orderStatus: status }));
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePayment = async (status) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await updatePaymentStatus(selectedOrder._id, status);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === selectedOrder._id ? { ...o, paymentStatus: status } : o,
        ),
      );
      setSelectedOrder((prev) => ({ ...prev, paymentStatus: status }));
    } catch (error) {
      console.error("Failed to update payment:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = () => {
    switch (activeTab) {
      case "johns":
        return orders.filter((o) => o.brand === "John's Stores");
      case "swift":
        return orders.filter((o) => o.brand === "Swift Logistics");
      case "pending":
        return orders.filter((o) => o.paymentStatus === "Pending");
      case "completed":
        return orders.filter((o) => o.orderStatus === "Completed");
      default:
        return orders;
    }
  };

  const getStatusBadgeStyle = (status) => {
    const styles = {
      Paid: "bg-[#DCFCE7] text-[#2D2D2D]",
      Pending: "bg-[#F2EEC1] text-[#2D2D2D]",
      Completed: "bg-[#DCFCE7] text-[#2D2D2D]",
      Processing: "bg-[rgba(230,211,172,0.45)] text-[#2D2D2D]",
      Cancelled: "bg-[#FFE2E2] text-[#C10007]",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const showMarkPaidButton = (order) => order.paymentStatus === "Pending";
  const showCompleteButton = (order) =>
    order.orderStatus === "Processing" && order.paymentStatus === "Paid";

  const mapOrderForModal = (order) => ({
    orderId: order.orderId,
    brand: order.brand,
    sender: order.sender,
    customer: { name: order.sender, phone: order.senderPhone },
    recipient: order.recipient,
    items: order.items?.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    _id: order._id,
  });

  const tabs = [
    { key: "all", label: "All", count: tabCounts.all },
    { key: "johns", label: "Johns", count: tabCounts.johns },
    { key: "swift", label: "Swift", count: tabCounts.swift },
    { key: "pending", label: "Pending", count: tabCounts.pending },
    { key: "completed", label: "Completed", count: tabCounts.completed },
  ];

  return (
    <div className="w-full flex flex-col">
      <div className="p-3 lg:p-6">
        {/* Tabs */}
        <div className="flex justify-start items-center gap-4 lg:gap-6 mb-4 lg:mb-6 border-b border-[rgba(113,113,130,0.45)] overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-1 lg:px-2 font-medium text-xs lg:text-sm font-clash-grotesk transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? "text-[#E3494E] border-b-2 border-[#E3494E]"
                  : "text-[#717182] hover:text-[#2D2D2D]"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="w-full h-auto rounded-[18px] border border-[rgba(107,107,107,0.25)] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-[#FAFAFA] border-b border-[rgba(107,107,107,0.1)]">
                <tr>
                  {[
                    "Order ID",
                    "Items",
                    "Sender",
                    "Recipient",
                    "Total",
                    "Payment",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-3 lg:px-4 py-3 text-[#717182] font-medium text-[11px] lg:text-xs font-clash-grotesk"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-10">
                      <div className="flex justify-center items-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-[#032817] border-t-transparent animate-spin" />
                        <p className="text-[#717182] font-dm-sans-500 text-sm">
                          Loading orders...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders().length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-10 text-[#717182] font-dm-sans-500 text-sm"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders().map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-[rgba(107,107,107,0.05)] hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 lg:px-4 py-3">
                        <span className="text-[#2D2D2D] font-medium text-[11px] lg:text-[13px] font-clash-grotesk">
                          {order.orderId}
                        </span>
                      </td>
                      <td className="px-3 lg:px-4 py-3">
                        <span className="text-[#2D2D2D] text-[11px] lg:text-[13px] font-clash-grotesk">
                          {order.items?.length}
                        </span>
                      </td>
                      <td className="px-3 lg:px-4 py-3">
                        <span className="text-[#2D2D2D] text-[11px] lg:text-[13px] font-clash-grotesk">
                          {order.sender}
                        </span>
                      </td>
                      <td className="px-3 lg:px-4 py-3">
                        <span className="text-[#2D2D2D] text-[11px] lg:text-[13px] font-clash-grotesk">
                          {order.recipient?.name || "-"}
                        </span>
                      </td>
                      <td className="px-3 lg:px-4 py-3">
                        <span className="text-[#3B0002] font-medium text-[11px] lg:text-[13px] font-clash-grotesk">
                          ₦{order.total?.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-3 lg:px-4 py-3">
                        <span
                          className={`inline-flex px-2 lg:px-3 py-1 rounded-sm text-[10px] lg:text-xs font-medium ${getStatusBadgeStyle(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-3 lg:px-4 py-3">
                        <span
                          className={`inline-flex px-2 lg:px-3 py-1 rounded-sm text-[10px] lg:text-xs font-medium ${getStatusBadgeStyle(order.orderStatus)}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-3 lg:px-4 py-3">
                        <div className="flex items-center gap-1 lg:gap-2 flex-wrap">
                          <button
                            onClick={() =>
                              handleViewOrder(mapOrderForModal(order))
                            }
                            className="text-[#E3494E] font-bold text-[11px] lg:text-[13px] underline hover:no-underline font-dm-sans-700 cursor-pointer"
                          >
                            View
                          </button>
                          {showMarkPaidButton(order) && (
                            <button
                              onClick={() => handleMarkAsPaid(order._id)}
                              disabled={isUpdating}
                              className="text-[#032817] font-bold text-[11px] lg:text-[13px] underline hover:no-underline font-dm-sans-700 cursor-pointer disabled:opacity-50"
                            >
                              Paid
                            </button>
                          )}
                          {showCompleteButton(order) && (
                            <button
                              onClick={() => handleCompleteOrder(order._id)}
                              disabled={isUpdating}
                              className="text-[#008236] font-medium text-[11px] lg:text-[13px] hover:underline font-dm-sans-700 cursor-pointer disabled:opacity-50"
                            >
                              Done
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {orderDetails && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[572px] max-h-[90vh] overflow-y-auto"
          >
            <OrderDetails
              onClose={() => {
                setOrderDetails(false);
                setSelectedOrder(null);
              }}
              orderData={selectedOrder}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePayment={handleUpdatePayment}
              isLoading={isUpdating}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
