import LocationList from "../../../components/project/LocationList/LocationList";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";

const ProjectLocationsPage = () => {
  return (
    <AuthenticatedLayout>
      <LocationList />
    </AuthenticatedLayout>
  );
};

export default ProjectLocationsPage;
