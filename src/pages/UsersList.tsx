import { useState } from "react";
import { useUsers } from "@/hooks/useUsers";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export function UsersList() {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const { data, isLoading, isError } = useUsers(page, size, debouncedSearch);

    // Debounce search input to avoid spamming the API
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to page 1 on new search

        // Simple debounce equivalent
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
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col">
                    <h2 className="bebas text-[28px] md:text-[32px] lg:text-[40px] tracking-wide text-black">User Management</h2>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                        Search, filter, and manage all users registered on the platform.
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search users..."
                        className="pl-8 w-full"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </form>
            </div>

            <div className="rounded-md border bg-card overflow-hidden">
                <div className="overflow-auto max-h-[calc(100vh-260px)]">
                    <Table className="min-w-[800px]">
                        <TableHeader className="sticky top-0 bg-secondary z-10 shadow-sm">
                            <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead>Profile</TableHead>
                                <TableHead>Provider</TableHead>
                                <TableHead>Joined Date</TableHead>
                                <TableHead>Interests</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        Loading users...
                                    </TableCell>
                                </TableRow>
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-destructive">
                                        Error loading user data. Please try again.
                                    </TableCell>
                                </TableRow>
                            ) : data?.items?.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                        No users found matching "{debouncedSearch}"
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.items?.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">#{user.id}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.profile?.avatar?.image?.thumbnail || user.profile?.profile_pic?.thumbnail} alt={user.full_name} />
                                                    <AvatarFallback>{user.full_name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.full_name}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                                {user.provider?.toUpperCase() || "APP"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                {user.interests && user.interests.length > 0 ? (
                                                    <>
                                                        {user.interests.slice(0, 3).map(interest => (
                                                            <Badge key={interest.id} variant="secondary" className="font-normal text-[10px] px-1.5 py-0 h-5">
                                                                {interest.icon} {interest.name}
                                                            </Badge>
                                                        ))}
                                                        {user.interests.length > 3 && (
                                                            <Badge variant="outline" className="font-normal text-[10px] px-1.5 py-0 h-5">
                                                                +{user.interests.length - 3}
                                                            </Badge>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs italic">No interests</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
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
                    <div className="flex items-center justify-between mt-4">
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
