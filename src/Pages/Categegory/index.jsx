import React, { useContext, useEffect, useState } from 'react';
import { Button } from "@mui/material";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { FaRegEye } from "react-icons/fa6";
import { GoTrash } from "react-icons/go";
import { MyContext } from '../../App';
import { fetchDataFromApi, deleteData } from '../../utils/api';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";



const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
    { id: "image", label: "IMAGE", minWidth: 150 },
    { id: "catName", label: "CATEGORY NAME", minWidth: 150 },
    { id: "action", label: "Action", minWidth: 100 },
];

export const CategoryList = () => {
    const [categoryFilterVal, setcategoryFilterVal] = React.useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const context = useContext(MyContext);

    useEffect(() => {
        context?.setProgress(50);
        fetchDataFromApi("/api/category").then((res) => {
            context?.setCatData(res?.data)
            context?.setProgress(100);
        })
    }, [context?.isOpenFullScreenPanel])

    const handleChangeCatFilter = (event) => {
        setcategoryFilterVal(event.target.value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const deleteCat = (id) => {
        if (context?.userData?.role === "ADMIN") {
            deleteData(`/api/category/${id}`).then((res) => {
                fetchDataFromApi("/api/category").then((res) => {
                    context?.setCatData(res?.data)
                })
            })
        } else {
            context.alertBox("error", "Only admin can delete data");
        }
    }

    return (
        <>

            <div className="flex items-center justify-between px-2 py-0 mt-1">
                <h2 className="text-[18px] font-[600]">
                    Category List
                </h2>

                <div className="col w-[40%] ml-auto flex items-center justify-end gap-3">

                    <Button className="btn-blue btn !text-white btn-sm" onClick={() => context.setIsOpenFullScreenPanel({
                        open: true,
                        model: 'Add New Category'
                    })}>Add Category</Button>
                </div>


            </div>


            <div className="card my-4 pt-5 shadow-md sm:rounded-lg bg-white">

                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>

                                {columns.map((column) => (
                                    <TableCell
                                        width={column.minWidth}
                                        key={column.id}
                                        align={column.align}

                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                context?.catData?.length !== 0 && context?.catData?.map((item, index) => {
                                    return (
                                        <TableRow key={index}>

                                            <TableCell width={100}>
                                                <div className="flex items-center gap-4 w-[50px]">
                                                    <div class="img w-full rounded-md overflow-hidden group">
                                                        <Link to="/product/45745" data-discover="true">
                                                            <LazyLoadImage
                                                                alt={"image"}
                                                                effect="blur"
                                                                className="w-full group-hover:scale-105 transition-all"
                                                                src={item.images[0]}
                                                            />

                                                        </Link>
                                                    </div>

                                                </div>
                                            </TableCell>

                                            <TableCell width={100}>
                                                {item?.name}
                                            </TableCell>

                                            <TableCell width={100}>
                                                <div className="flex items-center gap-1">
                                                    <Button className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]"
                                                        onClick={() => context.setIsOpenFullScreenPanel({
                                                            open: true,
                                                            model: 'Edit Category',
                                                            id: item?._id
                                                        })}
                                                    >
                                                        <AiOutlineEdit className="text-[rgba(0,0,0,0.7)] text-[20px] " />
                                                    </Button>


                                                    <Button className="!w-[35px] !h-[35px] bg-[#f1f1f1] !border !border-[rgba(0,0,0,0.4)] !rounded-full hover:!bg-[#f1f1f1] !min-w-[35px]"
                                                        onClick={() => deleteCat(item?._id)}>
                                                        <GoTrash className="text-[rgba(0,0,0,0.7)] text-[18px] " />
                                                    </Button>
                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    )
                                })
                            }




                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={10}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>


        </>
    )
}

export default CategoryList;
