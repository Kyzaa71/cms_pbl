"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Trash2 } from "lucide-react";
import { projectService } from "@/lib/services/project-service";
import { Project } from "@/types/backend-models";

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const projectId = Number(id);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDummyMode, setIsDummyMode] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        // Try to fetch specific project first
        try {
          const data = await projectService.getProjectById(projectId);
          if (data) {
            setProject(data);
            setFormData({
              name: data.name,
              description: data.description || "",
            });
            setIsDummyMode(false);
            return;
          }
        } catch (err) {
          console.warn("Failed to fetch project by ID, trying fallback list or dummy", err);
        }

        // Fallback: Try to find in all projects list
        try {
          const projects = await projectService.getAllProjects();
          const found = projects.find(p => p.id === projectId);
          
          if (found) {
            setProject(found);
            setFormData({
              name: found.name,
              description: found.description || "",
            });
            setIsDummyMode(false);
            return;
          }
        } catch (err) {
           console.warn("Failed to fetch all projects", err);
        }

        // Final Fallback: Dummy Data (as requested by user if backend fails)
        // "jika tidak ada maka biarkan kembalikan ke dummy tapi ganti isi ke profesional"
        console.log("Using dummy data for organization settings");
        const dummyProject: Project = {
          id: projectId,
          name: "Acme Corporation",
          description: "Enterprise-grade content management system for high-scale operations.",
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          members: Array(12).fill(null).map((_, i) => ({
             id: i,
             project_id: projectId,
             user_id: i,
             role_id: 1,
             status: "active",
             invited_by: 1,
             created_at: new Date().toISOString(),
             updated_at: new Date().toISOString()
          }))
        };
        setProject(dummyProject);
        setFormData({
          name: dummyProject.name,
          description: dummyProject.description || "",
        });
        setIsDummyMode(true);

      } catch (error) {
        console.error("Critical error in project fetch", error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleSave = async () => {
    if (!project) return;
    
    try {
      setSaving(true);
      
      if (!isDummyMode) {
        await projectService.updateProject(projectId, {
          name: formData.name,
          description: formData.description,
        });
      } else {
        // Simulate network delay for dummy mode
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log("Dummy mode: Settings saved locally");
      }
      
      // Update local state
      setProject({
        ...project,
        name: formData.name,
        description: formData.description,
      });
      
      // Update localStorage if this is the active project
      const activeId = window.localStorage.getItem("active_project_id");
      if (activeId && Number(activeId) === projectId) {
        window.localStorage.setItem("active_project_name", formData.name);
        // Dispatch storage event to update other components listening to it
        window.dispatchEvent(new Event("storage")); 
      }
      
      alert(isDummyMode ? "Organization settings updated (Demo Mode)" : "Organization settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this organization? This action cannot be undone.")) {
      return;
    }
    
    const confirmName = prompt(`Please type "${project?.name}" to confirm deletion:`);
    if (confirmName !== project?.name) {
      alert("Organization name does not match. Deletion cancelled.");
      return;
    }

    try {
      setDeleting(true);
      
      if (!isDummyMode) {
        await projectService.deleteProject(projectId);
      } else {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Dummy mode: Organization deleted");
      }
      
      // Clear active project if deleted
      const activeId = window.localStorage.getItem("active_project_id");
      if (activeId && Number(activeId) === projectId) {
        window.localStorage.removeItem("active_project_id");
        window.localStorage.removeItem("active_project_name");
      }
      
      alert(isDummyMode ? "Organization deleted (Demo Mode)" : "Organization deleted successfully.");
      router.push("/dashboard"); 
    } catch (error) {
      console.error("Failed to delete organization", error);
      alert("Failed to delete organization.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-center text-[var(--muted-foreground)]">
        Organization not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Organization Settings</h1>
        <p className="text-[var(--muted-foreground)] mt-2">
          Manage your organization details and preferences.
        </p>
      </div>

      <Card className="border-[var(--border)] bg-[var(--card-bg-inner)]">
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>
            Update your organization's name and description.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Acme Corp"
              className="max-w-md bg-[var(--input-bg)] border-[var(--border)]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your organization..."
              className="max-w-md min-h-[100px] bg-[var(--input-bg)] border-[var(--border)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-[var(--border)]">
            <div className="space-y-1">
              <Label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">Organization ID</Label>
              <div className="font-medium font-mono text-sm bg-[var(--muted)]/50 px-2 py-1 rounded w-fit">#{project.id}</div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">Created At</Label>
              <div className="font-medium text-sm">
                {new Date(project.created_at).toLocaleDateString("en-US", {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-[var(--muted-foreground)] uppercase tracking-wider">Members</Label>
              <div className="font-medium text-sm">
                {project.members?.length || 0} Members
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-[var(--border)] px-6 py-4 bg-[var(--card-bg)]/50">
          <Button 
            onClick={handleSave} 
            disabled={saving || !formData.name.trim()}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[color-mix(in srgb, var(--primary) 90%, black)]"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-500">Danger Zone</CardTitle>
          <CardDescription className="text-red-600/80 dark:text-red-400/80">
            Irreversible actions for this organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-white dark:bg-transparent">
            <div>
              <h3 className="font-medium text-red-600 dark:text-red-500">Delete Organization</h3>
              <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1">
                Once you delete an organization, there is no going back. Please be certain.
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Organization
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
