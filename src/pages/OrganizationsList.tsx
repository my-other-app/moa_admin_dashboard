import { useState } from "react";
import { useOrgs, useDeleteOrg, useBlockOrg, useImportOrgs } from "@/hooks/useOrgs";
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
import { Search, Edit, Trash2, ShieldBan, ShieldCheck, Plus, Upload } from "lucide-react";

export function OrganizationsList() {
    const [search, setSearch] = useState("");

    const { data: orgs, isLoading, isError } = useOrgs();
    const deleteMutation = useDeleteOrg();
    const blockMutation = useBlockOrg();
    const importMutation = useImportOrgs();

    const filteredOrgs = orgs?.filter(org =>
        org.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            importMutation.mutate(file);
        }
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
                    <Button className="bg-[#2C333D] text-[#F9FFA1] hover:bg-[#3A4556]">
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
                                filteredOrgs.map((org) => (
                                    <TableRow key={org.id}>
                                        <TableCell className="font-medium">#{org.id}</TableCell>
                                        <TableCell>
                                            {org.logo ? (
                                                <img src={typeof org.logo === 'string' ? org.logo : org.logo.filename} alt={org.name} className="h-8 w-8 rounded-full object-cover" />
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
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className={org.is_blocked ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-orange-600 hover:text-orange-700 hover:bg-orange-50"}
                                                disabled={blockMutation.isPending}
                                                onClick={() => blockMutation.mutate(org.id)}
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
                                                        deleteMutation.mutate(org.id);
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
