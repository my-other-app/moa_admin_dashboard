import { useState } from "react";
import { useEvents, useCancelEvent } from "@/hooks/useEvents";
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
import { Search, ChevronLeft, ChevronRight, Ban, Eye } from "lucide-react";

export function EventsList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { data, isLoading, isError } = useEvents(page, 20, debouncedSearch);
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col mb-2">
                    <h2 className="bebas text-[32px] md:text-[40px] tracking-wide text-black">Events Moderation</h2>
                    <p className="text-gray-600 mt-1">
                        Monitor and manage all upcoming, live, and past events.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <form onSubmit={handleSearchSubmit} className="relative w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search events by title..."
                        className="pl-8"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </form>
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event ID</TableHead>
                            <TableHead>Event Name</TableHead>
                            <TableHead>Club ID</TableHead>
                            <TableHead>Date / Time</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    Loading events...
                                </TableCell>
                            </TableRow>
                        ) : isError ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-destructive">
                                    Error loading event data. Please try again.
                                </TableCell>
                            </TableRow>
                        ) : data?.items?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    No events found matching "{debouncedSearch}"
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.items?.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">#{event.id}</TableCell>
                                    <TableCell className="max-w-[200px] truncate font-semibold">{event.name}</TableCell>
                                    <TableCell className="text-muted-foreground">#{event.club_id}</TableCell>
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
                                    <TableCell className="text-right space-x-2">
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
            {data && data.pages > 1 && (
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
            )}
        </div>
    );
}
