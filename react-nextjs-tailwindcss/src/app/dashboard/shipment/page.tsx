import AverageDeliveryTime from "@/components/Dashboard/Shipment/AverageDeliveryTime";
import Chat from "@/components/Dashboard/Shipment/Chat";
import LiveShipmentStatus from "@/components/Dashboard/Shipment/LiveShipmentStatus";
import OnTimeDelivery from "@/components/Dashboard/Shipment/OnTimeDelivery";
import ShipmentDelivered from "@/components/Dashboard/Shipment/ShipmentDelivered";
import ShipmentList from "@/components/Dashboard/Shipment/ShipmentList";
import ShipmentToTopCountriesAroundTheWorld from "@/components/Dashboard/Shipment/ShipmentToTopCountriesAroundTheWorld";
import TodaysShipments from "@/components/Dashboard/Shipment/TodaysShipments";
import TopShippingMethods from "@/components/Dashboard/Shipment/TopShippingMethods";
import TotalCustomer from "@/components/Dashboard/Shipment/TotalCustomer";
import TotalOrder from "@/components/Dashboard/Shipment/TotalOrder";
import TotalRevenue from "@/components/Dashboard/Shipment/TotalRevenue";
import TotalShipment from "@/components/Dashboard/Shipment/TotalShipment";
import TrackingOrder from "@/components/Dashboard/Shipment/TrackingOrder";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[25px]">
          <TotalRevenue />

          <TotalShipment />

          <TotalCustomer />

          <TotalOrder />
        </div>

        <ShipmentDelivered />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[25px] mb-[25px]">
            <AverageDeliveryTime />

            <LiveShipmentStatus />
          </div>

          <TrackingOrder />
        </div>

        <div className="lg:col-span-1">
          <ShipmentToTopCountriesAroundTheWorld />

          <Chat />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <TopShippingMethods />

        <TodaysShipments />

        <OnTimeDelivery />
      </div>

      <ShipmentList />
    </>
  );
}
