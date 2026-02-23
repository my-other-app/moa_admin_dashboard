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

export function AvatarsList() {
    const [search, setSearch] = useState("");

    // React Query Hooks
    const { data: avatars, isLoading, isError } = useAvatars();
    const createMutation = useCreateAvatar();
    const updateMutation = useUpdateAvatar();
    const deleteMutation = useDeleteAvatar();

    const filteredAvatars = avatars?.filter(avatar =>
        avatar.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleCreate = () => {
        const title = prompt("Enter avatar name:");
        if (!title) return;

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            if (file) {
                createMutation.mutate({ name: title, file });
            }
        };
        input.click();
    };

    const handleUpdate = (id: number, currentName: string) => {
        const title = prompt("Enter new avatar name (leave empty to keep current):", currentName);
        if (title === null) return;

        const action = prompt("Type '1' to update only name, '2' to update name and image.");
        if (action === '1') {
            updateMutation.mutate({ id, name: title || undefined });
        } else if (action === '2') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e: any) => {
                const file = e.target.files[0];
                if (file) {
                    updateMutation.mutate({ id, name: title || undefined, file });
                }
            };
            input.click();
        }
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
                    <Button onClick={handleCreate} className="bg-[#2C333D] text-[#F9FFA1] hover:bg-[#3A4556]">
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
                                filteredAvatars.map((avatar) => (
                                    <TableRow key={avatar.id}>
                                        <TableCell className="font-medium">#{avatar.id}</TableCell>
                                        <TableCell>
                                            {avatar.image ? (
                                                <img src={avatar.image.bytes || avatar.image.filename} alt={avatar.name} className="h-12 w-12 rounded-full object-cover border" />
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
                                                onClick={() => handleUpdate(avatar.id, avatar.name)}
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
                                                        deleteMutation.mutate(avatar.id);
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
        </div>
    );
}
