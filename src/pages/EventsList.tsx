import { useState } from "react";
import { useEvents, useCancelEvent } from "@/hooks/useEvents";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Search, ChevronLeft, ChevronRight, Ban, Eye } from "lucide-react";

export function EventsList() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { data, isLoading, isError } = useEvents(page, size, debouncedSearch);
    const cancelMutation = useCancelEvent();

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
                    <h2 className="bebas text-[28px] md:text-[32px] lg:text-[40px] tracking-wide text-black">Events Moderation</h2>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                        Monitor and manage all upcoming, live, and past events.
                    </p>
                </div>
            </div>

            <div className="flex-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search events by title..."
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
                                <TableHead>Event ID</TableHead>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Club Name</TableHead>
                                <TableHead>Date / Time</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Interests</TableHead>
                                <TableHead className="text-right sticky right-0 bg-secondary z-20 shadow-[-1px_0_0_#e2e8f0]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                        Loading events...
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-destructive">
                                        Error loading event data. Please try again.
                                    </TableCell>
                                </TableRow>
                            ) : data?.items?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                                        No events found matching "{debouncedSearch}"
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.items?.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">#{event.id}</TableCell>
                                        <TableCell className="max-w-[200px] truncate font-semibold">{event.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{event.club?.name || "N/A"}</TableCell>
                                        <TableCell>
                                            {new Date(event.event_datetime).toLocaleString(undefined, {
                                                dateStyle: 'medium',
                                                timeStyle: 'short'
                                            })}
                                        </TableCell>
                                        <TableCell className="max-w-[150px] truncate">
                                            {event.location_name}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${event.status === "published" ? "border-green-500 text-green-600" :
                                                event.status === "cancelled" ? "border-red-500 text-red-600" :
                                                    "border-muted text-muted-foreground"
                                                }`}>
                                                {event.status.toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 max-w-[250px]">
                                                {event.interests && event.interests.length > 0 ? (
                                                    <>
                                                        {event.interests.slice(0, 3).map((interest) => (
                                                            <Badge key={interest.id} variant="secondary" className="font-normal text-[10px] px-1.5 py-0 h-5">
                                                                {interest.name}
                                                            </Badge>
                                                        ))}
                                                        {event.interests.length > 3 && (
                                                            <Badge variant="outline" className="font-normal text-[10px] px-1.5 py-0 h-5">
                                                                +{event.interests.length - 3}
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
                                                variant="ghost"
                                                size="icon"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-red-50"
                                                disabled={cancelMutation.isPending || event.status === "cancelled"}
                                                onClick={() => {
                                                    if (confirm("Are you sure you want to cancel this event? This action will refund all tickets.")) {
                                                        cancelMutation.mutate(event.id);
                                                    }
                                                }}
                                                title="Cancel Event (Emergency)"
                                            >
                                                <Ban className="h-4 w-4" />
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
