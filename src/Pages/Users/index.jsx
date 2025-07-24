import React, { useContext, useState, useEffect } from 'react';
import { Button } from "@mui/material";
import { IoMdAdd } from "react-icons/io";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import SearchBox from '../../Components/SearchBox';
import { MyContext } from '../../App';
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { MdLocalPhone } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { deleteData, deleteMultipleData, fetchDataFromApi } from '../../utils/api';
import { FaCheckDouble } from "react-icons/fa6";

import CircularProgress from '@mui/material/CircularProgress';


const label = { inputProps: { "aria-label": "Checkbox demo" } };

const columns = [
    { id: "user", label: "USER", minWidth: 80 },
    {
        id: "userPh",
        label: "USER PHONE NO",
        minWidth: 130,
    },
    {
        id: "verifyemail",
        label: "Email Verify",
        minWidth: 130,
    },
    {
        id: "createdDate",
        label: "CREATED",
        minWidth: 130,
    },
    {
        id: "action",
        label: "ACTION",
        minWidth: 130,
    },
];

export const Users = () => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [userData, setUserData] = useState([]);
    const [userTotalData, setUserTotalData] = useState([]);
    const [isLoading, setIsloading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [sortedIds, setSortedIds] = useState([]);

    const context = useContext(MyContext);




    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };


    useEffect(() => {
        getUsers(page, rowsPerPage);
    }, [page, rowsPerPage])


    const getUsers = (page, limit) => {
        setIsloading(true);
        setPage(page);
        fetchDataFromApi(`/api/user/getAllUsers?page=${page + 1}&limit=${limit}`).then((res) => {
            setUserData(res)
            setUserTotalData(res)
            setIsloading(false)
        })
    }


    useEffect(() => {
        // Filter orders based on search query
        if (searchQuery !== "") {
            const filteredItems = userTotalData?.totalUsers?.filter((user) =>
                user._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user?.createdAt?.toLowerCase().includes(searchQuery.toLowerCase())

            );
            setUserData({
                error: false,
                success: true,
                users: filteredItems,
                total: filteredItems?.length,
                page: parseInt(page),
                totalPages: Math.ceil(filteredItems?.length / rowsPerPage),
                totalUsersCount: userData?.totalUsersCount
            })
        } else {
            getUsers(page, rowsPerPage);
        }

    }, [searchQuery])



    // Handler to toggle all checkboxes
    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;

        // Update all items' checked status
        const updatedItems = userData?.users?.map((item) => ({
            ...item,
            checked: isChecked,
        }));

        setUserData({
            error: false,
            success: true,
            users: updatedItems,
            total: updatedItems?.length,
            page: parseInt(page),
            totalPages: Math.ceil(updatedItems?.length / rowsPerPage),
            totalUsersCount: userData?.totalUsersCount
        })

        // Update the sorted IDs state
        if (isChecked) {
            const ids = updatedItems.map((item) => item._id).sort((a, b) => a - b);
            setSortedIds(ids);
        } else {
            setSortedIds([]);
        }
    };


    // Handler to toggle individual checkboxes
    const handleCheckboxChange = (e, id, index) => {

        const updatedItems = userData?.users?.map((item) =>
            item._id === id ? { ...item, checked: !item.checked } : item
        );

        setUserData({
            error: false,
            success: true,
            users: updatedItems,
            total: updatedItems?.length,
            page: parseInt(page),
            totalPages: Math.ceil(updatedItems?.length / rowsPerPage),
            totalUsersCount: userData?.totalUsersCount
        })


        // Update the sorted IDs state
        const selectedIds = updatedItems
            .filter((item) => item.checked)
            .map((item) => item._id)
            .sort((a, b) => a - b);
        setSortedIds(selectedIds);

    };


    const deleteMultiple = () => {
        if (context?.userData?.role === "ADMIN") {
            if (sortedIds.length === 0) {
                context.alertBox('error', 'Please select items to delete.');
                return;
            }


            try {
                deleteMultipleData(`/api/user/deleteMultiple`, {
                    data: { ids: sortedIds },
                }).then((res) => {
                    getUsers(page, rowsPerPage);
                    context.alertBox("success", "User deleted");
                    setSortedIds([]);

                })

            } catch (error) {
                context.alertBox('error', 'Error deleting items.');
            }
        } else {
            context.alertBox("error", "Only admin can delete data");
        }


    }


    const deleteUser = (id) => {
        if (context?.userData?.role === "ADMIN") {
            deleteData(`/api/user/deleteUser/${id}`).then((res) => {
                getUsers(page, rowsPerPage);
            })
        } else {
            context.alertBox("error", "Only admin can delete data");
        }
    }

    return (
        <>

            <div className="card my-2 pt-5 shadow-md sm:rounded-lg bg-white">

                <div className="flex items-center w-full px-5 pb-4 justify-beetween">
                    <div className="col w-[40%]">
                        <h2 className="text-[18px] font-[600]">
                            Users List
                        </h2>
                    </div>




                    <div className="col w-[40%] ml-auto flex items-center gap-3">
                        {
                            sortedIds?.length !== 0 && <Button variant="contained" className="btn-sm" size="small" color="error"
                                onClick={deleteMultiple}>Delete</Button>
                        }
                        <SearchBox
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    </div>

                </div>

                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Checkbox {...label} size="small"
                                        onChange={handleSelectAll}
                                        checked={userData?.users?.length > 0 ? userData?.users?.every((item) => item.checked) : false}
                                    />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        <span className="whitespace-nowrap"> {column.label}</span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                isLoading === false ? userData?.users?.length !== 0 &&
                                    userData?.users?.map((user, index) => {
                                        return (
                                            <TableRow key={index} className={user.checked === true ? '!bg-[#1976d21f]' : ''}>
                                                <TableCell style={{ minWidth: columns.minWidth }}>
                                                    <Checkbox {...label} size="small" checked={user.checked === true ? true : false}
                                                        onChange={(e) => handleCheckboxChange(e, user._id, index)}
                                                    />
                                                </TableCell>
                                                <TableCell style={{ minWidth: columns.minWidth }}>
                                                    <div className="flex items-center gap-4 w-[300px]">
                                                        <div class="img w-[45px] h-[45px] rounded-md overflow-hidden group">

                                                                <img
                                                                    src={user?.avatar !== "" && user?.avatar !== undefined ? user?.avatar : '/user.jpg'}
                                                                    class="w-full group-hover:scale-105 transition-all"
                                                                />
                                                          
                                                        </div>


                                                        <div className="info flex flex-col gap-1">
                                                            <span className="font-[500]"> {user?.name}</span>
                                                            <div className="flex items-center gap-1">
                                                                <span className="flex items-center gap-2 w-[200px]"> <span><MdOutlineMarkEmailRead size={15} /> </span>{user?.email?.substr(0,5)+'***'}</span>


                                                            </div>
                                                        </div>

                                                    </div>
                                                </TableCell>

                                                <TableCell style={{ minWidth: columns.minWidth }}>

                                                    <span className="flex items-center gap-2"> <MdLocalPhone />  {user?.mobile === null ? 'NONE' : user?.mobile}</span>
                                                </TableCell>


                                                <TableCell style={{ minWidth: columns.minWidth }}>
                                                    {
                                                        user?.verify_email === false ?
                                                            <span
                                                                className={`inline-block py-1 px-4 rounded-full text-[11px] capitalize bg-red-500  text-white font-[500]`}
                                                            >
                                                                Not Verify
                                                            </span>

                                                            :

                                                            <span
                                                                className={`inline-flex items-center justify-center gap-1 py-1 px-4 rounded-full text-[11px] capitalize bg-green-500 text-white font-[500]`}
                                                            >
                                                                <FaCheckDouble /> Verifyed
                                                            </span>


                                                    }
                                                </TableCell>

                                                <TableCell style={{ minWidth: columns.minWidth }}>
                                                    <span className="flex items-center gap-2"> <SlCalender />  {user?.createdAt?.split("T")[0]}</span>
                                                </TableCell>

                                                <TableCell style={{ minWidth: columns.minWidth }}>
                                                    <Button onClick={() => deleteUser(user?._id)} variant="outlined" color="error" size="small">Delete</Button>
                                                </TableCell>

                                            </TableRow>
                                        )
                                    })

                                    :

                                    <>
                                        <TableRow>
                                            <TableCell colspan={8}>
                                                <div className="flex items-center justify-center w-full min-h-[400px]">
                                                    <CircularProgress color="inherit" />
                                                </div>
                                            </TableCell>
                                        </TableRow>

                                    </>
                            }

                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[50, 100, 150, 200]}
                    component="div"
                    count={userData?.totalPages * rowsPerPage}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div >


        </>
    )
}

export default Users;
