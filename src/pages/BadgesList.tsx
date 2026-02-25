import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminBadges, useCreateBadge, useUpdateBadge } from "@/hooks/useBadges";
import { BadgeAdmin, BadgeCreateData } from "@/api/badges";
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
import { Search, Edit, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function BadgesList() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const { data: badges, isLoading, isError } = useAdminBadges();

    const createMutation = useCreateBadge();
    const updateMutation = useUpdateBadge();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBadge, setEditingBadge] = useState<BadgeAdmin | null>(null);

    const [formData, setFormData] = useState<BadgeCreateData>({
        slug: "",
        name: "",
        description: "",
        emoji: "🏆",
        badge_type: "user",
        trigger_metric: "events_attended",
        threshold: 1,
    });

    const filteredBadges = badges?.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.slug.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleOpenCreate = () => {
        setEditingBadge(null);
        setFormData({
            slug: "",
            name: "",
            description: "",
            emoji: "🏆",
            badge_type: "user",
            trigger_metric: "events_attended",
            threshold: 1,
        });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (badge: BadgeAdmin) => {
        setEditingBadge(badge);
        setFormData({
            slug: badge.slug,
            name: badge.name,
            description: badge.description,
            emoji: badge.emoji,
            badge_type: badge.badge_type,
            trigger_metric: badge.trigger_metric,
            threshold: badge.threshold,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingBadge) {
                await updateMutation.mutateAsync({ id: editingBadge.id, data: formData });
                toast.success("Badge updated successfully");
            } else {
                await createMutation.mutateAsync(formData);
                toast.success("Badge created successfully");
            }
            setIsDialogOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to save badge");
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 md:space-y-6">
            <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col">
                    <h2 className="bebas text-[28px] md:text-[32px] lg:text-[40px] tracking-wide text-black">Badge Management</h2>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                        Create, update, and monitor Gamification Badges for Users and Clubs.
                    </p>
                </div>
                <Button onClick={handleOpenCreate} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Badge
                </Button>
            </div>

            <div className="flex-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search badges..."
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
                                <TableHead className="w-16">Emoji</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Trigger Logic</TableHead>
                                <TableHead>Threshold</TableHead>
                                <TableHead>Claimed Count</TableHead>
                                <TableHead className="text-right sticky right-0 bg-secondary z-20 shadow-[-1px_0_0_#e2e8f0]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                        Loading badges...
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-destructive">
                                        Error loading badge data.
                                    </TableCell>
                                </TableRow>
                            ) : filteredBadges.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                        No badges found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBadges.map((badge) => (
                                    <TableRow key={badge.id}>
                                        <TableCell className="text-2xl">{badge.emoji}</TableCell>
                                        <TableCell className="font-medium">
                                            {badge.name}
                                            <div className="text-xs text-muted-foreground font-normal">{badge.description}</div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{badge.slug}</code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={badge.badge_type === "user" ? "default" : "secondary"}>
                                                {badge.badge_type.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm border-b-0">
                                            {badge.trigger_metric}
                                        </TableCell>
                                        <TableCell className="font-medium">{badge.threshold}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-mono bg-blue-50 text-blue-600 border-blue-200">
                                                {badge.claimed_count} claimed
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right sticky right-0 bg-card z-10 shadow-[-1px_0_0_#e2e8f0]">
                                            <Button variant="ghost" size="icon" onClick={() => navigate(`/badges/${badge.id}`)} title="View analytics">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(badge)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingBadge ? "Edit Badge" : "Create Badge"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-3 space-y-2">
                                <Label>Name</Label>
                                <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Winner" />
                            </div>
                            <div className="col-span-1 space-y-2">
                                <Label>Emoji</Label>
                                <Input required value={formData.emoji} onChange={(e) => setFormData({ ...formData, emoji: e.target.value })} placeholder="🏆" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Slug</Label>
                            <Input required value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="e.g. winner" disabled={!!editingBadge} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Input required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Awarded for winning an event" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <select
                                    className="w-full flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.badge_type}
                                    onChange={(e) => setFormData({ ...formData, badge_type: e.target.value })}
                                >
                                    <option value="user">User</option>
                                    <option value="club">Club</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Trigger Metric</Label>
                                <Input required value={formData.trigger_metric} onChange={(e) => setFormData({ ...formData, trigger_metric: e.target.value })} placeholder="e.g. events_won" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Threshold</Label>
                            <Input type="number" required value={formData.threshold} onChange={(e) => setFormData({ ...formData, threshold: Number(e.target.value) })} />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>Save</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
