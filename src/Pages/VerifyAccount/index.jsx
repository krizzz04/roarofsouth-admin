import { Button } from "@mui/material";
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import OtpBox from "../../Components/OtpBox";
import { useContext } from "react";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from "react";

const VerifyAccount = () => {

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(MyContext);
  const history = useNavigate();

  useEffect(() => {
    fetchDataFromApi("/api/logo").then((res) => {
      localStorage.setItem('logo', res?.logo[0]?.logo)
    })
  }, [])

  const handleOtpChange = (value) => {
    setOtp(value);
  };


  const verityOTP = (e) => {
    e.preventDefault();


    if (otp !== "") {
      setIsLoading(true)
      const actionType = localStorage.getItem("actionType");
      if (actionType !== "forgot-password") {

        postData("/api/user/verifyEmail", {
          email: localStorage.getItem("userEmail"),
          otp: otp
        }).then((res) => {
          if (res?.error === false) {
            context.alertBox("success", res?.message);
            localStorage.removeItem("userEmail")
            setIsLoading(false)
            history("/login")
          } else {
            context.alertBox("error", res?.message);
            setIsLoading(false)
          }
        })
      }

      else {
        postData("/api/user/verify-forgot-password-otp", {
          email: localStorage.getItem("userEmail"),
          otp: otp
        }).then((res) => {
          if (res?.error === false) {
            context.alertBox("success", res?.message);
            history("/change-password")
          } else {
            context.alertBox("error", res?.message);
            setIsLoading(false)
          }
        })
      }
    }
    else {
      context.alertBox("error", "Please enter OTP");
    }

  }


  return (
    <section className="bg-white w-full h-[100vh]">
      <header className="w-full static lg:fixed top-0 left-0  px-4 py-3 flex items-center justify-center sm:justify-between z-50">
        <Link to="/">
          <img
            src={localStorage.getItem('logo')}
            className="w-[200px]"
          />
        </Link>

        <div className="hidden sm:flex items-center gap-0">
          <NavLink to="/login" exact={true} activeClassName="isActive">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
              <CgLogIn className="text-[18px]" /> Login
            </Button>
          </NavLink>

          <NavLink to="/sign-up" exact={true} activeClassName="isActive">
            <Button className="!rounded-full !text-[rgba(0,0,0,0.8)] !px-5 flex gap-1">
              <FaRegUser className="text-[15px]" /> Sign Up
            </Button>
          </NavLink>
        </div>
      </header>
      <img src="/patern.webp" className="w-full fixed top-0 left-0 opacity-5" />

      <div className="loginBox card w-full md:w-[600px] h-[auto] pb-20 mx-auto pt-5 lg:pt-20 relative z-50">
        <div className="text-center">
          <img src="/verify3.png" className="w-[100px] m-auto" />
        </div>

        <h1 className="text-center text-[18px] sm:text-[35px] font-[800] mt-4">
          Welcome Back!
          <br />
          Please Verify your Email
        </h1>

        <br />
        <p className="text-center text-[15px]">OTP send to  &nbsp;
          <span className="text-primary font-bold text-[12px] sm:text-[14px]">{localStorage.getItem("userEmail")}</span></p>

        <br />

        <form onSubmit={verityOTP}>
          <div className="text-center flex items-center justify-center flex-col">
            <OtpBox length={6} onChange={handleOtpChange} />
          </div>

          <br />

          <div className="w-[100%] px-3 sm:w-[300px] sm:px-0 m-auto">
            <Button type="submit" className="btn-blue w-full">

              {
                isLoading === true ? <CircularProgress color="inherit" />
                  :
                  'Verify OTP'
              }
            </Button>
          </div>

        </form>

        <br />


      </div>
    </section>
  );
};

export default VerifyAccount;
