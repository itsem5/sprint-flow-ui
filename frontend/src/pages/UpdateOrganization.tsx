
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { useGetOrganization, useUpdateOrganization } from "@/api/organizations/organization"; // Will update this hook

const UpdateOrganization = () => {
  const navigate = useNavigate();
  const { organizationId } = useParams<{ organizationId: string }>();
  const orgId = organizationId ? parseInt(organizationId) : undefined;

  const { data: organizationData, isLoading, isError } = useGetOrganization(orgId);
  const updateOrganizationMutation = useUpdateOrganization();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (organizationData) {
      setFormData({
        name: organizationData.name || "",
        description: organizationData.description || "",
      });
    }
  }, [organizationData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Organization name is required");
      return;
    }

    if (orgId === undefined) {
      toast.error("Organization ID is missing.");
      return;
    }

    updateOrganizationMutation.mutate({ id: orgId, ...formData }, {
      onSuccess: () => {
        toast.success("Organization updated successfully!");
        navigate("/dashboard"); // Navigate to dashboard after organization update
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
    return <div className="min-h-screen flex items-center justify-center">Loading organization data...</div>;
  }

  if (isError || !organizationData) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading organization or organization not found.</div>;
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
            <CardTitle className="text-2xl">Update Organization</CardTitle>
            <CardDescription>
              Modify your organization details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="My Awesome Org"
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
                  placeholder="A brief description of your organization"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit" className="w-full">
                Update Organization
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrganization;
