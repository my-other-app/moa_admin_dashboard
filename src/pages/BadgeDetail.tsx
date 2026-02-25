import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBadgeRecipients, useBadgeStats, useAwardBadge, useRevokeBadge } from "@/hooks/useBadges";
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
import { ArrowLeft, Search, Plus, UserX, Trophy, TrendingUp, Calendar, Users } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function BadgeDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const badgeId = id ? parseInt(id) : null;

    const { data: recipientsData, isLoading: recipientsLoading } = useBadgeRecipients(badgeId);
    const { data: statsData, isLoading: statsLoading } = useBadgeStats(badgeId);
    const awardMutation = useAwardBadge();
    const revokeMutation = useRevokeBadge();

    const [search, setSearch] = useState("");
    const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false);
    const [entityId, setEntityId] = useState("");

    const badge = recipientsData?.badge || statsData?.badge;

    const filteredRecipients = recipientsData?.recipients.filter((r) =>
        r.entity_name.toLowerCase().includes(search.toLowerCase()) ||
        (r.entity_email && r.entity_email.toLowerCase().includes(search.toLowerCase()))
    ) || [];

    const handleAward = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!badgeId || !entityId) return;
        try {
            await awardMutation.mutateAsync({ badgeId, entityId: parseInt(entityId) });
            toast.success("Badge awarded successfully!");
            setIsAwardDialogOpen(false);
            setEntityId("");
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to award badge");
        }
    };

    const handleRevoke = async (entityId: number, entityName: string) => {
        if (!badgeId || !confirm(`Revoke this badge from ${entityName}?`)) return;
        try {
            await revokeMutation.mutateAsync({ badgeId, entityId });
            toast.success("Badge revoked");
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to revoke badge");
        }
    };

    if (!badgeId) return <div>Invalid badge ID</div>;

    const isLoading = recipientsLoading || statsLoading;

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/badges")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center gap-3">
                        {badge && <span className="text-4xl">{badge.emoji}</span>}
                        <div>
                            <h2 className="bebas text-[28px] md:text-[32px] lg:text-[40px] tracking-wide text-black leading-none">
                                {badge?.name || "Badge"}
                            </h2>
                            <p className="text-sm text-gray-600 mt-0.5">
                                {badge?.description}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {badge && (
                        <div className="flex items-center gap-2">
                            <Badge variant={badge.badge_type === "user" ? "default" : "secondary"}>
                                {badge.badge_type.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                                {badge.trigger_metric} ≥ {badge.threshold}
                            </Badge>
                        </div>
                    )}
                    <Button onClick={() => setIsAwardDialogOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Award Badge
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            {!statsLoading && statsData && (
                <div className="flex-none grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Trophy className="w-4 h-4" />
                            <span className="text-xs font-medium">Total Awarded</span>
                        </div>
                        <p className="text-2xl font-bold">{statsData.total_awarded}</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs font-medium">Last 30 Days</span>
                        </div>
                        <p className="text-2xl font-bold">{statsData.awards_last_30_days}</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-medium">Last 7 Days</span>
                        </div>
                        <p className="text-2xl font-bold">{statsData.awards_last_7_days}</p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Users className="w-4 h-4" />
                            <span className="text-xs font-medium">Recipients</span>
                        </div>
                        <p className="text-2xl font-bold">{recipientsData?.total || 0}</p>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="flex-none flex items-center justify-between gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search recipients..."
                        className="pl-8 w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <p className="text-sm text-muted-foreground">
                    {filteredRecipients.length} recipient{filteredRecipients.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Recipients Table */}
            <div className="flex-1 flex flex-col rounded-md border bg-card overflow-hidden min-h-0">
                <div className="flex-1 overflow-auto">
                    <Table className="min-w-[600px]">
                        <TableHeader className="sticky top-0 bg-secondary z-10 shadow-sm">
                            <TableRow>
                                <TableHead>{badge?.badge_type === "club" ? "Club" : "User"} ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Awarded At</TableHead>
                                <TableHead className="text-right sticky right-0 bg-secondary z-20 shadow-[-1px_0_0_#e2e8f0]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        Loading recipients...
                                    </TableCell>
                                </TableRow>
                            ) : filteredRecipients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No recipients found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRecipients.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell>
                                            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">#{r.entity_id}</code>
                                        </TableCell>
                                        <TableCell className="font-medium">{r.entity_name}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{r.entity_email || "—"}</TableCell>
                                        <TableCell className="text-sm">
                                            {new Date(r.awarded_at).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right sticky right-0 bg-card z-10 shadow-[-1px_0_0_#e2e8f0]">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleRevoke(r.entity_id, r.entity_name)}
                                                disabled={revokeMutation.isPending}
                                            >
                                                <UserX className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Award Dialog */}
            <Dialog open={isAwardDialogOpen} onOpenChange={setIsAwardDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Award Badge Manually</DialogTitle>
                        <DialogDescription>
                            Enter the {badge?.badge_type === "club" ? "Club" : "User"} ID to award the {badge?.emoji} {badge?.name} badge.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAward} className="space-y-4">
                        <div className="space-y-2">
                            <Label>{badge?.badge_type === "club" ? "Club" : "User"} ID</Label>
                            <Input
                                type="number"
                                required
                                value={entityId}
                                onChange={(e) => setEntityId(e.target.value)}
                                placeholder="e.g. 42"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsAwardDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={awardMutation.isPending}>
                                {awardMutation.isPending ? "Awarding..." : "Award Badge"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
