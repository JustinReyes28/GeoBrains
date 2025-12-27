"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Trash2, Edit, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CountrySchema } from "@/src/lib/schemas";
import { z } from "zod";

type CountryForm = z.infer<typeof CountrySchema>;

export default function CountriesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCountry, setEditingCountry] = useState<any>(null);
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();

    // Fetch Countries
    const { data: countries, isLoading } = useQuery({
        queryKey: ["countries"],
        queryFn: async () => {
            const res = await fetch("/api/admin/countries");
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        },
    });

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: async (data: CountryForm) => {
            const res = await fetch("/api/admin/countries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to create");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            setIsModalOpen(false);
            reset();
        },
        onError: (error) => {
            alert(error.message);
        }
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await fetch("/api/admin/countries", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingCountry.id, ...data }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to update");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["countries"] });
            handleCloseModal();
        },
        onError: (error) => {
            alert(error.message);
        }
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CountryForm>({
        resolver: zodResolver(CountrySchema),
    });

    const onSubmit = (data: CountryForm) => {
        if (editingCountry) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (country: any) => {
        setEditingCountry(country);
        reset({
            name: country.name,
            code: country.code,
            region: country.region,
            centerLat: country.centerLat,
            centerLng: country.centerLng,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCountry(null);
        reset({
            name: "",
            code: "",
            region: undefined,
            centerLat: undefined,
            centerLng: undefined,
        });
    };

    const filteredCountries = countries?.filter((c: any) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Countries</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Country
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                    type="text"
                    placeholder="Search countries..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
            </div>

            {/* Table */}
            <div className="bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-white/60 text-sm font-medium uppercase">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Code</th>
                            <th className="px-6 py-4">Region</th>
                            <th className="px-6 py-4">Capital</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                                </td>
                            </tr>
                        ) : filteredCountries.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                                    No countries found.
                                </td>
                            </tr>
                        ) : (
                            filteredCountries.map((country: any) => (
                                <tr key={country.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4 text-white font-medium">{country.name}</td>
                                    <td className="px-6 py-4 text-white/70">{country.code}</td>
                                    <td className="px-6 py-4 text-white/70">{country.region}</td>
                                    <td className="px-6 py-4 text-white/70">{country.capital?.name || "-"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(country)}
                                            className="text-white/40 hover:text-white transition-colors p-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        {/* We haven't implemented DELETE API yet in this turn, but UI implies it */}
                                        {/* <button className="text-white/40 hover:text-red-400 transition-colors p-2">
                                    <Trash2 className="w-4 h-4" />
                                </button> */}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingCountry ? "Edit Country" : "Add Country"}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-white/40 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Name</label>
                                <input
                                    {...register("name")}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">ISO Code (2)</label>
                                    <input
                                        {...register("code")}
                                        maxLength={2}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 uppercase"
                                    />
                                    {errors.code && <p className="text-red-400 text-xs">{errors.code.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">Region</label>
                                    <select
                                        {...register("region")}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Africa">Africa</option>
                                        <option value="Americas">Americas</option>
                                        <option value="Asia">Asia</option>
                                        <option value="Europe">Europe</option>
                                        <option value="Oceania">Oceania</option>
                                    </select>
                                    {errors.region && <p className="text-red-400 text-xs">{errors.region.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">Center Lat</label>
                                    <input
                                        type="number"
                                        step="any"
                                        {...register("centerLat", { valueAsNumber: true })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                    {errors.centerLat && <p className="text-red-400 text-xs">{errors.centerLat.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">Center Lng</label>
                                    <input
                                        type="number"
                                        step="any"
                                        {...register("centerLng", { valueAsNumber: true })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                    {errors.centerLng && <p className="text-red-400 text-xs">{errors.centerLng.message}</p>}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
                                >
                                    {createMutation.isPending || updateMutation.isPending
                                        ? (editingCountry ? "Updating..." : "Creating...")
                                        : (editingCountry ? "Update Country" : "Create Country")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
