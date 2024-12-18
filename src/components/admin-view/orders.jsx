import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return isMobile ? (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {orderList && orderList.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:table md:table-fixed">
            {/* Table Header for larger screens */}
            <div className="hidden md:table-header-group">
              <div className="table-row font-bold">
                <div className="table-cell p-2">Orders ID</div>
                <div className="table-cell p-2">Orders Date</div>
                <div className="table-cell p-2">Orders Status</div>
                <div className="table-cell p-2">Orders Price</div>
                <div className="table-cell p-2">
                  <span className="sr-only">Details</span>
                </div>
              </div>
            </div>

            {/* Render each order */}
            {orderList.map((orderItem) => (
              <div
                key={orderItem._id}
                className="p-4 border rounded-md shadow-sm md:table-row"
              >
                <div className="md:table-cell p-2 font-bold md:font-normal">
                  <span className="block md:hidden">Order ID:</span>
                  {orderItem?._id}
                </div>
                <div className="md:table-cell p-2">
                  <span className="block md:hidden">Order Date:</span>
                  {orderItem?.orderDate.split("T")[0]}
                </div>
                <div className="md:table-cell p-2">
                  <span className="block md:hidden">Order Status:</span>
                  <Badge
                    className={`py-1 px-3 text-white ${
                      orderItem?.orderStatus === "confirmed"
                        ? "bg-green-500"
                        : orderItem?.orderStatus === "rejected"
                        ? "bg-red-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {orderItem?.orderStatus}
                  </Badge>
                </div>
                <div className="md:table-cell p-2">
                  <span className="block md:hidden">Order Price:</span>
                  {orderItem?.totalAmount} EGP
                </div>
                <div className="md:table-cell p-2">
                  <Dialog
                    open={openDetailsDialog}
                    onOpenChange={() => {
                      setOpenDetailsDialog(false);
                      dispatch(resetOrderDetails());
                    }}
                  >
                    <Button
                      onClick={() => handleFetchOrderDetails(orderItem?._id)}
                      className="text-xs md:text-sm"
                    >
                      View Details
                    </Button>
                    <AdminOrderDetailsView orderDetails={orderDetails} />
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No orders available.</p>
        )}
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orders ID</TableHead>
              <TableHead>Orders Date</TableHead>
              <TableHead>Orders Status</TableHead>
              <TableHead>Orders Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow>
                    <TableCell>{orderItem?._id}</TableCell>
                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600"
                            : "bg-black"
                        } `}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{orderItem?.totalAmount} EGP</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
export default AdminOrdersView;
