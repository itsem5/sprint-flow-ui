
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { useCreateProject } from "@/api/projects/project";

const CreateProject = () => {
  const navigate = useNavigate();
  const createProjectMutation = useCreateProject();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Project name is required");
      return;
    }

    createProjectMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Project created successfully!");
        navigate("/projects"); // Navigate to projects list after creation
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
            <CardTitle className="text-2xl">Create New Project</CardTitle>
            <CardDescription>
              Set up your new project to start organizing tasks
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
                Create Project
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

export default CreateProject;
