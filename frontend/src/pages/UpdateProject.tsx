
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { useGetProject, useUpdateProject } from "@/api/projects/project";

const UpdateProject = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const { data: projectData, isLoading, isError } = useGetProject(projectId || "");
  const updateProjectMutation = useUpdateProject();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (projectData) {
      setFormData({
        name: projectData.name || "",
        description: projectData.description || "",
      });
    }
  }, [projectData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Project name is required");
      return;
    }

    if (!projectId) {
      toast.error("Project ID is missing.");
      return;
    }

    updateProjectMutation.mutate({ id: projectId, ...formData }, {
      onSuccess: () => {
        toast.success("Project updated successfully!");
        navigate("/projects"); // Navigate to projects list after update
      },
      onError: (error) => {
        toast.error(error.message || "An error occurred");
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading project data...</div>;
  }

  if (isError || !projectData) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading project or project not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold">SprintFlow</h1>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Update Project</CardTitle>
            <CardDescription>
              Modify your project details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="My Awesome Project"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="A brief description of your project"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit" className="w-full">
                Update Project
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/projects" className="text-sm text-gray-600 hover:underline">
            ← Back to Projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject;
