// import ProductImageUpload from "@/components/admin-view/image-upload";
// import { Button } from "@/components/ui/button";
// import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// function AdminDashboard() {
//   const [imageFile, setImageFile] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState("");
//   const [imageLoadingState, setImageLoadingState] = useState(false);
//   const dispatch = useDispatch();
//   const { featureImageList } = useSelector((state) => state.commonFeature);

//   console.log(uploadedImageUrl, "uploadedImageUrl");

//   function handleUploadFeatureImage() {
//     dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(getFeatureImages());
//         setImageFile(null);
//         setUploadedImageUrl("");

//       }
//     });
//   }

//   useEffect(() => {
//     dispatch(getFeatureImages());
//   }, [dispatch]);

//   function handleRemoveImage() {
//     dispatch(deleteFeatureImage(uploadedImageUrl)).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(getFeatureImages());
//         setImageFile(null);
//         setUploadedImageUrl("");

//       }
//     });
//   }

//   console.log(featureImageList, "featureImageList");

//   return (
//     <div>
//       <ProductImageUpload
//         imageFile={imageFile}
//         setImageFile={setImageFile}
//         uploadedImageUrl={uploadedImageUrl}
//         setUploadedImageUrl={setUploadedImageUrl}
//         setImageLoadingState={setImageLoadingState}
//         imageLoadingState={imageLoadingState}
//         isCustomStyling={true}
//         // isEditMode={currentEditedId !== null}
//       />
//       <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
//         Upload
//       </Button>
//       <div className="flex flex-col gap-4 mt-5">
//         {featureImageList && featureImageList.length > 0
//           ? featureImageList.map((featureImgItem) => (
//               <div className="relative">
//                 <img
//                   src={featureImgItem.image}
//                   className="w-full h-[300px] object-cover rounded-t-lg"
//                 />
//                   <Button className='mt-3 mb-3' onClick={handleRemoveImage}>Delete</Button>

//               </div>
//             ))
//           : null}
//       </div>

//     </div>
//   );
// }

// export default AdminDashboard;

// import ProductImageUpload from "@/components/admin-view/image-upload";
// import { Button } from "@/components/ui/button";
// import {
//   addFeatureImage,
//   deleteFeatureImage,
//   getFeatureImages,
// } from "@/store/common-slice";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// function AdminDashboard() {
//   const [uploadedImages, setUploadedImages] = useState([]); // للحالة الخاصة بالصور المرفوعة
//   const [imageLoadingState, setImageLoadingState] = useState(false);
//   const dispatch = useDispatch();
//   const { featureImageList } = useSelector((state) => state.commonFeature);

//   // رفع الصور بعد تحميلها من الواجهة الأمامية
//   async function handleUploadFeatureImage() {
//     if (uploadedImages.length === 0) return alert("Select image");
//     setImageLoadingState(true);

//     try {
//       // إرسال الصور إلى الخوادم
//       dispatch(addFeatureImage(uploadedImages.join(","))).then((data) => {
//         if (data?.payload?.success) {
//           dispatch(getFeatureImages());
//           setUploadedImages([]);
//           alert("Done!");
//         } else {
//           alert("Error");
//         }
//       });
//     } catch (error) {
//       console.error("Error during upload:", error);
//       alert("Error Try again");
//     } finally {
//       setImageLoadingState(false);
//     }
//   }

//   useEffect(() => {
//     dispatch(getFeatureImages());
//   }, [dispatch]);

//   function handleRemoveImage(imageUrl) {
//     if (!imageUrl) return alert("empty");
//     dispatch(deleteFeatureImage(imageUrl)).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(getFeatureImages());
//         alert("Deleted successfully");
//       } else {
//         alert("Error");
//       }
//     });
//   }

//   return (
//     <div className="w-full">
//       {/* واجهة رفع الصور */}
//       <ProductImageUpload className='w-full'
//         uploadedImages={uploadedImages}
//         setUploadedImages={setUploadedImages}
//         imageLoadingState={imageLoadingState}
//         setImageLoadingState={setImageLoadingState}
//         isCustomStyling={true}
//       />
//       {/* زر لرفع الصور المجمعة */}
//       <Button
//         onClick={handleUploadFeatureImage}
//         className="mt-5 w-full"
//         disabled={imageLoadingState}
//       >
//         {imageLoadingState ? "Uploading..." : "Upload"}
//       </Button>
//       {/* استعراض الصور الحالية في المعرض */}
//       <div className="flex flex-col gap-4 mt-5">
//         {featureImageList?.length > 0 ? (
//           featureImageList.map((featureImgItem) => (
//             <div className="relative" key={featureImgItem._id}>
//               <img
//                 src={featureImgItem.image}
//                 className="w-full h-[300px] object-cover rounded-lg"
//               />
//               <Button
//                 className="mt-3 mb-3 bg-red-500 text-white"
//                 onClick={() => handleRemoveImage(featureImgItem.image)}
//               >
//                 Delete image!
//               </Button>
//             </div>
//           ))
//         ) : (
//           <div>zero images</div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;

import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  deleteFeatureImage,
  getFeatureImages,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  // رفع الصور بعد تحميلها
  async function handleUploadFeatureImage() {
    if (uploadedImages.length === 0) return alert("Select image");
    setImageLoadingState(true);

    try {
      dispatch(addFeatureImage(uploadedImages.join(","))).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
          setUploadedImages([]);
          alert("Done");
        } else {
          alert("Error");
        }
      });
    } catch (error) {
      console.error("Error during upload:", error);
      alert("Error");
    } finally {
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  // حذف الصورة بناءً على ال URL المُحدد
  function handleRemoveImage(imageId) {
    console.log("Removing Image with ID:", imageId); // Debugging
  
    // التحقق من وجود الصورة ضمن القائمة
    const imageExists = featureImageList.some((img) => img._id === imageId);
    if (!imageExists) {
      alert("there's no image");
      return;
    }
  
    // تنفيذ عملية الحذف
    dispatch(deleteFeatureImage(imageId))
      .then((data) => {
        console.log("Delete Response:", data); // Debugging Response
        if (data?.payload?.success) {
          alert("Image deleted successfully");
          dispatch(getFeatureImages()); // تحديث القائمة
        } else {
          alert("Error");
        }
      })
      .catch((error) => console.error("Error deleting image:", error));
  }
  
  useEffect(() => {
    dispatch(getFeatureImages()).then((data) => {
      console.log("Updated Feature Image List:", data.payload); // Debugging
    });
  }, [dispatch]);
  

  return (
    <div>
      {/* واجهة رفع الصور */}
      <ProductImageUpload
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        imageLoadingState={imageLoadingState}
        setImageLoadingState={setImageLoadingState}
        isCustomStyling={true}
      />
      {/* زر لرفع الصور */}
      <Button
        onClick={handleUploadFeatureImage}
        className="mt-5 w-full"
        disabled={imageLoadingState}
      >
        {imageLoadingState ? "Uploading" : "Upload"}
      </Button>
      {/* استعراض الصور الحالية في المعرض */}
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList?.length > 0 ? (
          featureImageList.map((featureImgItem) => (
            <div className="relative" key={featureImgItem._id}>
              <img
                src={featureImgItem.image}
                alt={`Image ${featureImgItem._id}`}
                className="w-full h-[300px] object-cover rounded-lg"
              />
              <Button
                className="mt-3 mb-3 bg-red-500 text-white"
                onClick={() => handleRemoveImage(featureImgItem._id)} // تمرير _id فقط
              >
                Delete image!
              </Button>
            </div>
          ))
        ) : (
          <div>Zero images</div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
