import React, { useContext, useState } from 'react';
import { FaRegImages } from "react-icons/fa6";
import { uploadImage, uploadImages } from '../../utils/api.js';
import { MyContext } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';


const UploadBox = (props) => {
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);

    const context = useContext(MyContext);

    let selectedImages = [];

    const formdata = new FormData();

    const onChangeFile = async (e, apiEndPoint) => {

        try {
            setPreviews([]);
            const files = e.target.files;

            setUploading(true);


            for (var i = 0; i < files.length; i++) {

                if (files[i] && (files[i].type === "image/jpeg" || files[i].type === "image/jpg" ||
                    files[i].type === "image/png" ||
                    files[i].type === "image/webp" ||  files[i].type === "image/svg+xml")
                ) {

                    const file = files[i];

                    selectedImages.push(file);
                    formdata.append(props?.name, file);


                } else {
                    context.alertBox("error", "Please select a valid JPG , PNG or webp image file.");
                    setUploading(false);
                    return false;
                }
            }

            uploadImages(apiEndPoint, formdata).then((res) => {
                setUploading(false);
                //props.setPreviews(res?.data?.images)
               // setPreviews((prevItems) => [...prevItems, res?.data?.images]);
                props.setPreviewsFun(res?.data?.images);
            })

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className='uploadBox p-3 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>

            {
                uploading === true ? <>
                <CircularProgress />
                <h4 className="text-center">Uploading...</h4>
                </> :
                    <>
                        <FaRegImages className='text-[40px] opacity-35 pointer-events-none' />
                        <h4 className='text-[14px] pointer-events-none'>Image Upload</h4>

                        <input type="file" accept='image/*' multiple={props.multiple !== undefined ? props.multiple : false} className='absolute top-0 left-0 w-full h-full z-50 opacity-0'
                            onChange={(e) =>
                                onChangeFile(e, props?.url)
                            }
                            name={props?.name}
                        />

                    </>

            }


        </div>
    )
}


export default UploadBox;