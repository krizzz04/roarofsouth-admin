import React, { useState, useContext, useEffect } from 'react';
import { Button } from '@mui/material';
import { FaCloudUploadAlt } from "react-icons/fa";
import { AiOutlineEdit } from "react-icons/ai";
import { GoTrash } from "react-icons/go";

import { MyContext } from '../../App';
import { fetchDataFromApi, postData, deleteData, editData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';


const AddWeight = () => {

    const [name, setName] = useState();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [editId, seteditId] = useState('');

    const context = useContext(MyContext);

    useEffect(() => {
        getData()
    }, [])


   const getData=()=>{
    fetchDataFromApi("/api/product/productWeight/get").then((res) => {
        if (res?.error === false) {
            setData(res?.data);
        }
    })
   }


    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        if (name === "") {
            context.alertBox("error", "Please enter product RAM");
            return false;
        }


        if(editId===""){

            postData(`/api/product/productWeight/create`, {
                name: name
            }).then((res) => {
                if(res?.error===false){
                    context.alertBox("success", res?.message);
                   setTimeout(()=>{
                    setIsLoading(false);
                    getData();
                    setName("");
                   },[300])
                  
                }else{
                    context.alertBox("error", res?.message);
                }
              
            })
    
        }

    
        if(editId!==""){
            editData(`/api/product/productWeight/${editId}`, {
                name: name
            }).then((res) => {
          
                if(res?.data?.error===false){
                    context.alertBox("success", res?.data?.message);
                   setTimeout(()=>{
                    setIsLoading(false);
                    getData();
                    setName("");
                    seteditId("");
                   },[300])
                  
                }else{
                    context.alertBox("error", res.data?.message);
                }
              
            })
    
        }


    }


    const deleteItem = (id) => {
        deleteData(`/api/product/productWeight/${id}`).then((res) => {
            getData();
            context.alertBox("success", "Item deleted");

        })
    }

    const editItem=(id)=>{
        fetchDataFromApi(`/api/product/productWeight/${id}`).then((res)=>{
            setName(res?.data?.name)
            seteditId(res?.data?._id);
        })
    }

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <h2 className="text-[18px] font-[600]">
                    Add Product WEIGHT
                </h2>
            </div>

            <div className="card my-4 pt-5 pb-5 shadow-md sm:rounded-lg bg-white w-[100%] sm:w-[100%] lg:w-[65%]">
                <form className='form py-3 p-6' onSubmit={handleSubmit}>
                    <div className='col mb-4'>
                        <h3 className='text-[14px] font-[500] mb-1 text-black'>PRODUCT WEIGHT</h3>
                        <input type="text" className='w-full h-[40px] border border-[rgba(0,0,0,0.2)] focus:outline-none focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm' name="name" onChange={(e) => setName(e.target.value)} value={name} />
                    </div>

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

                </form>
            </div>


            {
                data?.length !== 0 &&
                <div className="card my-4 pt-5 pb-5 shadow-md sm:rounded-lg bg-white w-[100%] sm:w-[100%] lg:w-[65%]">
                    <div className="relative overflow-x-auto mt-5 pb-5">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                   
                                    <th scope="col" className="px-6 py-3 whitespace-nowrap" width="60%">
                                        PRODUCT WEIGHT
                                    </th>

                                    <th scope="col" className="px-6 py-3 whitespace-nowrap" width="30%">
                                        ACTION
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.map((item, index) => {
                                        return <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" key={index}>
                                           

                                            <td className="px-6 py-2">
                                               <span className="font-[600]"> {item?.name}</span>
                                            </td>

                                            <td className="px-6 py-2">
                                                <div className="flex items-center gap-1">
                                                    <Button className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]" onClick={()=>editItem(item?._id)}>
                                                        <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                                    </Button>



                                                    <Button className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]" onClick={()=>deleteItem(item?._id)}>
                                                        <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                    </Button>
                                                </div>
                                            </td>

                                        </tr>
                                    })
                                }



                            </tbody>
                        </table>
                    </div>
                </div>

            }


        </>
    )
}

export default AddWeight;
