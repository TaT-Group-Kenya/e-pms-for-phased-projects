import SourceOriginList from "../../../components/project/SourceOriginList/SourceOriginList";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";

const ProjectSourceOriginsPage = () => {
  return (
    <AuthenticatedLayout>
      <SourceOriginList />
    </AuthenticatedLayout>
  );
};

export default ProjectSourceOriginsPage;
