"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FamousPersonSchema } from "@/src/lib/schemas";
import { z } from "zod";
import ImageUpload from "@/components/admin/ImageUpload";
import Image from "next/image";

type FamousPersonForm = z.infer<typeof FamousPersonSchema>;

export default function FamousPeoplePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();

    const { data: people, isLoading } = useQuery({
        queryKey: ["famous-people"],
        queryFn: async () => (await fetch("/api/admin/famous-people").then(res => res.json())),
    });

    const createMutation = useMutation({
        mutationFn: async (data: FamousPersonForm) => {
            const res = await fetch("/api/admin/famous-people", {
                method: "POST",
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["famous-people"] });
            setIsModalOpen(false);
            reset();
        }
    });

    const { register, control, handleSubmit, reset, formState: { errors } } = useForm<FamousPersonForm>({
        resolver: zodResolver(FamousPersonSchema),
    });

    const filtered = people?.filter((p: any) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.country.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Famous People</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg"
                >
                    <Plus className="w-4 h-4" />
                    Add Person
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                    type="text"
                    placeholder="Search famous people..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
            </div>

            <div className="bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-white/60 text-sm font-medium uppercase">
                        <tr>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Country</th>
                            <th className="px-6 py-4">Region</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr><td colSpan={4} className="px-6 py-8 text-center text-white/40"><Loader2 className="animate-spin mx-auto w-6 h-6" /></td></tr>
                        ) : filtered.map((item: any) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10">
                                        {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                                <td className="px-6 py-4 text-white/70">{item.country}</td>
                                <td className="px-6 py-4 text-white/70">{item.region}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-6 my-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Add Famous Person</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Image</label>
                                <Controller
                                    control={control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <ImageUpload
                                            type="famous-people"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Name</label>
                                <input {...register("name")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" />
                                {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">Country</label>
                                    <input {...register("country")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" />
                                    {errors.country && <p className="text-red-400 text-xs">{errors.country.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70">Region</label>
                                    <select {...register("region")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white">
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

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Description</label>
                                <textarea {...register("description")} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" />
                                {errors.description && <p className="text-red-400 text-xs">{errors.description.message}</p>}
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-white">Cancel</button>
                                <button type="submit" disabled={createMutation.isPending} className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-50">
                                    {createMutation.isPending ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
