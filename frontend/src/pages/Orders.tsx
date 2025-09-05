import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Package } from "lucide-react";
import { useCheckAuth } from "@/hooks/useAuth";
import { useGetOrders } from "@/hooks/useOrder";
import { motion } from "framer-motion";
import type { Order } from "@/types/types";
import { Link } from "react-router-dom";
import OrderCard from "@/components/OrderCard";

export default function Orders() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();
  const { isAuthenticated } = useCheckAuth();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { data: ordersData, isLoading } = useGetOrders();

  const orders: Order[] = ordersData?.orders || [];

  // Animation variants
  const fadeUp = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  // Filter orders by status
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 py-8" dir={dir}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent className="py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-4">
                  {t("orders.loginRequired")}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {t("orders.loginToView")}
                </p>
                <Link to="/login">
                  <Button>{t("orders.login")}</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" dir={dir}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t("orders.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8" dir={dir}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold">{t("orders.title")}</h1>
            <p className="text-muted-foreground mt-2">
              {t("orders.subtitle", { count: orders.length })}
            </p>
          </div>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {filterStatus === "all"
                  ? t("orders.filter.all")
                  : t(`orders.status.${filterStatus}`)}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === "rtl" ? "end" : "start"}>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                {t("orders.filter.all")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("confirmed")}>
                {t("orders.status.confirmed")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("processing")}>
                {t("orders.status.processing")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("shipped")}>
                {t("orders.status.shipped")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("delivered")}>
                {t("orders.status.delivered")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>
                {t("orders.status.cancelled")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order._id}
                variants={fadeUp}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))
          ) : (
            <motion.div variants={fadeUp} initial="initial" animate="animate">
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {filterStatus === "all"
                      ? t("orders.noOrders")
                      : t("orders.noFilteredOrders")}
                  </p>
                  <Link to="/products">
                    <Button className="mt-4">
                      {t("orders.startShopping")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
