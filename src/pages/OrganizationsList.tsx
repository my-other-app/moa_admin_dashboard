import { useState } from "react";
import { useOrgs, useDeleteOrg, useBlockOrg, useImportOrgs, useCreateOrg, useUpdateOrg, useOrgAnalytics } from "@/hooks/useOrgs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash2, ShieldBan, ShieldCheck, Plus, Upload, BarChart } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
export function OrganizationsList() {
    const [search, setSearch] = useState("");

    const { data: orgs, isLoading, isError } = useOrgs();
    const createMutation = useCreateOrg();
    const updateMutation = useUpdateOrg();
    const deleteMutation = useDeleteOrg();
    const blockMutation = useBlockOrg();
    const importMutation = useImportOrgs();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addForm, setAddForm] = useState({ name: "", type: "College", email: "", phone: "", address: "", website: "" });
    const [addLogo, setAddLogo] = useState<File | null>(null);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);
    const [editLogo, setEditLogo] = useState<File | null>(null);

    const [analyticsOrgId, setAnalyticsOrgId] = useState<number | null>(null);
    const { data: analyticsData, isLoading: isAnalyticsLoading } = useOrgAnalytics(analyticsOrgId);

    const filteredOrgs = orgs?.filter((org: any) =>
        org.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            toast.loading("Importing organizations...", { id: "import" });
            importMutation.mutate(file, {
                onSuccess: () => {
                    toast.success("Successfully imported organizations!", { id: "import" });
                },
                onError: () => {
                    toast.error("Failed to import organizations.", { id: "import" });
                }
            });
            e.target.value = "";
        }
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.loading("Creating organization...", { id: "createOrgs" });
        const data: any = { ...addForm };
        if (addLogo) data.logo = addLogo;

        createMutation.mutate(data, {
            onSuccess: () => {
                toast.success("Organization created successfully", { id: "createOrgs" });
                setIsAddOpen(false);
                setAddForm({ name: "", type: "College", email: "", phone: "", address: "", website: "" });
                setAddLogo(null);
            },
            onError: () => {
                toast.error("Failed to create organization", { id: "createOrgs" });
            }
        });
    };

    const openEditModal = (org: any) => {
        setEditForm({
            id: org.id,
            name: org.name || "",
            type: org.type || "College",
            email: org.email || "",
            phone: org.phone || "",
            address: org.address || "",
            website: org.website || ""
        });
        setEditLogo(null);
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.loading("Updating organization...", { id: "updateOrgs" });
        const data: any = { ...editForm };
        const id = data.id;
        delete data.id; // remove id from payload
        if (editLogo) data.logo = editLogo;

        updateMutation.mutate({ id, data }, {
            onSuccess: () => {
                toast.success("Organization updated successfully", { id: "updateOrgs" });
                setIsEditOpen(false);
            },
            onError: () => {
                toast.error("Failed to update organization", { id: "updateOrgs" });
            }
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] space-y-4 md:space-y-6">
            <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col mb-2">
                    <h2 className="bebas text-[28px] md:text-[32px] lg:text-[40px] tracking-wide text-black">Organizations</h2>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                        Manage organizations, edit details, block access, and bulk import records.
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" className="shadow-sm">
                        <label className="cursor-pointer flex items-center">
                            <Upload className="h-4 w-4 mr-2" />
                            Import CSV
                            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={handleImport} disabled={importMutation.isPending} />
                        </label>
                    </Button>
                    <Button onClick={() => setIsAddOpen(true)} className="bg-[#2C333D] text-[#F9FFA1] hover:bg-[#3A4556]">
                        <Plus className="h-4 w-4 mr-2" /> Add Org
                    </Button>
                </div>
            </div>

            <div className="flex-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search organizations..."
                        className="pl-8 w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 flex flex-col rounded-md border bg-card overflow-hidden min-h-0">
                <div className="flex-1 overflow-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader className="sticky top-0 bg-secondary z-10 shadow-sm">
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Logo</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right sticky right-0 bg-secondary z-20 shadow-[-1px_0_0_#e2e8f0]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                        Loading organizations...
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-destructive">
                                        Error loading database. Please try again.
                                    </TableCell>
                                </TableRow>
                            ) : filteredOrgs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                        No organizations found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrgs.map((org: any) => (
                                    <TableRow key={org.id}>
                                        <TableCell className="font-medium">#{org.id}</TableCell>
                                        <TableCell>
                                            {org.logo ? (
                                                <img src={typeof org.logo === 'string' ? org.logo : (org.logo?.thumbnail || org.logo?.original || org.logo?.url || '')} alt={org.name} className="h-8 w-8 rounded-full object-cover" />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                                                    N/A
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="max-w-[150px] truncate font-semibold">{org.name}</TableCell>
                                        <TableCell className="capitalize">{org.type}</TableCell>
                                        <TableCell>
                                            <div className="text-sm truncate max-w-[150px]">{org.email || "No Email"}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[150px]">{org.phone || "No Phone"}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={org.is_blocked ? "destructive" : (org.is_verified ? "default" : "secondary")} className="font-medium">
                                                {org.is_blocked ? "Blocked" : (org.is_verified ? "Verified" : "Pending")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2 sticky right-0 bg-card z-10 shadow-[-1px_0_0_#e2e8f0]">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                title="View Analytics"
                                                onClick={() => setAnalyticsOrgId(org.id)}
                                            >
                                                <BarChart className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                title="Edit"
                                                onClick={() => openEditModal(org)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={org.is_blocked ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"}
                                                disabled={blockMutation.isPending}
                                                onClick={() => {
                                                    toast.loading(`Toggling status for ${org.name}...`, { id: "blockOrg" });
                                                    blockMutation.mutate(org.id, {
                                                        onSuccess: () => toast.success("Status updated!", { id: "blockOrg" }),
                                                        onError: () => toast.error("Failed to update status", { id: "blockOrg" })
                                                    });
                                                }}
                                                title={org.is_blocked ? "Unblock" : "Block"}
                                            >
                                                {org.is_blocked ? <ShieldCheck className="h-4 w-4" /> : <ShieldBan className="h-4 w-4" />}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-red-50"
                                                disabled={deleteMutation.isPending}
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete this organization?")) {
                                                        toast.loading("Deleting...", { id: "delOrg" });
                                                        deleteMutation.mutate(org.id, {
                                                            onSuccess: () => toast.success("Organization deleted", { id: "delOrg" }),
                                                            onError: () => toast.error("Failed to delete", { id: "delOrg" })
                                                        });
                                                    }
                                                }}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {/* Add Org Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Organization</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Organization Name</Label>
                            <Input id="name" required value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Organization Type</Label>
                            <select id="type" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={addForm.type} onChange={e => setAddForm({ ...addForm, type: e.target.value })}>
                                <option value="School">School</option>
                                <option value="College">College</option>
                                <option value="University">University</option>
                                <option value="Company">Company</option>
                                <option value="NGO">NGO</option>
                                <option value="Community">Community</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" value={addForm.address} onChange={e => setAddForm({ ...addForm, address: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo Image</Label>
                            <Input id="logo" type="file" accept="image/*" onChange={e => setAddLogo(e.target.files?.[0] || null)} />
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={createMutation.isPending} className="bg-[#2C333D] text-[#F9FFA1]">Save Organization</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Org Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Organization</DialogTitle>
                    </DialogHeader>
                    {editForm && (
                        <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Organization Name</Label>
                                <Input id="edit-name" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-type">Organization Type</Label>
                                <select id="edit-type" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })}>
                                    <option value="School">School</option>
                                    <option value="College">College</option>
                                    <option value="University">University</option>
                                    <option value="Company">Company</option>
                                    <option value="NGO">NGO</option>
                                    <option value="Community">Community</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input id="edit-email" type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-phone">Phone</Label>
                                    <Input id="edit-phone" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-address">Address</Label>
                                <Input id="edit-address" value={editForm.address} onChange={e => setEditForm({ ...editForm, address: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-logo">Update Logo Image (Optional)</Label>
                                <Input id="edit-logo" type="file" accept="image/*" onChange={e => setEditLogo(e.target.files?.[0] || null)} />
                            </div>
                            <DialogFooter className="mt-6">
                                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={updateMutation.isPending} className="bg-[#2C333D] text-[#F9FFA1]">Update Organization</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Analytics Modal */}
            <Dialog open={!!analyticsOrgId} onOpenChange={(open) => !open && setAnalyticsOrgId(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Organization Analytics</DialogTitle>
                    </DialogHeader>
                    <div className="py-6">
                        {isAnalyticsLoading ? (
                            <div className="text-center py-4 text-muted-foreground animate-pulse">
                                Loading deeply nested metrics...
                            </div>
                        ) : analyticsData ? (
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                                    <div className="text-sm font-medium text-gray-500">Total Affiliated Clubs</div>
                                    <div className="text-2xl font-bold font-mono">{analyticsData.total_clubs}</div>
                                </div>
                                <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                                    <div className="text-sm font-medium text-gray-500">Total Hosted Events</div>
                                    <div className="text-2xl font-bold font-mono">{analyticsData.total_events}</div>
                                </div>
                                <div className="p-4 border rounded-lg bg-gray-50 flex items-center justify-between">
                                    <div className="text-sm font-medium text-gray-500">Total Ecosystem Followers</div>
                                    <div className="text-2xl font-bold font-mono">{analyticsData.total_followers}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 text-destructive">
                                Failed to load analytics data.
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={() => setAnalyticsOrgId(null)} className="bg-[#2C333D] text-[#F9FFA1]">Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
