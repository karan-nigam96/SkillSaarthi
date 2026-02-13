import ProjectsList from "@/components/ProjectsList";
import ProjectApplicationForm from "@/components/ProjectApplicationForm";

export default function ProjectsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="container mx-auto px-4 md:px-6 pb-20 pt-6">
                <ProjectsList />
                <ProjectApplicationForm />
            </div>
        </div>
    );
}
