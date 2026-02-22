import { useState } from "react";
import { useClubs, useApproveClub } from "@/hooks/useClubs";
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
import { Search, ChevronLeft, ChevronRight, CheckCircle2, ShieldBan } from "lucide-react";

export function ClubsList() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Pending status filter could be added via dropdown, but listing all for now
    const { data, isLoading, isError } = useClubs(page, size, debouncedSearch);
    const approveMutation = useApproveClub();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
        setTimeout(() => {
            if (e.target.value === search) {
                setDebouncedSearch(e.target.value);
            }
        }, 500);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setDebouncedSearch(search);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] space-y-4 md:space-y-6">
            <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col mb-2">
                    <h2 className="bebas text-[28px] md:text-[32px] lg:text-[40px] tracking-wide text-black">Club Directory</h2>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                        View, approve, and manage organizations across the MOA ecosystem.
                    </p>
                </div>
            </div>

            <div className="flex-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search clubs by name..."
                        className="pl-8 w-full"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </form>
            </div>

            <div className="flex-1 flex flex-col rounded-md border bg-card overflow-hidden min-h-0">
                <div className="flex-1 overflow-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader className="sticky top-0 bg-secondary z-10 shadow-sm">
                            <TableRow>
                                <TableHead>Club ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Interests</TableHead>
                                <TableHead className="text-right sticky right-0 bg-secondary z-20 shadow-[-1px_0_0_#e2e8f0]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                        Loading clubs...
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-destructive">
                                        Error loading club data. Please try again.
                                    </TableCell>
                                </TableRow>
                            ) : data?.items?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                        No clubs found matching "{debouncedSearch}"
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.items?.map((club) => (
                                    <TableRow key={club.id}>
                                        <TableCell className="font-medium">#{club.id}</TableCell>
                                        <TableCell className="max-w-[200px] truncate">{club.name}</TableCell>
                                        <TableCell className="max-w-[300px] truncate" title={club.about}>{club.about || "N/A"}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${club.status === "pending" ? "border-yellow-500 text-yellow-600" :
                                                club.status === "approved" || club.is_verified ? "border-green-500 text-green-600" :
                                                    "border-muted text-muted-foreground"
                                                }`}>
                                                {(club.status || (club.is_verified ? "approved" : "pending")).toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {club.created_at ? new Date(club.created_at).toLocaleDateString() : "N/A"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 max-w-[250px]">
                                                {club.interests && club.interests.length > 0 ? (
                                                    <>
                                                        {club.interests.slice(0, 3).map((interest) => (
                                                            <Badge key={interest.id} variant="secondary" className="font-normal text-[10px] px-1.5 py-0 h-5">
                                                                {interest.name}
                                                            </Badge>
                                                        ))}
                                                        {club.interests.length > 3 && (
                                                            <Badge variant="outline" className="font-normal text-[10px] px-1.5 py-0 h-5">
                                                                +{club.interests.length - 3}
                                                            </Badge>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs italic">No interests</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2 sticky right-0 bg-card z-10 shadow-[-1px_0_0_#e2e8f0]">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                disabled={approveMutation.isPending || club.status === "approved" || club.is_verified}
                                                onClick={() => approveMutation.mutate(club.id)}
                                                title="Approve Club"
                                            >
                                                <CheckCircle2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-red-50"
                                                title="Reject / Ban"
                                            >
                                                <ShieldBan className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {data && (
                    <div className="flex-none border-t bg-card p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground ml-2">
                            <span>Rows per page:</span>
                            <select
                                className="h-8 w-16 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={size}
                                onChange={(e) => {
                                    setSize(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            <div className="text-sm font-medium">
                                Page {page} of {data.pages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                                disabled={page >= data.pages}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
