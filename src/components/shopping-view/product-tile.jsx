import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddToCard,
}) {
  const imageToShow = product?.image ? product?.image.split(",")[0] : "";

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={imageToShow}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg "
          />

          {product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          {/* <h2 className="text-xl font-bold mb-2">{product.title} </h2> */}
          <div className="flex justify-between items-center mb-2">
           
          <h2 className="text-xl font-bold mb-2">{product.title} </h2>

            <span className="text-lg font-semibold text-primary">
              6 socks
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary `}
            >
              {product.price * 6} EGP
            </span>
            {product.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                {product.salePrice * 6} EGP
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
       
          <Button
            onClick={() => handleAddToCard(product?._id, product?.totalStock)}
            className="w-full"
          >
            Add to cart{" "}
          </Button>
        
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
