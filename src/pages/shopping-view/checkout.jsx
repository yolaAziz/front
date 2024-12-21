import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { shippingCosts } from "@/config";
import { Label } from "@/components/ui/label";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [government, setGovernment] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const { toast } = useToast();
  const baseURL = import.meta.env.VITE_API_URL;

  const [paymentMethod, setPaymentMethod] = useState(""); // حفظ طريقة الدفع المختارة

  const handlePaymentSelection = async () => {
    if (paymentMethod === "") {
      alert("من فضلك اختر طريقة الدفع");
      return;
    }

    if (paymentMethod === "cod") {
      handlePayment("cod");
    }

    // if (paymentMethod === "paymob") {
    //   handlePaymobPayment("paymob");
    // } else if (paymentMethod === "cod") {
    //   handlePayment("cod");
    // }
  };

  const handleProvinceChange = (event) => {
    const selectedProvince = event.target.value;
    setGovernment(selectedProvince);
    setShippingCost(shippingCosts[selectedProvince]);
  };

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce((sum, currentItem) => {
          const itemPrice =
            currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price;

          // حساب إجمالي الكمية في السلة
          const totalQuantityInCart = cartItems.items.reduce(
            (total, item) => total + (item?.quantity || 0),
            0
          );

          // إذا كانت الكمية 6 من نفس المنتج أو إجمالي الكمية في السلة 6 أو أكثر
          if (currentItem?.quantity === 6 || totalQuantityInCart === 6) {
            return sum + itemPrice * currentItem.quantity * 0.9; // خصم 10%
          }

          // إذا كانت الكمية 12 من نفس المنتج أو إجمالي الكمية في السلة 12 أو أكثرz
          if (currentItem?.quantity === 12 || totalQuantityInCart === 12) {
            return sum + itemPrice * currentItem.quantity * 0.8; // خصم 20%
          }

          // بدون خصم إذا لم يتحقق أي شرط
          return sum + itemPrice * currentItem.quantity;
        }, 0) + shippingCost // أضف مصاريف الشحن إلى الإجمالي
      : shippingCost; // إذا كانت العربة فارغة، الإجمالي هو الشحن فقط

  // حساب قيمة الخصم
  const discount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce((sum, currentItem) => {
          const itemPrice =
            currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price;

          // حساب إجمالي الكمية في السلة
          const totalQuantityInCart = cartItems.items.reduce(
            (total, item) => total + (item?.quantity || 0),
            0
          );

          // إذا كانت الكمية 6 من نفس المنتج أو إجمالي الكمية في السلة 6 أو أكثر
          if (currentItem?.quantity === 6 || totalQuantityInCart === 6) {
            return sum + itemPrice * currentItem.quantity * 0.1; // خصم 10%
          }

          // إذا كانت الكمية 12 من نفس المنتج أو إجمالي الكمية في السلة 12 أو أكثر
          if (currentItem?.quantity === 12 || totalQuantityInCart === 12) {
            return sum + itemPrice * currentItem.quantity * 0.2; // خصم 20%
          }

          return sum; // لا خصم إذا لم يتحقق أي شرط
        }, 0)
      : 0; // إذا كانت العربة فارغة، لا يوجد خصم

  const handlePaymobPayment = async (method) => {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (!government) {
      toast({
        title: "Please select your government to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    

    if (government === null) {
      toast({
        title: "Please select your government to proceed.",
        variant: "destructive",
      });
      return;
    }

    try {
      // بيانات الفواتير كمثال
      const billingData = {
        first_name: user?.userName || "N/A",
        last_name: "..",
        email: user?.email,
        phone_number: currentSelectedAddress?.phone,
        country: "EG",
        city: currentSelectedAddress?.city,
        street: currentSelectedAddress?.address,
        building: currentSelectedAddress?.building || "N/A",
        postalCode: currentSelectedAddress?.postalCode || "00000",
        floor: currentSelectedAddress?.floor || "N/A",
        apartment: currentSelectedAddress?.apartment || "N/A",
      };

      const orderData = {
        userId: user?.id,
        cartId: cartItems?._id,
        cartItems: cartItems.items.map((singleCartItem) => ({
          productId: singleCartItem?.productId,
          title: singleCartItem?.title,
          image: singleCartItem?.image,
          color: singleCartItem?.color,
          additionalDetails: singleCartItem?.additionalDetails,
          price:
            singleCartItem?.salePrice > 0
              ? singleCartItem?.salePrice
              : singleCartItem?.price,
          quantity: singleCartItem?.quantity,
        })),
        addressInfo: {
          addressId: currentSelectedAddress?._id,
          address: currentSelectedAddress?.address,
          city: currentSelectedAddress?.city,
          phone: currentSelectedAddress?.phone,
          notes: currentSelectedAddress?.notes,
          apartment: currentSelectedAddress?.apartment || "N/A",
          floor: currentSelectedAddress?.floor || "N/A",
          building: currentSelectedAddress?.building || "N/A",
          postalCode: currentSelectedAddress?.postalCode || "00000",
        },
        orderStatus: "pending",
        paymentMethod: "paymob",
        paymentStatus: "pending",
        totalAmount: totalCartAmount,
        orderDate: new Date(),
        orderUpdateDate: new Date(),
      };

      // طلب POST إلى السيرفر لإنشاء الطلب
      const response = await fetch(
        `${baseURL}/api/shop/order/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalCartAmount, // المبلغ بالجنيه المصري
            billingData,
            orderData,
            paymentMethod: method,
          }),
        }
      );

      const data = await response.json();
      console.log(data); // سيتم تضمين الـ orderId و paymentKey هنا
      sessionStorage.setItem("currentOrderId", data.orderId);
      sessionStorage.setItem("paymentMethod", "paymob"); // إذا كانت الطريقة عبر Paymob
      // نقل الـ orderId و paymentId إلى صفحة الدفع (iframe)
      const orderId = data.orderId; // قم بإرجاع الـ orderId من الخادم بعد إنشاء الطلب
      const paymentId = data.paymentId; // قم بإرجاع الـ paymentId من Paymob بعد التحقق من الدفع
      const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/881668?payment_token=${data.paymentKey}&order_id=${orderId}&payment_id=${paymentId}`;

      window.location.href = iframeUrl; // فتح صفحة الدفع في المتصفح
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error: " + error.message); // تنبيه المستخدم بوجود خطأ
    }
  };

  const handlePayment = async (method) => {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!government) {
      toast({
        title: "Please select your government to proceed.",
        variant: "destructive",
      });
      return;
    }

    const billingData = {
      first_name: user?.userName || "N/A",
      last_name: "..",
      email: user?.email,
      phone_number: currentSelectedAddress?.phone,
      country: "EG",
      city: currentSelectedAddress?.city,
      street: currentSelectedAddress?.address,
      building: currentSelectedAddress?.building || "N/A",
      postalCode: currentSelectedAddress?.postalCode || "00000",
      floor: currentSelectedAddress?.floor || "N/A",
      apartment: currentSelectedAddress?.apartment || "N/A",
    };

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        color: singleCartItem?.color,
        additionalDetails: singleCartItem?.additionalDetails,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
        apartment: currentSelectedAddress?.apartment || "N/A",
        floor: currentSelectedAddress?.floor || "N/A",
        building: currentSelectedAddress?.building || "N/A",
        postalCode: currentSelectedAddress?.postalCode || "00000",
      },
      orderStatus: "pending",
      paymentMethod: "COD",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    const response = await fetch(
      `${baseURL}/api/shop/order/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalCartAmount,
          billingData,
          orderData,
          paymentMethod: method,
        }),
      }
    );

    const result = await response.json();
    console.log("Server Response: ", result);

    if (method === "cod") {
      if (result?.success) {
        // حفظ orderId في sessionStorage
        sessionStorage.setItem("currentOrderId", result?.orderId);
        sessionStorage.setItem("paymentMethod", "cod"); // إذا كانت الطريقة هي الدفع عند الاستلام

        // الانتقال إلى paymob-return بعد حفظ الـ orderId
        window.location.href = "/shop/paymob-return";
      } else {
        toast({
          title: "Failed to create order. Try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-1">
            <Label>Choose your government</Label>
            <select
              value={government}
              onChange={handleProvinceChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="0">اختار محافظتك</option>
              {Object.entries(shippingCosts).map(([province]) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-1">
            <Label> Choose payment method</Label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-2"
            >
              <option value="">اختيار طريقة الدفع</option>
              {/* <option value="paymob">Paymob</option> */}
              <option value="cod">دفع عند الاستلام</option>
            </select>
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Discount</span>
              <span className="font-bold">{discount.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Shipping Cost</span>
              <span className="font-bold">{shippingCost.toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">
                {totalCartAmount.toFixed(2)} EGP
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mt-4">
              <Button onClick={handlePaymentSelection} className="w-full">
                Confirm
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;

// import Address from "@/components/shopping-view/address";
// import img from "../../assets/account.jpg";
// import { useDispatch, useSelector } from "react-redux";
// import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { useToast } from "@/components/ui/use-toast";
// import { shippingCosts } from "@/config";
// import { Label } from "@/components/ui/label";

// function ShoppingCheckout() {
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { user } = useSelector((state) => state.auth);
//   const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
//   const [isPaymentStart, setIsPaymemntStart] = useState(false);
//   const [government, setGovernment] = useState("");
//   const [shippingCost, setShippingCost] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("paymob");
//   const { toast } = useToast();
//   const dispatch = useDispatch();

//   const handleProvinceChange = (event) => {
//     const selectedProvince = event.target.value;
//     setGovernment(selectedProvince);
//     setShippingCost(shippingCosts[selectedProvince]);
//   };

//   const totalCartAmount =
//     cartItems && cartItems.items && cartItems.items.length > 0
//       ? cartItems.items.reduce((sum, currentItem) => {
//           const itemPrice =
//             currentItem?.salePrice > 0
//               ? currentItem?.salePrice
//               : currentItem?.price;

//           const totalQuantityInCart = cartItems.items.reduce(
//             (total, item) => total + (item?.quantity || 0),
//             0
//           );

//           if (currentItem?.quantity === 6 || totalQuantityInCart === 6) {
//             return sum + itemPrice * currentItem.quantity * 0.9;
//           }

//           if (currentItem?.quantity === 12 || totalQuantityInCart === 12) {
//             return sum + itemPrice * currentItem.quantity * 0.8;
//           }

//           return sum + itemPrice * currentItem.quantity;
//         }, 0) + shippingCost
//       : shippingCost;

//   const discount =
//     cartItems && cartItems.items && cartItems.items.length > 0
//       ? cartItems.items.reduce((sum, currentItem) => {
//           const itemPrice =
//             currentItem?.salePrice > 0
//               ? currentItem?.salePrice
//               : currentItem?.price;

//           const totalQuantityInCart = cartItems.items.reduce(
//             (total, item) => total + (item?.quantity || 0),
//             0
//           );

//           if (currentItem?.quantity === 6 || totalQuantityInCart === 6) {
//             return sum + itemPrice * currentItem.quantity * 0.1;
//           }

//           if (currentItem?.quantity === 12 || totalQuantityInCart === 12) {
//             return sum + itemPrice * currentItem.quantity * 0.2;
//           }

//           return sum;
//         }, 0)
//       : 0;

//   const handlePayment = async () => {
//     if (cartItems.length === 0) {
//       toast({
//         title: "Your cart is empty. Please add items to proceed",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (currentSelectedAddress === null) {
//       toast({
//         title: "Please select one address to proceed.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (paymentMethod === "cash") {
//       try {
//         const billingData = {
//           first_name: user?.userName || "N/A",
//           last_name: "..",
//           email: user?.email,
//           phone_number: currentSelectedAddress?.phone,
//           country: "EG",
//           city: currentSelectedAddress?.city,
//           street: currentSelectedAddress?.address,
//           building: currentSelectedAddress?.building || "N/A",
//           postalCode: currentSelectedAddress?.postalCode || "00000",
//           floor: currentSelectedAddress?.floor || "N/A",
//           apartment: currentSelectedAddress?.apartment || "N/A",
//         };

//         const orderData = {
//           userId: user?.id,
//           cartId: cartItems?._id,
//           cartItems: cartItems.items.map((singleCartItem) => ({
//             productId: singleCartItem?.productId,
//             title: singleCartItem?.title,
//             image: singleCartItem?.image,
//             color: singleCartItem?.color,
//             additionalDetails: singleCartItem?.additionalDetails,
//             price:
//               singleCartItem?.salePrice > 0
//                 ? singleCartItem?.salePrice
//                 : singleCartItem?.price,
//             quantity: singleCartItem?.quantity,
//           })),
//           addressInfo: {
//             addressId: currentSelectedAddress?._id,
//             address: currentSelectedAddress?.address,
//             city: currentSelectedAddress?.city,
//             phone: currentSelectedAddress?.phone,
//             notes: currentSelectedAddress?.notes,
//             apartment: currentSelectedAddress?.apartment || "N/A",
//             floor: currentSelectedAddress?.floor || "N/A",
//             building: currentSelectedAddress?.building || "N/A",
//             postalCode: currentSelectedAddress?.postalCode || "00000",
//           },
//           orderStatus: "pending",
//           paymentMethod: "paymob",
//           paymentStatus: "pending",
//           totalAmount: totalCartAmount,
//           orderDate: new Date(),
//           orderUpdateDate: new Date(),
//         };

//         const response = await fetch(
//           "http://localhost:5000/api/shop/order/create",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               amount: totalCartAmount,
//               billingData,
//               orderData,
//               paymentMethod: paymentMethod,

//             }),
//           }
//         );

//         const data = await response.json();
//         console.log("Server Response:", data);

//         if (data.success && data.orderId) {
//           const orderId = data.orderId;
//           const payerId = data.payerId; // قم بإرجاع الـ orderId من الخادم بعد إنشاء الطلب
//           const paymentId = data.paymentId; // قم بإرجاع الـ paymentId من Paymob بعد التحقق من الدفع
//           console.log("Order ID received from server:", orderId);

//           // تخزين orderId مع payerId و paymentId في sessionStorage
//           sessionStorage.setItem("currentOrderId", orderId);
//           sessionStorage.setItem("payerId", payerId);
//           sessionStorage.setItem("paymentId", paymentId);

//           console.log(
//             "Stored currentOrderId, payerId, and paymentId in sessionStorage"
//           );

//           // مسح السلة
//           sessionStorage.removeItem("cartItems");
//           console.log("Cleared cartItems from sessionStorage");

//           // توجيه المستخدم
//           window.location.href = `/shop/payment-success`;
//         } else {
//           throw new Error("Failed to create order for cash payment.");
//         }
//       } catch (error) {
//         console.error("Error with cash on delivery request:", error.message);
//         alert("Error: " + error.message);
//       }
//     } else if (paymentMethod === "paymob") {
//       // الدفع عبر Paymob
//       try {
//         // بيانات الفواتير كمثال
//         const billingData = {
//           first_name: user?.userName || "N/A",
//           last_name: "..",
//           email: user?.email,
//           phone_number: currentSelectedAddress?.phone,
//           country: "EG",
//           city: currentSelectedAddress?.city,
//           street: currentSelectedAddress?.address,
//           building: currentSelectedAddress?.building || "N/A",
//           postalCode: currentSelectedAddress?.postalCode || "00000",
//           floor: currentSelectedAddress?.floor || "N/A",
//           apartment: currentSelectedAddress?.apartment || "N/A",
//         };

//         const orderData = {
//           userId: user?.id,
//           cartId: cartItems?._id,
//           cartItems: cartItems.items.map((singleCartItem) => ({
//             productId: singleCartItem?.productId,
//             title: singleCartItem?.title,
//             image: singleCartItem?.image,
//             color: singleCartItem?.color,
//             additionalDetails: singleCartItem?.additionalDetails,
//             price:
//               singleCartItem?.salePrice > 0
//                 ? singleCartItem?.salePrice
//                 : singleCartItem?.price,
//             quantity: singleCartItem?.quantity,
//           })),
//           addressInfo: {
//             addressId: currentSelectedAddress?._id,
//             address: currentSelectedAddress?.address,
//             city: currentSelectedAddress?.city,
//             phone: currentSelectedAddress?.phone,
//             notes: currentSelectedAddress?.notes,
//             apartment: currentSelectedAddress?.apartment || "N/A",
//             floor: currentSelectedAddress?.floor || "N/A",
//             building: currentSelectedAddress?.building || "N/A",
//             postalCode: currentSelectedAddress?.postalCode || "00000",
//           },
//           orderStatus: "pending",
//           paymentMethod: "paymob",
//           paymentStatus: "pending",
//           totalAmount: totalCartAmount,
//           orderDate: new Date(),
//           orderUpdateDate: new Date(),
//         };

//         // طلب POST إلى السيرفر لإنشاء الطلب
//         const response = await fetch(
//           "http://localhost:5000/api/shop/order/create",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               amount: totalCartAmount, // المبلغ بالجنيه المصري
//               billingData,
//               orderData,
//               paymentMethod: paymentMethod,
//             }),
//           }
//         );

//         const data = await response.json();
//         console.log(data); // سيتم تضمين الـ orderId و paymentKey هنا
//         sessionStorage.setItem("currentOrderId", data.orderId);
//         // نقل الـ orderId و paymentId إلى صفحة الدفع (iframe)
//         const orderId = data.orderId; // قم بإرجاع الـ orderId من الخادم بعد إنشاء الطلب
//         const paymentId = data.paymentId; // قم بإرجاع الـ paymentId من Paymob بعد التحقق من الدفع
//         const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/881668?payment_token=${data.paymentKey}&order_id=${orderId}&payment_id=${paymentId}`;

//         window.location.href = iframeUrl; // فتح صفحة الدفع في المتصفح
//       } catch (error) {
//         console.error("Error:", error.message);
//         alert("Error: " + error.message); // تنبيه المستخدم بوجود خطأ
//       }
//     }
//   };

//   // const handlePayment = async () => {
//   //   if (cartItems.length === 0) {
//   //     toast({
//   //       title: "Your cart is empty. Please add items to proceed",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   if (currentSelectedAddress === null) {
//   //     toast({
//   //       title: "Please select one address to proceed.",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   if (currentSelectedAddress === null) {
//   //     toast({
//   //       title: "Please select one address to proceed.",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   if (paymentMethod === "cash") {
//   //     try {
//   //       // تحقق من قيمة totalCartAmount قبل الإرسال
//   //       const safeTotalCartAmount = totalCartAmount && !isNaN(totalCartAmount) ? Number(totalCartAmount) : 0;

//   //       const orderData = {
//   //         userId: user?.id,
//   //         cartId: cartItems?._id,
//   //         cartItems: cartItems.items.map((singleCartItem) => ({
//   //           productId: singleCartItem?.productId,
//   //           title: singleCartItem?.title,
//   //           image: singleCartItem?.image,
//   //           color: singleCartItem?.color,
//   //           additionalDetails: singleCartItem?.additionalDetails,
//   //           price:
//   //             singleCartItem?.salePrice > 0
//   //               ? singleCartItem?.salePrice
//   //               : singleCartItem?.price,
//   //           quantity: singleCartItem?.quantity,
//   //         })),
//   //         addressInfo: {
//   //           addressId: currentSelectedAddress?._id,
//   //           address: currentSelectedAddress?.address,
//   //           city: currentSelectedAddress?.city,
//   //           phone: currentSelectedAddress?.phone,
//   //           notes: currentSelectedAddress?.notes,
//   //           apartment: currentSelectedAddress?.apartment || "N/A",
//   //           floor: currentSelectedAddress?.floor || "N/A",
//   //           building: currentSelectedAddress?.building || "N/A",
//   //           postalCode: currentSelectedAddress?.postalCode || "00000",
//   //         },
//   //         orderStatus: "pending",
//   //         paymentMethod: "cash", // تأكيد أن الدفع عند الاستلام مُحدد
//   //         paymentStatus: "pending",
//   //         totalAmount: safeTotalCartAmount, // استخدام القيمة المُتحققة
//   //         orderDate: new Date(),
//   //         orderUpdateDate: new Date(),
//   //       };

//   //       console.log("Order Data:", orderData);

//   //       // إرسال طلب الدفع عند الاستلام عبر Redux
//   //       const response = await dispatch(createNewCODOrder(orderData));

//   //       console.log("Server Response:", response);

//   //       if (response?.payload?.success) {
//   //         // مسح السلة بعد الطلب الناجح
//   //         dispatch(clearCart());

//   //         toast({
//   //           title: "Order placed successfully with cash!",
//   //           variant: "success",
//   //         });
//   //         window.location.href = "/shop/payment-success";
//   //       } else {
//   //         toast({
//   //           title: "Failed to process the order. Please try again.",
//   //           variant: "destructive",
//   //         });
//   //       }
//   //     } catch (error) {
//   //       console.error("Error with cash payment request:", error.message);

//   //       toast({
//   //         title: "Something went wrong.",
//   //         variant: "destructive",
//   //       });

//   //       // حتى في حالة الخطأ يجب مسح السلة
//   //       dispatch(clearCart());
//   //     }
//   //   }

//   //   // التعامل مع الدفع عبر Paymob
//   //   else if (paymentMethod === "paymob") {
//   //     try {
//   //       const billingData = {
//   //         first_name: user?.userName || "N/A",
//   //         last_name: "..",
//   //         email: user?.email,
//   //         phone_number: currentSelectedAddress?.phone,
//   //         country: "EG",
//   //         city: currentSelectedAddress?.city,
//   //         street: currentSelectedAddress?.address,
//   //         building: currentSelectedAddress?.building || "N/A",
//   //         postalCode: currentSelectedAddress?.postalCode || "00000",
//   //         floor: currentSelectedAddress?.floor || "N/A",
//   //         apartment: currentSelectedAddress?.apartment || "N/A",
//   //       };

//   //       const orderData = {
//   //         userId: user?.id,
//   //         cartId: cartItems?._id,
//   //         cartItems: cartItems.items.map((singleCartItem) => ({
//   //           productId: singleCartItem?.productId,
//   //           title: singleCartItem?.title,
//   //           image: singleCartItem?.image,
//   //           color: singleCartItem?.color,
//   //           additionalDetails: singleCartItem?.additionalDetails,
//   //           price:
//   //             singleCartItem?.salePrice > 0
//   //               ? singleCartItem?.salePrice
//   //               : singleCartItem?.price,
//   //           quantity: singleCartItem?.quantity,
//   //         })),
//   //         addressInfo: {
//   //           addressId: currentSelectedAddress?._id,
//   //           address: currentSelectedAddress?.address,
//   //           city: currentSelectedAddress?.city,
//   //           phone: currentSelectedAddress?.phone,
//   //           notes: currentSelectedAddress?.notes,
//   //           apartment: currentSelectedAddress?.apartment || "N/A",
//   //           floor: currentSelectedAddress?.floor || "N/A",
//   //           building: currentSelectedAddress?.building || "N/A",
//   //           postalCode: currentSelectedAddress?.postalCode || "00000",
//   //         },
//   //         orderStatus: "pending",
//   //         paymentMethod: "paymob",
//   //         paymentStatus: "pending",
//   //         totalAmount: totalCartAmount,
//   //         orderDate: new Date(),
//   //         orderUpdateDate: new Date(),
//   //       };

//   //       const response = await fetch(
//   //         "http://localhost:5000/api/shop/order/create",
//   //         {
//   //           method: "POST",
//   //           headers: { "Content-Type": "application/json" },
//   //           body: JSON.stringify({
//   //             amount: totalCartAmount,
//   //             billingData,
//   //             orderData,
//   //             paymentMethod: "paymob",
//   //           }),
//   //         }
//   //       );

//   //       const data = await response.json();
//   //       console.log("Paymob Response:", data);

//   //       sessionStorage.setItem(
//   //         "paymentData",
//   //         JSON.stringify([
//   //           { key: "orderId", value: data.orderId },
//   //           { key: "paymentId", value: data.paymentId || "N/A" },
//   //         ])
//   //       );

//   //       const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/881668?payment_token=${data.paymentKey}`;
//   //       window.location.href = iframeUrl;
//   //     } catch (error) {
//   //       console.error("Error with Paymob payment:", error.message);
//   //       alert("Error: " + error.message);
//   //     }
//   //   }
//   // };

//   return (
//     <div className="flex flex-col">
//       <div className="relative h-[300px] w-full overflow-hidden">
//         <img src={img} className="h-full w-full object-cover object-center" />
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
//         <Address
//           selectedId={currentSelectedAddress}
//           setCurrentSelectedAddress={setCurrentSelectedAddress}
//         />
//         <div className="flex flex-col gap-4">
//           {cartItems && cartItems.items && cartItems.items.length > 0
//             ? cartItems.items.map((item) => (
//                 <UserCartItemsContent cartItem={item} />
//               ))
//             : null}
//           <div className="mt-1">
//             <Label>Choose your government</Label>
//             <select
//               value={government}
//               onChange={handleProvinceChange}
//               className="w-full p-2 border border-gray-300 rounded"
//             >
//               <option value="0">اختار محافظتك</option>
//               {Object.entries(shippingCosts).map(([province]) => (
//                 <option key={province} value={province}>
//                   {province}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="mt-4 space-y-4">
//             <Label>Select Payment Method</Label>
//             <select
//               value={paymentMethod}
//               onChange={(e) => setPaymentMethod(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded"
//             >
//               <option value="paymob">Paymob</option>
//               <option value="cash">Cash on Delivery</option>
//             </select>
//           </div>
//           <div className="mt-8 space-y-4">
//             <div className="flex justify-between">
//               <span className="font-bold">Discount</span>
//               <span className="font-bold">{discount.toFixed(2)} EGP</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="font-bold">Shipping Cost</span>
//               <span className="font-bold">{shippingCost.toFixed(2)} EGP</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="font-bold">Total</span>
//               <span className="font-bold">
//                 {totalCartAmount.toFixed(2)} EGP
//               </span>
//             </div>
//           </div>
//           <div className="mt-4 w-full">
//             <Button onClick={handlePayment} className="w-full">
//               {isPaymentStart
//                 ? `Processing ${paymentMethod} Payment...`
//                 : "Checkout"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ShoppingCheckout;

// import Address from "@/components/shopping-view/address";
// import img from "../../assets/account.jpg";
// import { useSelector } from "react-redux";
// import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { useToast } from "@/components/ui/use-toast";
// import { shippingCosts } from "@/config";
// import { Label } from "@/components/ui/label";

// function ShoppingCheckout() {
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { user } = useSelector((state) => state.auth);
//   const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
//   const [isPaymentStart, setIsPaymentStart] = useState(false);
//   const [government, setGovernment] = useState("");
//   const [shippingCost, setShippingCost] = useState(0);
//   const [paymentMethod, setPaymentMethod] = useState("paymob");
//   const { toast } = useToast();

//   const handleProvinceChange = (event) => {
//     const selectedProvince = event.target.value;
//     setGovernment(selectedProvince);
//     setShippingCost(shippingCosts[selectedProvince]);
//   };

//   const totalCartAmount =
//     cartItems && cartItems.items && cartItems.items.length > 0
//       ? cartItems.items.reduce((sum, currentItem) => {
//           const itemPrice =
//             currentItem?.salePrice > 0
//               ? currentItem?.salePrice
//               : currentItem?.price;

//           const totalQuantityInCart = cartItems.items.reduce(
//             (total, item) => total + (item?.quantity || 0),
//             0
//           );

//           if (currentItem?.quantity === 6 || totalQuantityInCart === 6) {
//             return sum + itemPrice * currentItem.quantity * 0.9;
//           }

//           if (currentItem?.quantity === 12 || totalQuantityInCart === 12) {
//             return sum + itemPrice * currentItem.quantity * 0.8;
//           }

//           return sum + itemPrice * currentItem.quantity;
//         }, 0) + shippingCost : shippingCost;

//   const handlePayment = async () => {
//     if (cartItems.length === 0) {
//       toast({
//         title: "Your cart is empty. Please add items to proceed",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (currentSelectedAddress === null) {
//       toast({
//         title: "Please select one address to proceed.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (paymentMethod === "cash_on_delivery") {
//       try {
//         const orderData = {
//           userId: user?.id,
//           cartId: cartItems?._id,
//           cartItems: cartItems.items.map((item) => ({
//             productId: item?.productId,
//             title: item?.title,
//             image: item?.image,
//             price: item?.salePrice > 0 ? item?.salePrice : item?.price,
//             quantity: item?.quantity,
//           })),
//           addressInfo: currentSelectedAddress,
//           orderStatus: "pending",
//           paymentMethod: "cash_on_delivery",
//           paymentStatus: "pending",
//           totalAmount: totalCartAmount,
//           orderDate: new Date(),
//         };

//         const response = await fetch(
//           "http://localhost:5000/api/shop/order/create",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(orderData),
//           }
//         );

//         const data = await response.json();
//         if (data.success) {
//           toast({
//             title: "Order created successfully with Cash on Delivery.",
//             variant: "success",
//           });

//           // إعادة التوجيه بعد النجاح
//           window.location.href = "/shop/paymob-return";
//         } else {
//           throw new Error("Failed to process the order.");
//         }
//       } catch (error) {
//         toast({
//           title: "Error processing Cash on Delivery.",
//           variant: "destructive",
//         });
//       }
//     }

//     else if (paymentMethod === "paymob") {
//       try {
//         const billingData = {
//           first_name: user?.userName || "N/A",
//           last_name: "..",
//           email: user?.email,
//           phone_number: currentSelectedAddress?.phone,
//           country: "EG",
//           city: currentSelectedAddress?.city,
//           street: currentSelectedAddress?.address,
//         };

//         const orderData = {
//           userId: user?.id,
//           cartId: cartItems?._id,
//           cartItems: cartItems.items.map((item) => ({
//             productId: item?.productId,
//             title: item?.title,
//             image: item?.image,
//             price: item?.salePrice > 0 ? item?.salePrice : item?.price,
//             quantity: item?.quantity,
//           })),
//         };

//         const response = await fetch(
//           "http://localhost:5000/api/shop/order/create",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               amount: totalCartAmount,
//               billingData,
//               orderData,
//             }),
//           }
//         );

//         const data = await response.json();
//         const iframeUrl = `https://accept.paymobsolutions.com/api/acceptance/iframes/881668?payment_token=${data.paymentKey}&order_id=${data.orderId}`;
//         window.location.href = iframeUrl;
//       } catch (error) {
//         toast({
//           title: "Error processing payment with Paymob",
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   return (
//     <div className="flex flex-col">
//       <div className="relative h-[300px] w-full overflow-hidden">
//         <img src={img} className="h-full w-full object-cover object-center" />
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
//         <Address
//           selectedId={currentSelectedAddress}
//           setCurrentSelectedAddress={setCurrentSelectedAddress}
//         />
//         <div className="flex flex-col gap-4">
//           <Label>Select Payment Method:</Label>
//           <select
//             value={paymentMethod}
//             onChange={(e) => setPaymentMethod(e.target.value)}
//             className="w-full p-2 border border-gray-300 rounded"
//           >
//             <option value="paymob">Paymob Payment</option>
//             <option value="cash_on_delivery">Cash on Delivery</option>
//           </select>
//           <div className="mt-4 w-full">
//             <Button onClick={handlePayment} className="w-full">
//               Proceed with {paymentMethod === "paymob" ? "Paymob Payment" : "Cash on Delivery"}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ShoppingCheckout;
