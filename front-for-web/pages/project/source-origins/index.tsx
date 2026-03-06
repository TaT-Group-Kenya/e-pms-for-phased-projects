import SourceOriginList from "../../../components/project/SourceOriginList/SourceOriginList";
import AuthenticatedLayout from "../../../components/authenticated/AuthenticatedLayout";
import Can from "../../../components/auth/Can";

const ProjectSourceOriginsPage = () => {
  return (
    <AuthenticatedLayout>
      <Can any={["ROLE_VIEW_PROJECT_SOURCE_ORIGIN"]} fallback={<div>You do not have permission to view project sources.</div>}>
        <SourceOriginList />
      </Can>
    </AuthenticatedLayout>
  );
};

export default ProjectSourceOriginsPage;
