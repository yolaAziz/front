// import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { capturePayment } from "@/store/shop/order-slice";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useLocation } from "react-router-dom";

// function PaymobReturnPage() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const paymentId = params.get("id");
//   const payerId = params.get("owner");

//   useEffect(() => {
//     console.log("location:", location.search);
//     console.log("paymentId:", paymentId);
//     console.log("payerId:", payerId);

//     if (paymentId && payerId) {
//     const orderId = sessionStorage.getItem("currentOrderId"); // الحصول على orderId من sessionStorage
//     console.log("orderId:", orderId);
//       dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
//         if (data?.payload?.success) {
//           sessionStorage.removeItem("currentOrderId");
//           window.location.href = "/shop/payment-success";
//         }
//       });
//     }
//   }, [paymentId, payerId, dispatch]);
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Processing Payment...Please wait!</CardTitle>
//       </CardHeader>
//     </Card>
//   );
// }

// export default PaymobReturnPage;

// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useLocation } from "react-router-dom";
// import { capturePayment } from "@/store/shop/order-slice";

// function PaymobReturnPage() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const orderId = sessionStorage.getItem("currentOrderId");
// console.log('orderID', orderId);

// useEffect(() => {
//   console.log("Retrieved orderId from sessionStorage: ", orderId);

//   if (!orderId) {
//     console.log("No orderId in sessionStorage.");
//     return;
//   }

//   dispatch(capturePayment({ orderId }))
//     .then((data) => {
//       console.log("Dispatch response: ", data);
//       if (data?.payload?.success) {
//         sessionStorage.removeItem("currentOrderId");
//         window.location.href = "/shop/payment-success";
//       }
//     })
//     .catch(error => console.error("Error during dispatch: ", error));
// }, [dispatch, orderId]);

//   return (
//     <div>
//       Processing payment. Please wait...
//     </div>
//   );
// }

// export default PaymobReturnPage;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { capturePayment } from "@/store/shop/order-slice";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function PaymobReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentMethod = sessionStorage.getItem("paymentMethod"); // طريقة الدفع
  const orderId = sessionStorage.getItem("currentOrderId"); // رقم الطلب
  useEffect(() => {
    console.log("Payment method: ", paymentMethod);
    console.log("Order ID: ", orderId);

    if (!orderId) {
      console.error("No orderId found in sessionStorage.");
      return;
    }

    if (paymentMethod === "cod") {
      // معالجة الدفع عند الاستلام
      console.log("Processing COD payment...");
      dispatch(capturePayment({ orderId }))
        .then((data) => {
          if (data?.payload?.success) {
            sessionStorage.removeItem("currentOrderId");
            sessionStorage.removeItem("paymentMethod");
            window.location.href = "/shop/payment-success";
          }
        })
        .catch((error) =>
          console.error("Error during COD processing: ", error)
        );
    } else if (paymentMethod === "paymob") {
      const paymentId = params.get("id");
      const payerId = params.get("owner");

      console.log("Paymob Payment ID: ", paymentId);
      console.log("Paymob Payer ID: ", payerId);

      if (paymentId && payerId) {
        dispatch(capturePayment({ paymentId, payerId, orderId }))
          .then((data) => {
            if (data?.payload?.success) {
              sessionStorage.removeItem("currentOrderId");
              sessionStorage.removeItem("paymentMethod");
              window.location.href = "/shop/payment-success";
            }
          })
          .catch((error) =>
            console.error("Error during Paymob processing: ", error)
          );
      }
    } else {
      console.error("Invalid payment method.");
    }
  }, [paymentMethod, orderId, dispatch, params]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {paymentMethod === "cod"
            ? "Processing COD payment. Please wait..."
            : "Processing online payment. Please wait..."}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaymobReturnPage;
