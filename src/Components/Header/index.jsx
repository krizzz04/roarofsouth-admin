import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

import { RiMenu2Line } from "react-icons/ri";

import { FaRegBell } from "react-icons/fa";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { FaRegUser } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from "../../App";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import AddProduct from "../../Pages/Products/addProduct";
import AddHomeSlide from "../../Pages/HomeSliderBanners/addHomeSlide";
import AddCategory from "../../Pages/Categegory/addCategory";
import AddSubCategory from "../../Pages/Categegory/addSubCategory";
import AddAddress from "../../Pages/Address/addAddress";
import EditCategory from "../../Pages/Categegory/editCategory";



import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { IoMdClose } from "react-icons/io";
import Slide from '@mui/material/Slide';
import EditProduct from "../../Pages/Products/editProduct";
import { AddBannerV1 } from "../../Pages/Banners/addBannerV1";
import { EditBannerV1 } from "../../Pages/Banners/editBannerV1";
import { BannerList2_AddBanner } from "../../Pages/Banners/bannerList2_AddBanner";
import { BannerList2_Edit_Banner } from "../../Pages/Banners/bannerList2_Edit_Banner";
import AddBlog from "../../Pages/Blog/addBlog";
import EditBlog from "../../Pages/Blog/editBlog";
import EditHomeSlide from "../../Pages/HomeSliderBanners/editHomeSlide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));


const Header = () => {
  const [anchorMyAcc, setAnchorMyAcc] = React.useState(null);
  const openMyAcc = Boolean(anchorMyAcc);


  const history = useNavigate();

  const handleClickMyAcc = (event) => {
    setAnchorMyAcc(event.currentTarget);
  };
  const handleCloseMyAcc = () => {
    setAnchorMyAcc(null);
  };

  const context = useContext(MyContext);

  const location = useLocation();

  useEffect(() => {

    fetchDataFromApi("/api/logo").then((res) => {
      localStorage.setItem('logo', res?.logo[0]?.logo)
    })


    const token = localStorage.getItem('accessToken');

    if (token !== undefined && token !== null && token !== "") {
      const url = window.location.href
      history(location.pathname)
    } else {
      history("/login")
    }

  }, [context?.isLogin]);


  const logout = () => {
    setAnchorMyAcc(null);

    fetchDataFromApi(`/api/user/logout?token=${localStorage.getItem('accessToken')}`, { withCredentials: true }).then((res) => {
      if (res?.error === false) {
        context.setIsLogin(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        history("/login")
      }
    })
  }

  return (
    <>
      <header
        className={`w-full h-[auto] py-2 ${context.isSidebarOpen === true ? "pl-[22%]" : "pl-5"
          } ${context.isSidebarOpen === true && context?.windowWidth < 992 && '!pl-80'} shadow-md pr-7 bg-[#fff]  flex items-center justify-between transition-all fixed top-0 left-0 z-[50]`}
      >
        <div className="part1 flex items-center gap-4">

          {
            context.isSidebarOpen === false && context?.windowWidth > 992 &&
            <div className="col"
              onClick={() => {
                context?.windowWidth < 992 && context?.setisSidebarOpen(false)
              }}
            >
              <Link to="/">
                <img
                  src={localStorage.getItem('logo')}
                  className="w-[170px] md:w-[200px]"
                />
              </Link>
            </div>
          }



          <Button
            className="!w-[40px] !h-[40px] !rounded-full !min-w-[40px] !text-[rgba(0,0,0,0.8)]"
            onClick={() => context.setisSidebarOpen(!context.isSidebarOpen)}
          >
            <RiMenu2Line className="text-[18px] text-[rgba(0,0,0,0.8)]" />
          </Button>
        </div>

        <div className="part2  flex items-center justify-end gap-5">
          <IconButton aria-label="cart">
            <StyledBadge badgeContent={4} color="secondary">
              <FaRegBell />
            </StyledBadge>
          </IconButton>

          {context.isLogin === true ? (
            <div className="relative">
              <div
                className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer"
                onClick={handleClickMyAcc}
              >
                {
                  context?.userData?.avatar !== "" && context?.userData?.avatar !== null && context?.userData?.avatar !== undefined ?
                    <img
                      src={context?.userData?.avatar}
                      className="w-full h-full object-cover"
                    />

                    :

                    <img
                      src="/user.jpg"
                      className="w-full h-full object-cover"
                    />

                }

              </div>

              <Menu
                anchorEl={anchorMyAcc}
                id="account-menu"
                open={openMyAcc}
                onClose={handleCloseMyAcc}
                onClick={handleCloseMyAcc}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleCloseMyAcc} className="!bg-white">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full w-[35px] h-[35px] overflow-hidden cursor-pointer">
                      {
                        context?.userData?.avatar !== "" && context?.userData?.avatar !== null && context?.userData?.avatar !== undefined ?
                          <img
                            src={context?.userData?.avatar}
                            className="w-full h-full object-cover"
                          />

                          :

                          <img
                            src="/user.jpg"
                            className="w-full h-full object-cover"
                          />

                      }
                    </div>

                    <div className="info">
                      <h3 className="text-[15px] font-[500] leading-5">
                        {context?.userData?.name}
                      </h3>
                      <p className="text-[12px] font-[400] opacity-70">
                        {context?.userData?.email}
                      </p>
                    </div>
                  </div>
                </MenuItem>
                <Divider />

                <Link to="/profile">
                  <MenuItem
                    onClick={handleCloseMyAcc}
                    className="flex items-center gap-3"
                  >
                    <FaRegUser className="text-[16px]" />{" "}
                    <span className="text-[14px]">Profile</span>
                  </MenuItem>
                </Link>

                <MenuItem
                  onClick={logout}
                  className="flex items-center gap-3"
                >
                  <IoMdLogOut className="text-[18px]" />{" "}
                  <span className="text-[14px]">Sign Out</span>
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Link to="/login">
              <Button className="btn-blue btn-sm !rounded-full">Sign In</Button>
            </Link>
          )}
        </div>
      </header>





      <Dialog
        fullScreen
        open={context?.isOpenFullScreenPanel.open}
        onClose={() => context?.setIsOpenFullScreenPanel({
          open: false
        })}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => context?.setIsOpenFullScreenPanel({
                open: false
              })}
              aria-label="close"
            >
              <IoMdClose className="text-gray-800" />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              <span className="text-gray-800">{context?.isOpenFullScreenPanel?.model}</span>
            </Typography>

          </Toolbar>
        </AppBar>


        {
          context?.isOpenFullScreenPanel?.model === "Add Product" && <AddProduct />
        }


        {
          context?.isOpenFullScreenPanel?.model === "Add Home Slide" && <AddHomeSlide />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Edit Home Slide" && <EditHomeSlide />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Add New Category" && <AddCategory />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Add New Sub Category" && <AddSubCategory />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Add New Address" && <AddAddress />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Edit Category" && <EditCategory />
        }


        {
          context?.isOpenFullScreenPanel?.model === "Edit Product" && <EditProduct />
        }


        {
          context?.isOpenFullScreenPanel?.model === "Add Home Banner List 1" && <AddBannerV1 />
        }


        {
          context?.isOpenFullScreenPanel?.model === "Edit BannerV1" && <EditBannerV1 />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Add Home Banner List2" && <BannerList2_AddBanner />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Edit bannerList2" && <BannerList2_Edit_Banner />
        }


        {
          context?.isOpenFullScreenPanel?.model === "Add Blog" && <AddBlog />
        }

        {
          context?.isOpenFullScreenPanel?.model === "Edit Blog" && <EditBlog />
        }


      </Dialog>

    </>
  );
};

export default Header;
