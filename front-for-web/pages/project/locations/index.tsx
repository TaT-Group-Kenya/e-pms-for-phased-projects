import LocationList from "../../../components/project/LocationList/LocationList";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import Can from "../../../components/auth/Can";

const ProjectLocationsPage = () => {
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_PROJECT_LOCATION"]} fallback={<div>You do not have permission to view project locations.</div>}>
        <LocationList />
      </Can>
    </AuthenticatedLayout>
  );
};

export default ProjectLocationsPage;
