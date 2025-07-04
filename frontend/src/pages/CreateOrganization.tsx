
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { useCreateOrganization, useSearchOrganizations, useAssignUserToOrganization } from "@/api/organizations/organization";
import { useAuth } from "@/contexts/AuthContext";

const CreateOrganization = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createOrganizationMutation = useCreateOrganization();
  const assignUserMutation = useAssignUserToOrganization();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults } = useSearchOrganizations(searchQuery);
  const [mode, setMode] = useState('create'); // 'create' or 'search'
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);

  useEffect(() => {
    if (user && user.organization) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Organization name is required");
      return;
    }

    createOrganizationMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Organization created successfully!");
      },
      onError: (error) => {
        toast.error(error.message || "An error occurred");
      },
    });
  };

  const handleJoinOrganization = () => {
    if (selectedOrganizationId) {
      assignUserMutation.mutate(selectedOrganizationId, {
        onSuccess: () => {
          toast.success("Successfully joined organization!");
        },
        onError: (error) => {
          toast.error(error.message || "An error occurred");
        },
      });
    }
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
            <CardTitle className="text-2xl">{mode === 'create' ? 'Create Your Organization' : 'Join an Organization'}</CardTitle>
            <CardDescription>
              {mode === 'create' ? 'Set up your organization to get started with SprintFlow' : 'Search for your organization to join'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mode === 'create' ? (
              <form onSubmit={handleCreateSubmit} className="space-y-4">
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
                  Create Organization
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Search for your organization..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedOrganizationId(null);
                  }}
                />
                {searchResults && searchResults.length > 0 && (
                  <ul className="space-y-2 border rounded-md p-2 max-h-48 overflow-y-auto">
                    {searchResults.map((org) => (
                      <li
                        key={org.id}
                        className={`p-2 cursor-pointer rounded-md ${selectedOrganizationId === org.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                        onClick={() => setSelectedOrganizationId(org.id)}
                      >
                        {org.name}
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  onClick={handleJoinOrganization}
                  disabled={!selectedOrganizationId}
                  className="w-full"
                >
                  Join Selected Organization
                </Button>
              </div>
            )}
            <div className="text-center mt-4">
              <Button variant="link" onClick={() => setMode(mode === 'create' ? 'search' : 'create')}>
                {mode === 'create' ? 'Or join an existing organization' : 'Or create a new organization'}
              </Button>
            </div>
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

export default CreateOrganization;
