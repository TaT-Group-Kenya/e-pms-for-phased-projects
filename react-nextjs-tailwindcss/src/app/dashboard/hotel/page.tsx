import CustomerRatings from "@/components/Dashboard/Hotel/CustomerRatings";
import GuestActivity from "@/components/Dashboard/Hotel/GuestActivity";
import PopularRooms from "@/components/Dashboard/Hotel/PopularRooms";
import RecentBookings from "@/components/Dashboard/Hotel/RecentBookings";
import RoomsAvailability from "@/components/Dashboard/Hotel/RoomsAvailability";
import Stats from "@/components/Dashboard/Hotel/Stats";
import UpcomingVIPReservations from "@/components/Dashboard/Hotel/UpcomingVIPReservations";

export default function Page() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[25px] mb-[25px]">
        <div className="lg:col-span-2">
          <Stats />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px] mb-[25px]">
            <RoomsAvailability />

            <GuestActivity />
          </div>

          <UpcomingVIPReservations />
        </div>

        <div className="lg:col-span-1">
          <RecentBookings />
        </div>
      </div>

      <PopularRooms />

      <CustomerRatings />
    </>
  );
}
