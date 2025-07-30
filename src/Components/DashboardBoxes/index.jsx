import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/free-mode';

import { Navigation, FreeMode } from "swiper/modules";
import { GoGift } from "react-icons/go";
import { IoStatsChartSharp } from "react-icons/io5";
import { FiPieChart } from "react-icons/fi";
import { BsBank } from "react-icons/bs";
import { RiProductHuntLine } from "react-icons/ri";
import { Button } from "@mui/material";
import { MdOutlineReviews } from "react-icons/md";
import { MyContext } from "../../App";
import { FaDollarSign, FaChartLine, FaCalendarDay } from "react-icons/fa";



const DashboardBoxes = (props) => {

  const context = useContext(MyContext);


  return (
    <>
      <Swiper
        slidesPerView={4}
        spaceBetween={10}
        navigation={context?.windowWidth < 1100 ? false : true}
        modules={[Navigation, FreeMode]}
        freeMode={true}
        breakpoints={{
          300: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          550: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          900: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1100: {
            slidesPerView: 4,
            spaceBetween: 10,
          },
        }}
        className="dashboardBoxesSlider mb-5"
      >
        <SwiperSlide>
          <div className="box bg-[#10b981] p-5 py-6  cursor-pointer hover:bg-[#289974] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <FiPieChart className="text-[40px] text-[#fff]" />
            <div className="info w-[80%]">
              <h3 className="text-white">Total Users</h3>
              <b className="text-white text-[20px]">{props?.users}</b>
            </div>
            <IoStatsChartSharp className="text-[45px] text-[#fff]" />
          </div>
        </SwiperSlide>



        <SwiperSlide>
          <div className="box bg-[#3872fa] p-5 py-6 cursor-pointer hover:bg-[#346ae8] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <GoGift className="text-[40px] text-[#fff]" />
            <div className="info w-[80%]">
              <h3 className="text-white">Total Orders</h3>
              <b className="text-white text-[20px]">{props?.orders}</b>
            </div>
            <FiPieChart className="text-[40px] text-[#fff]" />
          </div>
        </SwiperSlide>



        <SwiperSlide>
          <div className="box p-5 bg-[#312be1d8]  py-6  cursor-pointer hover:bg-[#423eadd8] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <RiProductHuntLine className="text-[40px] text-[#fff]" />
            <div className="info w-[80%]">
              <h3 className="text-white">Total Products</h3>
              <b className="text-white text-[20px]">{props?.products}</b>
            </div>
            <IoStatsChartSharp className="text-[50px] text-[#fff]" />
          </div>
        </SwiperSlide>



        <SwiperSlide>
          <div className="box p-5  bg-[#f22c61]  py-6 cursor-pointer hover:bg-[#d52c59] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4">
            <MdOutlineReviews className="text-[40px]  text-[#fff]" />
            <div className="info w-[80%]">
              <h3 className="text-white">Total Category</h3>
              <b className="text-white text-[20px]">{props.category}</b>
            </div>
            <IoStatsChartSharp className="text-[50px] text-[#fff]" />
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Sales Analytics Section */}
      <div className="mb-5">
        <h2 className="text-[20px] font-[600] mb-4 text-gray-800">Sales Analytics</h2>
        <Swiper
          slidesPerView={3}
          spaceBetween={10}
          navigation={context?.windowWidth < 1100 ? false : true}
          modules={[Navigation, FreeMode]}
          freeMode={true}
          breakpoints={{
            300: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            550: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            900: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
          }}
          className="dashboardBoxesSlider"
        >
          <SwiperSlide>
            <div className="box bg-gradient-to-r from-[#059669] to-[#10b981] p-5 py-6 cursor-pointer hover:from-[#047857] hover:to-[#059669] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4 shadow-lg">
              <FaDollarSign className="text-[40px] text-[#fff]" />
              <div className="info w-[80%]">
                <h3 className="text-white text-sm">Total Sales Amount</h3>
                <b className="text-white text-[20px]">
                  {props?.totalSalesAmount ? `₹${props.totalSalesAmount.toLocaleString()}` : '₹0'}
                </b>
                <p className="text-white text-xs mt-1 opacity-90">All time revenue</p>
              </div>
              <BsBank className="text-[45px] text-[#fff] opacity-80" />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="box bg-gradient-to-r from-[#dc2626] to-[#ef4444] p-5 py-6 cursor-pointer hover:from-[#b91c1c] hover:to-[#dc2626] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4 shadow-lg">
              <FaCalendarDay className="text-[40px] text-[#fff]" />
              <div className="info w-[80%]">
                <h3 className="text-white text-sm">Today's Sales</h3>
                <b className="text-white text-[20px]">
                  {props?.todaySales ? `₹${props.todaySales.toLocaleString()}` : '₹0'}
                </b>
                <p className="text-white text-xs mt-1 opacity-90">Today's revenue</p>
              </div>
              <FaChartLine className="text-[45px] text-[#fff] opacity-80" />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="box bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] p-5 py-6 cursor-pointer hover:from-[#6d28d9] hover:to-[#7c3aed] rounded-md border border-[rgba(0,0,0,0.1)] flex items-center gap-4 shadow-lg">
              <FaChartLine className="text-[40px] text-[#fff]" />
              <div className="info w-[80%]">
                <h3 className="text-white text-sm">Average Order Value</h3>
                <b className="text-white text-[20px]">
                  {props?.averageOrderValue ? `₹${props.averageOrderValue.toLocaleString()}` : '₹0'}
                </b>
                <p className="text-white text-xs mt-1 opacity-90">Per order average</p>
              </div>
              <FiPieChart className="text-[45px] text-[#fff] opacity-80" />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
};

export default DashboardBoxes;
