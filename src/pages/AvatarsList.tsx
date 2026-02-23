import { useState } from "react";
import { useAvatars, useCreateAvatar, useUpdateAvatar, useDeleteAvatar } from "@/hooks/useAvatars";
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
import { Search, Edit, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function AvatarsList() {
    const [search, setSearch] = useState("");

    // React Query Hooks
    const { data: avatars, isLoading, isError } = useAvatars();
    const createMutation = useCreateAvatar();
    const updateMutation = useUpdateAvatar();
    const deleteMutation = useDeleteAvatar();

    // Modal States
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [addForm, setAddForm] = useState<{ name: string, file: File | null }>({ name: "", file: null });

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editForm, setEditForm] = useState<{ id: number, name: string, file: File | null }>({ id: 0, name: "", file: null });

    const filteredAvatars = avatars?.filter((avatar: any) =>
        avatar.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!addForm.name || !addForm.file) {
            toast.error("Both name and an image file are required.");
            return;
        }

        toast.loading("Uploading avatar...", { id: "createAvatar" });
        createMutation.mutate(
            { name: addForm.name, file: addForm.file },
            {
                onSuccess: () => {
                    toast.success("Avatar created successfully!", { id: "createAvatar" });
                    setIsAddOpen(false);
                    setAddForm({ name: "", file: null });
                },
                onError: () => toast.error("Failed to create avatar.", { id: "createAvatar" })
            }
        );
    };

    const openEditModal = (avatar: any) => {
        setEditForm({ id: avatar.id, name: avatar.name, file: null });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.loading("Updating avatar...", { id: "updateAvatar" });

        updateMutation.mutate(
            { id: editForm.id, name: editForm.name || undefined, file: editForm.file || undefined },
            {
                onSuccess: () => {
                    toast.success("Avatar updated successfully!", { id: "updateAvatar" });
                    setIsEditOpen(false);
                },
                onError: () => toast.error("Failed to update avatar.", { id: "updateAvatar" })
            }
        );
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] space-y-4 md:space-y-6">
            <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col mb-2">
                    <h2 className="bebas text-[28px] md:text-[32px] lg:text-[40px] tracking-wide text-black">Avatar Gallery</h2>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                        Manage global platform avatars available for user profiles.
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button onClick={() => setIsAddOpen(true)} className="bg-[#2C333D] text-[#F9FFA1] hover:bg-[#3A4556]">
                        <Plus className="h-4 w-4 mr-2" /> Add Avatar
                    </Button>
                </div>
            </div>

            <div className="flex-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search avatars..."
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
                                <TableHead>Image preview</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right sticky right-0 bg-secondary z-20 shadow-[-1px_0_0_#e2e8f0]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                        Loading avatars...
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-destructive">
                                        Error loading database. Please try again.
                                    </TableCell>
                                </TableRow>
                            ) : filteredAvatars.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                        No avatars found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAvatars.map((avatar: any) => (
                                    <TableRow key={avatar.id}>
                                        <TableCell className="font-medium">#{avatar.id}</TableCell>
                                        <TableCell>
                                            {avatar.image ? (
                                                <img src={typeof avatar.image === 'string' ? avatar.image : (avatar.image?.thumbnail || avatar.image?.original || avatar.image?.url || '')} alt={avatar.name} className="h-12 w-12 rounded-full object-cover border" />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center border text-gray-500">
                                                    <ImageIcon className="h-5 w-5" />
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-semibold text-base">{avatar.name}</TableCell>
                                        <TableCell className="text-right space-x-2 sticky right-0 bg-card z-10 shadow-[-1px_0_0_#e2e8f0]">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                title="Edit"
                                                onClick={() => openEditModal(avatar)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-red-50"
                                                disabled={deleteMutation.isPending}
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete ${avatar.name}?`)) {
                                                        toast.loading("Deleting avatar...", { id: "delAvatar" });
                                                        deleteMutation.mutate(avatar.id, {
                                                            onSuccess: () => toast.success("Avatar deleted", { id: "delAvatar" }),
                                                            onError: () => toast.error("Failed to delete", { id: "delAvatar" })
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
            {/* Add Avatar Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Avatar</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Avatar Name</Label>
                            <Input id="name" required value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="file">Avatar Image</Label>
                            <Input id="file" type="file" required accept="image/*" onChange={e => setAddForm({ ...addForm, file: e.target.files?.[0] || null })} />
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={createMutation.isPending} className="bg-[#2C333D] text-[#F9FFA1]">Save Avatar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Avatar Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Avatar</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Avatar Name</Label>
                            <Input id="edit-name" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-file">Update Image (Optional)</Label>
                            <Input id="edit-file" type="file" accept="image/*" onChange={e => setEditForm({ ...editForm, file: e.target.files?.[0] || null })} />
                        </div>
                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={updateMutation.isPending} className="bg-[#2C333D] text-[#F9FFA1]">Update Avatar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
