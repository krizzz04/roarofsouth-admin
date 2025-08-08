import React, { useState, PureComponent, useContext, useEffect } from "react";
import DashboardBoxes from "../../Components/DashboardBoxes";
import { FaPlus } from "react-icons/fa6";
import { Button, Pagination } from "@mui/material";
import { FaAngleDown } from "react-icons/fa6";
import Badge from "../../Components/Badge";
import { FaAngleUp } from "react-icons/fa6";
import { FaCalendarDay, FaChartLine } from "react-icons/fa";
import { GoGift } from "react-icons/go";
import { FiPieChart } from "react-icons/fi";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { MyContext } from '../../App';
import SearchBox from "../../Components/SearchBox";
import { fetchDataFromApi } from "../../utils/api";
import Products from "../Products";


const Dashboard = () => {
  const [isOpenOrderdProduct, setIsOpenOrderdProduct] = useState(null);

  const [productCat, setProductCat] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const [chartData, setChartData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const [productData, setProductData] = useState([]);
  const [productTotalData, setProductTotalData] = useState([]);

  const [ordersData, setOrdersData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pageOrder, setPageOrder] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState("all"); // "all", "cod", "prepaid"
  const [printDate, setPrintDate] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(false);

  const [totalOrdersData, setTotalOrdersData] = useState([]);

  const [users, setUsers] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [ordersCount, setOrdersCount] = useState(null);
  const [salesData, setSalesData] = useState({
    totalSalesAmount: 0,
    todaySales: 0,
    averageOrderValue: 0
  });

  const context = useContext(MyContext);


    useEffect(() => {
      context?.setProgress(30);
        getProducts(page, rowsPerPage);
    }, [])


  const isShowOrderdProduct = (index) => {
    if (isOpenOrderdProduct === index) {
      setIsOpenOrderdProduct(null);
    } else {
      setIsOpenOrderdProduct(index);
    }
  };


  useEffect(() => {


    fetchDataFromApi(`/api/order/order-list?page=${pageOrder}&limit=5`).then((res) => {
      if (res?.error === false) {
        setOrdersData(res?.data)
      }
    })
    fetchDataFromApi(`/api/order/order-list`).then((res) => {
      if (res?.error === false) {
        setTotalOrdersData(res)
        // Calculate sales analytics after getting all orders data
        setTimeout(() => getSalesAnalytics(), 100);
      }
    })
    fetchDataFromApi(`/api/order/count`).then((res) => {
      if (res?.error === false) {
        setOrdersCount(res?.count)
      }
    })
  }, [pageOrder])


  useEffect(() => {
    // Filter orders based on search query and payment filter
    let filteredOrders = totalOrdersData?.data || [];

    // Apply payment filter
    if (orderFilter !== "all") {
      filteredOrders = filteredOrders.filter((order) => {
        if (orderFilter === "cod") {
          return !order.paymentId || order.paymentId === "CASH ON DELIVERY";
        } else if (orderFilter === "prepaid") {
          return order.paymentId && order.paymentId !== "CASH ON DELIVERY";
        }
        return true;
      });
    }

    // Apply search filter
    if (orderSearchQuery !== "") {
      filteredOrders = filteredOrders.filter((order) =>
        order._id?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order?.userId?.name.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order?.userId?.email.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        order?.createdAt.includes(orderSearchQuery)
      );
    }

    setOrdersData(filteredOrders);
  }, [orderSearchQuery, orderFilter, totalOrdersData])



  useEffect(() => {
    getTotalSalesByYear();

    fetchDataFromApi("/api/user/getAllUsers").then((res) => {
      if (res?.error === false) {
        setUsers(res?.users)
      }
    })

    fetchDataFromApi("/api/user/getAllReviews").then((res) => {
      if (res?.error === false) {
        setAllReviews(res?.reviews)
      }
    })

  }, [])



  const getProducts = async (page, limit) => {
         fetchDataFromApi(`/api/product/getAllProducts?page=${page + 1}&limit=${limit}`).then((res) => {
             setProductData(res)
             setProductTotalData(res)
             context?.setProgress(100);
         })
     }


  const getTotalUsersByYear = () => {
    fetchDataFromApi(`/api/order/users`).then((res) => {
      const users = [];
      res?.TotalUsers?.length !== 0 &&
        res?.TotalUsers?.map((item) => {
          users.push({
            name: item?.name,
            TotalUsers: parseInt(item?.TotalUsers),
          });
        });

      const uniqueArr = users.filter(
        (obj, index, self) =>
          index === self.findIndex((t) => t.name === obj.name)
      );
      setChartData(uniqueArr);
    })
  }

  const getTotalSalesByYear = () => {
    fetchDataFromApi(`/api/order/sales`).then((res) => {
      const sales = [];
      res?.monthlySales?.length !== 0 &&
        res?.monthlySales?.map((item) => {
          sales.push({
            name: item?.name,
            TotalSales: parseInt(item?.TotalSales),
          });
        });

      const uniqueArr = sales.filter(
        (obj, index, self) =>
          index === self.findIndex((t) => t.name === obj.name)
      );
      setChartData(uniqueArr);
    });
  }

  const getSalesAnalytics = () => {
    // Calculate total sales amount from all orders
    if (totalOrdersData?.data?.length > 0) {
      const totalAmount = totalOrdersData.data.reduce((sum, order) => {
        return sum + (parseFloat(order.totalAmt) || 0);
      }, 0);

      // Calculate today's sales
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = totalOrdersData.data.filter(order => 
        order.createdAt?.split('T')[0] === today
      );
      const todayAmount = todayOrders.reduce((sum, order) => {
        return sum + (parseFloat(order.totalAmt) || 0);
      }, 0);

      // Calculate average order value
      const averageOrderValue = totalOrdersData.data.length > 0 ? totalAmount / totalOrdersData.data.length : 0;

      setSalesData({
        totalSalesAmount: totalAmount,
        todaySales: todayAmount,
        averageOrderValue: averageOrderValue
      });
    }
  }

  const printInvoicesByDate = () => {
    if (!printDate) {
      alert("Please select a date to print invoices");
      return;
    }

    const ordersForDate = totalOrdersData?.data?.filter(order => 
      order.createdAt?.split('T')[0] === printDate
    ) || [];

    if (ordersForDate.length === 0) {
      alert("No orders found for the selected date");
      return;
    }

    setShowPrintModal(true);
  }

  const generateCourierInvoice = (order) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Courier Invoice - ${order._id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Inter', sans-serif; 
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border-radius: 12px;
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          
          .header .company {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 4px;
          }
          
          .header .date {
            font-size: 14px;
            opacity: 0.8;
          }
          
          .content {
            padding: 30px;
          }
          
          .section {
            margin-bottom: 30px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .info-item {
            display: flex;
            flex-direction: column;
          }
          
          .info-label {
            font-size: 12px;
            font-weight: 500;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          
          .info-value {
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
          }
          
          .address-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin-top: 10px;
          }
          
          .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .products-table th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .products-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          
          .products-table tr:last-child td {
            border-bottom: none;
          }
          
          .total-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: right;
          }
          
          .total-amount {
            font-size: 24px;
            font-weight: 700;
            color: #059669;
          }
          
          .footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          
          .footer p {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
          }
          
          .courier-info {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
          }
          
          .courier-info h4 {
            color: #92400e;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          .courier-info p {
            font-size: 13px;
            color: #92400e;
            margin-bottom: 4px;
          }
          
          @media print {
            body { background: white; }
            .invoice-container { 
              box-shadow: none; 
              margin: 0;
              border-radius: 0;
            }
            .header { background: #374151 !important; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: center; padding: 20px; background: #f8fafc;">
          <button onclick="window.print()" style="background: #059669; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; cursor: pointer; margin-right: 10px;">Print Invoice</button>
          <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; cursor: pointer;">Close</button>
        </div>
        
        <div class="invoice-container">
          <div class="header">
            <h1>COURIER INVOICE</h1>
            <div class="company">Roar of South</div>
            <div class="date">Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          </div>
          
          <div class="content">
            <div class="section">
              <div class="section-title">Order Information</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Order ID</div>
                  <div class="info-value">${order._id}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Payment Method</div>
                  <div class="info-value">${order.paymentId || 'Cash on Delivery'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Order Status</div>
                  <div class="info-value">${order.order_status}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Total Items</div>
                  <div class="info-value">${order.products?.length || 0}</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Delivery Information</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Customer Name</div>
                  <div class="info-value">${order.userId?.name}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Phone Number</div>
                  <div class="info-value">${order.delivery_address?.mobile}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Email</div>
                  <div class="info-value">${order.userId?.email}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Pincode</div>
                  <div class="info-value">${order.delivery_address?.pincode}</div>
                </div>
              </div>
              
              <div class="address-box">
                <div class="info-label">Delivery Address</div>
                <div class="info-value">
                  ${order.delivery_address?.address_line1}, ${order.delivery_address?.landmark ? order.delivery_address.landmark + ', ' : ''}${order.delivery_address?.city}, ${order.delivery_address?.state} - ${order.delivery_address?.pincode}, ${order.delivery_address?.country}
                </div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Products</div>
              <table class="products-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.products?.map(product => `
                    <tr>
                      <td>${product.productTitle}</td>
                      <td>₹${product.price?.toLocaleString()}</td>
                      <td>${product.quantity}</td>
                      <td>₹${(product.price * product.quantity)?.toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <div class="total-section">
                <div class="total-amount">Total: ₹${parseFloat(order.totalAmt).toLocaleString()}</div>
              </div>
            </div>
            
            <div class="courier-info">
              <h4>📦 Courier Instructions</h4>
              <p>• Package contains ${order.products?.length || 0} item(s)</p>
              <p>• Handle with care - contains fragile items</p>
              <p>• Payment: ${order.paymentId ? 'Prepaid' : 'Cash on Delivery'}</p>
              <p>• Contact customer before delivery: ${order.delivery_address?.mobile}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Roar of South!</p>
            <p>Generated on: ${new Date().toLocaleString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
  }

  const generateAllInvoicesForDate = (orders) => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>All Invoices - ${printDate}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body { 
            font-family: 'Inter', sans-serif; 
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
          }
          
          .page-break {
            page-break-before: always;
          }
          
          .page-break:first-child {
            page-break-before: avoid;
          }
          
          .invoice-container {
            max-width: 800px;
            margin: 20px auto;
            background: white;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border-radius: 12px;
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          
          .header .company {
            font-size: 16px;
            opacity: 0.9;
            margin-bottom: 4px;
          }
          
          .header .date {
            font-size: 14px;
            opacity: 0.8;
          }
          
          .content {
            padding: 30px;
          }
          
          .section {
            margin-bottom: 30px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          
          .info-item {
            display: flex;
            flex-direction: column;
          }
          
          .info-label {
            font-size: 12px;
            font-weight: 500;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          
          .info-value {
            font-size: 14px;
            font-weight: 500;
            color: #1f2937;
          }
          
          .address-box {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
            margin-top: 10px;
          }
          
          .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .products-table th {
            background: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .products-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          
          .products-table tr:last-child td {
            border-bottom: none;
          }
          
          .total-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: right;
          }
          
          .total-amount {
            font-size: 24px;
            font-weight: 700;
            color: #059669;
          }
          
          .footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
          }
          
          .footer p {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
          }
          
          .courier-info {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
          }
          
          .courier-info h4 {
            color: #92400e;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          .courier-info p {
            font-size: 13px;
            color: #92400e;
            margin-bottom: 4px;
          }
          
          .summary-header {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 20px;
          }
          
          .summary-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          
          .summary-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 20px 0;
          }
          
          .summary-stat {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .summary-stat h3 {
            font-size: 24px;
            font-weight: 700;
            color: #059669;
            margin-bottom: 4px;
          }
          
          .summary-stat p {
            font-size: 14px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          @media print {
            body { background: white; }
            .invoice-container { 
              box-shadow: none; 
              margin: 0;
              border-radius: 0;
            }
            .header { background: #374151 !important; }
            .summary-header { background: #059669 !important; }
            .no-print { display: none; }
            .page-break { page-break-before: always; }
            .page-break:first-child { page-break-before: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: center; padding: 20px; background: #f8fafc;">
          <button onclick="window.print()" style="background: #059669; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; cursor: pointer; margin-right: 10px;">Print All Invoices</button>
          <button onclick="window.close()" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; cursor: pointer;">Close</button>
        </div>
        
        <div class="summary-header">
          <h1>DAILY INVOICES SUMMARY</h1>
          <p>Date: ${new Date(printDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        
        <div class="summary-stats">
          <div class="summary-stat">
            <h3>${orders.length}</h3>
            <p>Total Orders</p>
          </div>
          <div class="summary-stat">
            <h3>₹${orders.reduce((sum, order) => sum + (parseFloat(order.totalAmt) || 0), 0).toLocaleString()}</h3>
            <p>Total Amount</p>
          </div>
          <div class="summary-stat">
            <h3>${orders.reduce((sum, order) => sum + (order.products?.length || 0), 0)}</h3>
            <p>Total Items</p>
          </div>
        </div>
        
        ${orders.map((order, index) => `
          <div class="invoice-container ${index > 0 ? 'page-break' : ''}">
            <div class="header">
              <h1>COURIER INVOICE</h1>
              <div class="company">Roar of South</div>
              <div class="date">Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
            
            <div class="content">
              <div class="section">
                <div class="section-title">Order Information</div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Order ID</div>
                    <div class="info-value">${order._id}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Payment Method</div>
                    <div class="info-value">${order.paymentId || 'Cash on Delivery'}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Order Status</div>
                    <div class="info-value">${order.order_status}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Total Items</div>
                    <div class="info-value">${order.products?.length || 0}</div>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Delivery Information</div>
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">Customer Name</div>
                    <div class="info-value">${order.userId?.name}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Phone Number</div>
                    <div class="info-value">${order.delivery_address?.mobile}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Email</div>
                    <div class="info-value">${order.userId?.email}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">Pincode</div>
                    <div class="info-value">${order.delivery_address?.pincode}</div>
                  </div>
                </div>
                
                <div class="address-box">
                  <div class="info-label">Delivery Address</div>
                  <div class="info-value">
                    ${order.delivery_address?.address_line1}, ${order.delivery_address?.landmark ? order.delivery_address.landmark + ', ' : ''}${order.delivery_address?.city}, ${order.delivery_address?.state} - ${order.delivery_address?.pincode}, ${order.delivery_address?.country}
                  </div>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Products</div>
                <table class="products-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${order.products?.map(product => `
                      <tr>
                        <td>${product.productTitle}</td>
                        <td>₹${product.price?.toLocaleString()}</td>
                        <td>${product.quantity}</td>
                        <td>₹${(product.price * product.quantity)?.toLocaleString()}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
                
                <div class="total-section">
                  <div class="total-amount">Total: ₹${parseFloat(order.totalAmt).toLocaleString()}</div>
                </div>
              </div>
              
              <div class="courier-info">
                <h4>📦 Courier Instructions</h4>
                <p>• Package contains ${order.products?.length || 0} item(s)</p>
                <p>• Handle with care - contains fragile items</p>
                <p>• Payment: ${order.paymentId ? 'Prepaid' : 'Cash on Delivery'}</p>
                <p>• Contact customer before delivery: ${order.delivery_address?.mobile}</p>
              </div>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing Roar of South!</p>
              <p>Generated on: ${new Date().toLocaleString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
  }



  return (
    <>
      <div className="w-full py-4 lg:py-1 px-5 border bg-[#f1faff] border-[rgba(0,0,0,0.1)] flex items-center gap-8 mb-5 justify-between rounded-md">
        <div className="info">
          <h1 className="text-[26px] lg:text-[35px] font-bold leading-8 lg:leading-10 mb-3">
            Welcome,
            <br />
            <span className="text-primary">{context?.userData?.name}</span>
          </h1>
          <p>
            Here’s What happening on your store today. See the statistics at
            once.
          </p>
          <br />
          <Button className="btn-blue btn !capitalize" onClick={() => context.setIsOpenFullScreenPanel({
            open: true,
            model: "Add Product"
          })}>
            <FaPlus /> Add Product
          </Button>
        </div>

        <img src="/shop-illustration.webp" className="w-[250px] hidden lg:block" />
      </div>

      {
        productData?.products?.length !== 0 && users?.length !== 0 && allReviews?.length !== 0 && <DashboardBoxes 
          orders={ordersCount} 
          products={productData?.products?.length} 
          users={users?.length} 
          reviews={allReviews?.length} 
          category={context?.catData?.length}
          totalSalesAmount={salesData.totalSalesAmount}
          todaySales={salesData.todaySales}
          averageOrderValue={salesData.averageOrderValue}
        />
      }

      <Products/>

      <div className="card my-4 shadow-md sm:rounded-lg bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 px-5 py-5 flex-col sm:flex-row">
          <div>
            <h2 className="text-[18px] font-[600] text-left mb-2 lg:mb-0">Recent Orders</h2>
            <p className="text-sm text-gray-500">
              Showing {ordersData?.length || 0} orders
              {orderFilter !== "all" && (
                <span className="ml-1">
                  ({orderFilter === "cod" ? "Cash on Delivery" : "Prepaid"} only)
                </span>
              )}
            </p>
          </div>
                     <div className="ml-auto w-full flex flex-col gap-3">
             {/* Payment Filter Buttons */}
             <div className="flex items-center gap-2">
               <span className="text-sm font-medium text-gray-600">Payment Filter:</span>
               <div className="flex items-center gap-1">
                 <button
                   onClick={() => setOrderFilter("all")}
                   className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                     orderFilter === "all"
                       ? "bg-blue-500 text-white"
                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                   }`}
                 >
                   All Orders
                 </button>
                 <button
                   onClick={() => setOrderFilter("cod")}
                   className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                     orderFilter === "cod"
                       ? "bg-green-500 text-white"
                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                   }`}
                 >
                   Cash on Delivery
                 </button>
                 <button
                   onClick={() => setOrderFilter("prepaid")}
                   className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                     orderFilter === "prepaid"
                       ? "bg-purple-500 text-white"
                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                   }`}
                 >
                   Prepaid
                 </button>
               </div>
             </div>

             {/* Print Invoice Section */}
             <div className="flex items-center gap-2">
               <span className="text-sm font-medium text-gray-600">Print Invoices:</span>
               <div className="flex items-center gap-2">
                 <input
                   type="date"
                   value={printDate}
                   onChange={(e) => setPrintDate(e.target.value)}
                   className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   max={new Date().toISOString().split('T')[0]}
                 />
                 <button
                   onClick={printInvoicesByDate}
                   className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-1"
                 >
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                   </svg>
                   Print
                 </button>
               </div>
             </div>

             <SearchBox
               searchQuery={orderSearchQuery}
               setSearchQuery={setOrderSearchQuery}
               setPageOrder={setPageOrder}
             />
           </div>
        </div>

        <div className="relative overflow-x-auto mt-0">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  &nbsp;
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Order Id
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Paymant Id
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Pincode
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  User Id
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Order Status
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>

              {
                ordersData?.length !== 0 && ordersData?.map((order, index) => {
                  return (
                    <>
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4 font-[500]">
                          <Button
                            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-[#f1f1f1]"
                            onClick={() => isShowOrderdProduct(index)}
                          >
                            {
                              isOpenOrderdProduct === index ? <FaAngleUp className="text-[16px] text-[rgba(0,0,0,0.7)]" /> : <FaAngleDown className="text-[16px] text-[rgba(0,0,0,0.7)]" />
                            }

                          </Button>
                        </td>
                        <td className="px-6 py-4 font-[500]">
                          <span className="text-primary">
                            {order?._id}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-[500]">
                          <span className="text-primary whitespace-nowrap text-[13px]">{order?.paymentId ? order?.paymentId : 'CASH ON DELIVERY'}</span>
                        </td>

                        <td className="px-6 py-4 font-[500] whitespace-nowrap">
                          {order?.userId?.name}
                        </td>

                        <td className="px-6 py-4 font-[500]">{order?.delivery_address?.mobile}</td>

                        <td className="px-6 py-4 font-[500]">
                          <span className='inline-block text-[13px] font-[500] p-1 bg-[#f1f1f1] rounded-md'>{order?.delivery_address?.addressType}</span>
                          <span className="block w-[400px]">
                            {order?.delivery_address?.
                              address_line1 + " " +
                              order?.delivery_address?.city + " " +
                              order?.delivery_address?.landmark + " " +
                              order?.delivery_address?.state + " " +
                              order?.delivery_address?.country + ' ' + order?.delivery_address?.mobile
                            }
                          </span>
                        </td>

                        <td className="px-6 py-4 font-[500]">{order?.delivery_address?.pincode}</td>

                        <td className="px-6 py-4 font-[500]">{order?.totalAmt}</td>

                        <td className="px-6 py-4 font-[500]">
                          {order?.userId?.email}
                        </td>

                        <td className="px-6 py-4 font-[500]">
                          <span className="text-primary">
                            {order?.userId?._id}
                          </span>
                        </td>

                        <td className="px-6 py-4 font-[500]">
                          <Badge status={order?.order_status} />
                        </td>
                        <td className="px-6 py-4 font-[500] whitespace-nowrap">
                          {order?.createdAt?.split("T")[0]}
                        </td>
                      </tr>

                      {isOpenOrderdProduct === index && (
                        <tr>
                          <td className="pl-20" colSpan="6">
                            <div className="relative overflow-x-auto">
                              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 whitespace-nowrap"
                                    >
                                      Product Id
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 whitespace-nowrap"
                                    >
                                      Product Title
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 whitespace-nowrap"
                                    >
                                      Image
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 whitespace-nowrap"
                                    >
                                      Quantity
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 whitespace-nowrap"
                                    >
                                      Price
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-6 py-3 whitespace-nowrap"
                                    >
                                      Sub Total
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    order?.products?.map((item, index) => {
                                      return (
                                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                          <td className="px-6 py-4 font-[500]">
                                            <span className="text-gray-600">
                                              {item?._id}
                                            </span>
                                          </td>
                                          <td className="px-6 py-4 font-[500]">
                                            <div className="w-[200px]">
                                              {item?.productTitle}
                                            </div>
                                          </td>

                                          <td className="px-6 py-4 font-[500]">
                                            <img
                                              src={item?.image}
                                              className="w-[40px] h-[40px] object-cover rounded-md"
                                            />
                                          </td>

                                          <td className="px-6 py-4 font-[500] whitespace-nowrap">
                                            {item?.quantity}
                                          </td>

                                          <td className="px-6 py-4 font-[500]">{item?.price?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>

                                          <td className="px-6 py-4 font-[500]">{(item?.price * item?.quantity)?.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}</td>
                                        </tr>
                                      )
                                    })
                                  }


                                  <tr>
                                    <td
                                      className="bg-[#f1f1f1]"
                                      colSpan="12"
                                    ></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })

              }

            </tbody>
          </table>
        </div>


        {
          orders?.totalPages > 1 &&
          <div className="flex items-center justify-center mt-10 pb-5">
            <Pagination
              showFirstButton showLastButton
              count={orders?.totalPages}
              page={pageOrder}
              onChange={(e, value) => setPageOrder(value)}
            />
          </div>
        }

      </div>


      <div className="card my-4 shadow-md sm:rounded-lg bg-white">
        <div className="flex items-center justify-between px-5 py-5 pb-0">
          <h2 class="text-[18px] font-[600]">Total Users & Total Sales</h2>
        </div>

        <div className="flex items-center gap-5 px-5 py-5 pt-1">
          <span className="flex items-center gap-1 text-[15px] cursor-pointer" onClick={getTotalUsersByYear}>
            <span className="block w-[8px] h-[8px] rounded-full bg-primary "
            ></span>
            Total Users
          </span>

          <span className="flex items-center gap-1 text-[15px] cursor-pointer" onClick={getTotalSalesByYear}>
            <span className="block w-[8px] h-[8px] rounded-full bg-green-600  "
            ></span>
            Total Sales
          </span>
        </div>

        {chartData?.length !== 0 &&
          <BarChart
            width={context?.windowWidth > 920 ? (context?.windowWidth - 300) : (context?.windowWidth-50)}
            height={500}
            data={chartData}
            margin={{
              top: 5,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="name"
              scale="point"
              padding={{ left: 10, right: 10 }}
              tick={{ fontSize: 12 }}
              label={{ position: "insideBottom", fontSize: 14 }}
              style={{ fill: context?.theme === "dark" ? "white" : "#000" }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ position: "insideBottom", fontSize: 14 }}
              style={{ fill: context?.theme === "dark" ? "white" : "#000" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#071739  ",
                color: "white",
              }} // Set tooltip background and text color
              labelStyle={{ color: "yellow" }} // Label text color
              itemStyle={{ color: "cyan" }} // Set color for individual items in the tooltip
              cursor={{ fill: "white" }} // Customize the tooltip cursor background on hover
            />
            <Legend />
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              vertical={false}
            />
            <Bar dataKey="TotalSales" stackId="a" fill="#16a34a" />
            <Bar dataKey="TotalUsers" stackId="b" fill="#0858f7" />

          </BarChart>
        }
      </div>

      {/* Daily Sales Chart */}
      <div className="card my-4 shadow-md sm:rounded-lg bg-white">
        <div className="flex items-center justify-between px-5 py-5 pb-0">
          <h2 className="text-[18px] font-[600]">Daily Sales Trend</h2>
        </div>

        <div className="p-5">
          {(() => {
            // Generate last 7 days data
            const last7Days = [];
            for (let i = 6; i >= 0; i--) {
              const date = new Date();
              date.setDate(date.getDate() - i);
              const dateStr = date.toISOString().split('T')[0];
              
              const dayOrders = totalOrdersData?.data?.filter(order => 
                order.createdAt?.split('T')[0] === dateStr
              ) || [];
              
              const dayAmount = dayOrders.reduce((sum, order) => 
                sum + (parseFloat(order.totalAmt) || 0), 0
              );

              last7Days.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                sales: dayAmount,
                orders: dayOrders.length
              });
            }

            return (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    style={{ fill: context?.theme === "dark" ? "white" : "#000" }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    style={{ fill: context?.theme === "dark" ? "white" : "#000" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#071739",
                      color: "white",
                    }}
                    labelStyle={{ color: "yellow" }}
                    itemStyle={{ color: "cyan" }}
                    cursor={{ fill: "white" }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Sales Amount (₹)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Number of Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            );
          })()}
        </div>
      </div>

      {/* Detailed Sales Analytics Section */}
      <div className="card my-4 shadow-md sm:rounded-lg bg-white">
        <div className="flex items-center justify-between px-5 py-5 pb-0">
          <h2 className="text-[18px] font-[600]">Sales Performance Overview</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
          {/* Weekly Sales */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Weekly Sales</p>
                <p className="text-2xl font-bold text-blue-800">
                  ₹{(() => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    const weekOrders = totalOrdersData?.data?.filter(order => 
                      new Date(order.createdAt) >= weekAgo
                    ) || [];
                    const weekAmount = weekOrders.reduce((sum, order) => 
                      sum + (parseFloat(order.totalAmt) || 0), 0
                    );
                    return weekAmount.toLocaleString();
                  })()}
                </p>
                <p className="text-xs text-blue-600 mt-1">Last 7 days</p>
              </div>
              <div className="text-blue-500">
                <FaCalendarDay className="text-2xl" />
              </div>
            </div>
          </div>

          {/* Monthly Sales */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Monthly Sales</p>
                <p className="text-2xl font-bold text-green-800">
                  ₹{(() => {
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    const monthOrders = totalOrdersData?.data?.filter(order => 
                      new Date(order.createdAt) >= monthAgo
                    ) || [];
                    const monthAmount = monthOrders.reduce((sum, order) => 
                      sum + (parseFloat(order.totalAmt) || 0), 0
                    );
                    return monthAmount.toLocaleString();
                  })()}
                </p>
                <p className="text-xs text-green-600 mt-1">Last 30 days</p>
              </div>
              <div className="text-green-500">
                <FaChartLine className="text-2xl" />
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-purple-800">
                  {totalOrdersData?.data?.length || 0}
                </p>
                <p className="text-xs text-purple-600 mt-1">All time orders</p>
              </div>
              <div className="text-purple-500">
                <GoGift className="text-2xl" />
              </div>
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Conversion Rate</p>
                <p className="text-2xl font-bold text-orange-800">
                  {(() => {
                    const totalUsers = users?.length || 1;
                    const totalOrders = totalOrdersData?.data?.length || 0;
                    const conversionRate = ((totalOrders / totalUsers) * 100).toFixed(1);
                    return `${conversionRate}%`;
                  })()}
                </p>
                <p className="text-xs text-orange-600 mt-1">Orders per user</p>
              </div>
              <div className="text-orange-500">
                <FiPieChart className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sales Activity */}
        <div className="px-5 pb-5">
          <h3 className="text-[16px] font-[600] mb-3 text-gray-700">Recent Sales Activity</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              {totalOrdersData?.data?.slice(0, 5).map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Order #{order._id?.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.userId?.name} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">
                      ₹{parseFloat(order.totalAmt).toLocaleString()}
                    </p>
                    <Badge status={order.order_status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
             </div>

       {/* Print Invoice Modal */}
       {showPrintModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
             {/* Modal Header */}
             <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
               <div className="flex items-center justify-between">
                 <div>
                   <h2 className="text-2xl font-bold">Print Invoices</h2>
                   <p className="text-blue-100 mt-1">
                     Select orders to print courier invoices for {printDate}
                   </p>
                 </div>
                 <button
                   onClick={() => setShowPrintModal(false)}
                   className="text-white hover:text-blue-200 transition-colors"
                 >
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
             </div>

             {/* Modal Content */}
             <div className="p-6 overflow-y-auto max-h-[60vh]">
               {(() => {
                 const ordersForDate = totalOrdersData?.data?.filter(order => 
                   order.createdAt?.split('T')[0] === printDate
                 ) || [];

                 if (ordersForDate.length === 0) {
                   return (
                     <div className="text-center py-8">
                       <div className="text-gray-400 mb-4">
                         <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                         </svg>
                       </div>
                       <h3 className="text-lg font-semibold text-gray-600 mb-2">No Orders Found</h3>
                       <p className="text-gray-500">No orders were placed on {printDate}</p>
                     </div>
                   );
                 }

                 return (
                   <div className="space-y-4">
                     <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                         <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                           {ordersForDate.length} Orders
                         </div>
                         <div className="text-sm text-gray-600">
                           Total: ₹{ordersForDate.reduce((sum, order) => sum + (parseFloat(order.totalAmt) || 0), 0).toLocaleString()}
                         </div>
                       </div>
                       <button
                         onClick={() => generateAllInvoicesForDate(ordersForDate)}
                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                         </svg>
                         Print All Invoices
                       </button>
                     </div>

                     {ordersForDate.map((order, index) => (
                       <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                         <div className="flex items-center justify-between mb-3">
                           <div className="flex items-center gap-3">
                             <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                               #{order._id?.slice(-8)}
                             </div>
                             <div>
                               <h4 className="font-semibold text-gray-800">{order.userId?.name}</h4>
                               <p className="text-sm text-gray-500">{order.delivery_address?.mobile}</p>
                             </div>
                           </div>
                           <div className="text-right">
                             <div className="font-bold text-gray-800">₹{parseFloat(order.totalAmt).toLocaleString()}</div>
                             <Badge status={order.order_status} />
                           </div>
                         </div>

                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                           <div>
                             <span className="text-gray-500">Items:</span>
                             <span className="ml-1 font-medium">{order.products?.length || 0}</span>
                           </div>
                           <div>
                             <span className="text-gray-500">Payment:</span>
                             <span className="ml-1 font-medium">{order.paymentId ? 'Prepaid' : 'COD'}</span>
                           </div>
                           <div>
                             <span className="text-gray-500">Pincode:</span>
                             <span className="ml-1 font-medium">{order.delivery_address?.pincode}</span>
                           </div>
                           <div>
                             <span className="text-gray-500">City:</span>
                             <span className="ml-1 font-medium">{order.delivery_address?.city}</span>
                           </div>
                         </div>

                         <div className="flex items-center justify-between">
                           <div className="text-sm text-gray-600">
                             <span className="text-gray-500">Address:</span>
                             <span className="ml-1">
                               {order.delivery_address?.address_line1}, {order.delivery_address?.city}
                             </span>
                           </div>
                           <button
                             onClick={() => generateCourierInvoice(order)}
                             className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1"
                           >
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                             </svg>
                             Print Invoice
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 );
               })()}
             </div>

             {/* Modal Footer */}
             <div className="bg-gray-50 px-6 py-4 border-t">
               <div className="flex items-center justify-between">
                 <div className="text-sm text-gray-600">
                   💡 Tip: All invoices will be printed together in a single document
                 </div>
                 <div className="flex gap-3">
                   <button
                     onClick={() => setShowPrintModal(false)}
                     className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                   >
                     Close
                   </button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
     </>
   );
 };

export default Dashboard;
