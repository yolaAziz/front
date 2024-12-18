// import { useState } from "react";
// import CommonForm from "../common/form";
// import { DialogContent } from "../ui/dialog";
// import { Label } from "../ui/label";
// import { Separator } from "../ui/separator";
// import { Badge } from "../ui/badge";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   getAllOrdersForAdmin,
//   getOrderDetailsForAdmin,
//   updateOrderStatus,
// } from "@/store/admin/order-slice";
// import { useToast } from "../ui/use-toast";

// const initialFormData = {
//   status: "",
// };

// function AdminOrderDetailsView({ orderDetails }) {
//   const [formData, setFormData] = useState(initialFormData);
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

//   console.log(orderDetails?.cartItems, "Cart Items");

//   console.log(orderDetails, "orderDetailsorderDetails");

//   function handleUpdateStatus(event) {
//     event.preventDefault();
//     const { status } = formData;

//     dispatch(
//       updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
//     ).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(getOrderDetailsForAdmin(orderDetails?._id));
//         dispatch(getAllOrdersForAdmin());
//         setFormData(initialFormData);
//         toast({
//           title: data?.payload?.message,
//         });
//       }
//     });
//   }

//   console.log(orderDetails?.cartItems, "Cart Items");

//   return (
//     <DialogContent className="sm:max-w-[600px]">
//       <div className="grid gap-6">
//         <div className="grid gap-2">
//           <div className="flex mt-6 items-center justify-between">
//             <p className="font-medium">Order ID</p>
//             <Label>{orderDetails?._id}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Date</p>
//             <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Price</p>
//             <Label>{orderDetails?.totalAmount} EPG</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Payment method</p>
//             <Label>{orderDetails?.paymentMethod}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Payment Status</p>
//             <Label>{orderDetails?.paymentStatus}</Label>
//           </div>
//           <div className="flex mt-2 items-center justify-between">
//             <p className="font-medium">Order Status</p>
//             <Label>
//               <Badge
//                 className={`py-1 px-3 ${
//                   orderDetails?.orderStatus === "confirmed"
//                     ? "bg-green-500"
//                     : orderDetails?.orderStatus === "rejected"
//                     ? "bg-red-600"
//                     : "bg-black"
//                 }`}
//               >
//                 {orderDetails?.orderStatus}
//               </Badge>
//             </Label>
//           </div>
//         </div>
//         <Separator />
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <div className="font-medium">Order Details</div>
//             <ul className="grid gap-3">
//               {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
//                 ? orderDetails?.cartItems.map((item) => (
//                     <li className="flex items-center justify-between">
//                       <span>Title: {item.title}</span>
//                       <span>Quantity: {item.quantity}</span>
//                       <span>Color: {item.color}</span>
//                       <span>Price: {item?.price}</span>
//                       <span>Additional Details: {item.additionalDetails}</span>

//                     </li>
//                   ))
//                 : null}
//             </ul>
//           </div>
//         </div>
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <div className="font-medium">Shipping Info</div>
//             <div className="grid gap-0.5 text-muted-foreground">
//               <span>Name: {user.userName}</span>
//               <span>Address:  {orderDetails?.addressInfo?.address}</span>
//               <span>City :{orderDetails?.addressInfo?.city}</span>
//               <span>Phone : {orderDetails?.addressInfo?.phone}</span>
//               <span>Details : {orderDetails?.addressInfo?.notes}</span>
//             </div>
//           </div>
//         </div>

//         <div>
//           <CommonForm
//             formControls={[
//               {
//                 label: "Order Status",
//                 name: "status",
//                 componentType: "select",
//                 options: [
//                   { id: "pending", label: "Pending" },
//                   { id: "inProcess", label: "In Process" },
//                   { id: "inShipping", label: "In Shipping" },
//                   { id: "delivered", label: "Delivered" },
//                   { id: "rejected", label: "Rejected" },
//                   { id: "confirmed", label: "Confirmed" },
//                 ],
//               },
//             ]}
//             formData={formData}
//             setFormData={setFormData}
//             buttonText={"Update Order Status"}
//             onSubmit={handleUpdateStatus}
//           />
//         </div>
//       </div>
//     </DialogContent>
//   );
// }

// export default AdminOrderDetailsView;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import CommonForm from "../common/form";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);

  const handleUpdateStatus = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await dispatch(
        updateOrderStatus({
          id: orderDetails?._id,
          orderStatus: formData.status,
        })
      );

      if (response?.payload?.success) {
        await dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        await dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({ title: response?.payload?.message });
      } else {
        toast({ title: "فشل في تحديث الحالة" });
      }
    } catch (error) {
      toast({ title: "حدث خطأ أثناء التحديث" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[700px]" dir="rtl">
      <div className="grid gap-4">
        {/* بيانات الطلب الأساسية */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">رقم الطلب</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">تاريخ الطلب</p>
            <Label>{orderDetails?.orderDate?.split("T")[0]}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">السعر</p>
            <Label>{orderDetails?.totalAmount} جنيه</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">طريقة الدفع</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">حالة الدفع</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">حالة الطلب</p>
            <Badge
              className={`py-1 px-3 text-white ${
                orderDetails?.orderStatus === "confirmed"
                  ? "bg-green-500"
                  : orderDetails?.orderStatus === "rejected"
                  ? "bg-red-600"
                  : "bg-gray-500"
              }`}
            >
              {orderDetails?.orderStatus}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* تفاصيل الطلب مع التمرير */}
        <div className="overflow-auto max-h-[350px] border p-2 rounded-md">
          <div className="grid gap-2">
            {orderDetails?.cartItems?.length > 0 ? (
              orderDetails?.cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex grid grid-cols-2 flex-wrap justify-between border p-2 bg-gray-50 rounded-sm"
                >
                  <span>المنتج: {item.title}</span>
                  <span>الكمية: {item.quantity}</span>
                  <span>اللون: {item.color}</span>
                  <span>السعر: {item.price}</span>
                  <span>تفاصيل إضافية: {item.additionalDetails}</span>
                </div>
              ))
            ) : (
              <span>لا توجد عناصر في السلة</span>
            )}
          </div>
        </div>

        <Separator />

        {/* تفاصيل الشحن */}
        <div className="grid gap-2">
          <p className="font-medium">معلومات الشحن</p>
          <div className="grid grid-cols-2">
          <span>الاسم: {user?.userName}</span>
          <span>العنوان: {orderDetails?.addressInfo?.address}</span>
          <span>المدينة: {orderDetails?.addressInfo?.city}</span>
          <span>الهاتف: {orderDetails?.addressInfo?.phone}</span>
          <span>تفاصيل: {orderDetails?.addressInfo?.notes}</span>
          </div>

        </div>

        <Separator />

        {/* نموذج تحديث حالة الطلب */}
        <div className="max-w-[600px]">
          <CommonForm
            formControls={[
              {
                label: "حالة الطلب",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "قيد الانتظار" },
                  { id: "inProcess", label: "تحت المعالجة" },
                  { id: "inShipping", label: "قيد الشحن" },
                  { id: "delivered", label: "تم التسليم" },
                  { id: "rejected", label: "مرفوض" },
                  { id: "confirmed", label: "مؤكد" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={loading ? "يتم التحديث..." : "تحديث حالة الطلب"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
