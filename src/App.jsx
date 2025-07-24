import "./App.css";
import "./responsive.css";
import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
import { createContext, useState } from "react";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Products from "./Pages/Products";

import HomeSliderBanners from "./Pages/HomeSliderBanners";
import CategoryList from "./Pages/Categegory";
import SubCategoryList from "./Pages/Categegory/subCatList";
import Users from "./Pages/Users";
import Orders from "./Pages/Orders";
import ForgotPassword from "./Pages/ForgotPassword";
import VerifyAccount from "./Pages/VerifyAccount";
import ChangePassword from "./Pages/ChangePassword";

import toast, { Toaster } from 'react-hot-toast';
import { fetchDataFromApi } from "./utils/api";
import { useEffect } from "react";
import Profile from "./Pages/Profile";
import ProductDetails from "./Pages/Products/productDetails";
import AddRAMS from "./Pages/Products/addRAMS.JSX";
import AddWeight from "./Pages/Products/addWeight";
import AddSize from "./Pages/Products/addSize";
import BannerV1List from "./Pages/Banners/bannerV1List";
import { BannerList2 } from "./Pages/Banners/bannerList2";
import { BlogList } from "./Pages/Blog";
import ManageLogo from "./Pages/ManageLogo";
import LoadingBar from "react-top-loading-bar";

const MyContext = createContext();
function App() {
  const [isSidebarOpen, setisSidebarOpen] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState([]);
  const [catData, setCatData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarWidth, setSidebarWidth] = useState(18);

  const [progress, setProgress] = useState(0);


  const [isOpenFullScreenPanel, setIsOpenFullScreenPanel] = useState({
    open: false,
    id: ""
  });


  useEffect(() => {
    localStorage.removeItem("userEmail")
    if (windowWidth < 992) {
      setisSidebarOpen(false);
      setSidebarWidth(100)
    } else {
      setSidebarWidth(18)
    }
  }, [windowWidth])


  useEffect(() => {
    if (userData?.role !== "ADMIN") {
      const handleContextmenu = e => {
        e.preventDefault()
      }
      document.addEventListener('contextmenu', handleContextmenu)
      return function cleanup() {
        document.removeEventListener('contextmenu', handleContextmenu)
      }
    }
  }, [userData])

  const router = createBrowserRouter([
    {
      path: "/",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />

              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <Dashboard />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/login",
      exact: true,
      element: (
        <>
          <Login />
        </>
      ),
    },
    {
      path: "/sign-up",
      exact: true,
      element: (
        <>
          <SignUp />
        </>
      ),
    },
    {
      path: "/forgot-password",
      exact: true,
      element: (
        <>
          <ForgotPassword />
        </>
      ),
    },
    {
      path: "/verify-account",
      exact: true,
      element: (
        <>
          <VerifyAccount />
        </>
      ),
    },
    {
      path: "/change-password",
      exact: true,
      element: (
        <>
          <ChangePassword />
        </>
      ),
    },
    {
      path: "/products",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <Products />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/homeSlider/list",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '82%' }}
              >
                <HomeSliderBanners />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/category/list",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <CategoryList />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/subCategory/list",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <SubCategoryList />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/users",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <Users />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/orders",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <Orders />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/profile",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <Profile />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/:id",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <ProductDetails />
              </div>
            </div>
          </section>
        </>
      ),
    },

    {
      path: "/product/addRams",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <AddRAMS />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/addWeight",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <AddWeight />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/product/addSize",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <AddSize />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/bannerV1/list",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <BannerV1List />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/bannerlist2/List",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <BannerList2 />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/blog/List",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <BlogList />
              </div>
            </div>
          </section>
        </>
      ),
    },
    {
      path: "/logo/manage",
      exact: true,
      element: (
        <>
          <section className="main">
            <Header />
            <div className="contentMain flex">
              <div
                className={`overflow-hidden sidebarWrapper ${isSidebarOpen === true ? windowWidth < 992 ? `w-[${sidebarWidth / 1.5}%]` : `w-[20%]` : "w-[0px] opacity-0 invisible"
                  } transition-all`}
              >
                <Sidebar />
              </div>
              <div
                className={`contentRight overflow-hidden py-4 px-5 ${isSidebarOpen === true && windowWidth < 992 && 'opacity-0'}  transition-all`}
                style={{ width: isSidebarOpen === false ? "100%" : '80%' }}
              >
                <ManageLogo />
              </div>
            </div>
          </section>
        </>
      ),
    },
  ]);

  const alertBox = (type, msg) => {
    if (type === "success") {
      toast.success(msg)
    }
    if (type === "error") {
      toast.error(msg)
    }
  }


  useEffect(() => {

    const token = localStorage.getItem('accessToken');

    if (token !== undefined && token !== null && token !== "") {
      setIsLogin(true);

      fetchDataFromApi(`/api/user/user-details`).then((res) => {
        setUserData(res.data);
        if (res?.response?.data?.message === "You have not login") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setIsLogin(false);
          alertBox("error", "Your session is closed please login again")

          //window.location.href = "/login"
        }
      })

    } else {
      setIsLogin(false);
    }

  }, [isLogin])


  useEffect(() => {
    getCat();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };

  }, [])


  const getCat = () => {
    fetchDataFromApi("/api/category").then((res) => {
      setCatData(res?.data)
    })
  }


  const values = {
    isSidebarOpen,
    setisSidebarOpen,
    isLogin,
    setIsLogin,
    isOpenFullScreenPanel,
    setIsOpenFullScreenPanel,
    alertBox,
    setUserData,
    userData,
    setAddress,
    address,
    catData,
    setCatData,
    getCat,
    windowWidth,
    setSidebarWidth,
    sidebarWidth,
    setProgress,
    progress
  };

  return (
    <>
      <MyContext.Provider value={values}>
        <RouterProvider router={router} />
        <LoadingBar
          color="#1565c0"
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          className="topLoadingBar"
          height={3}
        />
        <Toaster />
      </MyContext.Provider>
    </>
  );
}

export default App;
export { MyContext };
