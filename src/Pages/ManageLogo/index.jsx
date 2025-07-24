import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@mui/material';
import { FaCloudUploadAlt } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";

import { MyContext } from '../../App';
import { fetchDataFromApi, postData, deleteData, editData, deleteImages } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import UploadBox from '../../Components/UploadBox';
import { IoMdClose } from "react-icons/io";

const ManageLogo = () => {

    const [formFields, setFormFields] = useState({
        logo: "",
    })

    const [isLoading, setIsLoading] = useState(false);

    const [previews, setPreviews] = useState([]);
    const [logoId, setLogoId] = useState([]);
    const [editMode, setEditMode] = useState(false);

    const context = useContext(MyContext);


    useEffect(() => {
        fetchDataFromApi(`/api/logo`).then((res) => {
            const imgArr = [];
            for (let i = 0; i < res?.logo.length; i++) {
                imgArr.push(res?.logo[i]?.logo)
            }


            if (imgArr?.length > 0) {
                setEditMode(true);
                setLogoId(res?.logo[0]?._id)
            } else {
                setEditMode(false);
            }

            setPreviews([])
            setTimeout(() => {
                setPreviews(imgArr)
                formFields.logo = imgArr[0]
            }, 10);
        })
    }, []);


    const setPreviewsFun = (previewsArr) => {
        const imgArr = previews;
        for (let i = 0; i < previewsArr.length; i++) {
            imgArr.push(previewsArr[i])
        }

        setPreviews([])
        setTimeout(() => {
            setPreviews(imgArr)
            formFields.logo = imgArr[0]
        }, 10);
    }



    const removeImg = (image, index) => {
        if (context?.userData?.role === "ADMIN") {
            var imageArr = [];
            imageArr = previews;
            deleteImages(`/api/logo/deteleImage?img=${image}`).then((res) => {
                imageArr.splice(index, 1);

                setPreviews([]);
                setTimeout(() => {
                    setPreviews(imageArr);
                    formFields.logo = imageArr[0]
                }, 100);

            })
        } else {
            context.alertBox("error", "Only admin can delete data");
        }
    }


    const addLogo = (e) => {
        e.preventDefault();

        if (previews?.length === 0) {
            context.alertBox("error", "Please select logo");
            setIsLoading(false);
            return false
        }


        if (editMode === true) {
            editData(`/api/logo/${logoId}`, formFields).then((res) => {
                context.alertBox("success", "logo updated successfully");
                setTimeout(() => {
                    setIsLoading(false);
                }, 2500);
            })
        } else {
            postData(`/api/logo/add`, formFields).then((res) => {
                setLogoId(res?.logo?._id)
                context.alertBox("success", "Logo add successfully");
                setTimeout(() => {
                    setIsLoading(false);
                    setEditMode(true);
                }, 2500);
            })
        }


    }


    return (
        <>
            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <h2 className="text-[18px] font-[600]">
                    Manage Logo
                </h2>
            </div>

            <form className='form py-1  md:p-3 md:py-1' onSubmit={addLogo}>
                <div className="card my-4 pt-5 pb-5 shadow-md sm:rounded-lg bg-white w-[100%] sm:w-[100%] lg:w-[65%] p-5">


                    {
                        previews?.length !== 0 && previews?.map((image, index) => {
                            return (
                                <div className="uploadBoxWrapper w-[150px] mr-3 relative" key={index}>

                                    <span className='absolute w-[20px] h-[20px] rounded-full  overflow-hidden bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer' onClick={() => removeImg(image, index)}><IoMdClose className='text-white text-[17px]' /></span>


                                    <div className='uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>

                                        <img src={image} className='w-100' />
                                    </div>
                                </div>
                            )
                        })
                    }


                    {
                        previews?.length === 0 &&
                        <div className='w-[150px]'>
                            <UploadBox multiple={false} name="images" url="/api/logo/uploadImages" setPreviewsFun={setPreviewsFun} />
                        </div>
                    }





                    <br />

                    <Button type="submit" className="btn-blue btn-lg w-full flex gap-2">
                        {
                            isLoading === true ? <CircularProgress color="inherit" />
                                :
                                <>
                                    <FaCloudUploadAlt className='text-[25px] text-white' />
                                    Publish and View
                                </>
                        }
                    </Button>


                </div>
            </form>

        </>
    )
}

export default ManageLogo;
