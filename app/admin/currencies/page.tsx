"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencySchema } from "@/src/lib/schemas";
import { z } from "zod";

type CurrencyForm = z.infer<typeof CurrencySchema>;

export default function CurrenciesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const queryClient = useQueryClient();

    const { data: currencies, isLoading } = useQuery({
        queryKey: ["currencies"],
        queryFn: async () => (await fetch("/api/admin/currencies").then(res => res.json())),
    });

    const createMutation = useMutation({
        mutationFn: async (data: CurrencyForm) => {
            const res = await fetch("/api/admin/currencies", {
                method: "POST",
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to create");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currencies"] });
            setIsModalOpen(false);
            reset();
        }
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CurrencyForm>({
        resolver: zodResolver(CurrencySchema),
    });

    const filtered = currencies?.filter((c: any) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.country.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Currencies</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                    <Plus className="w-4 h-4" />
                    Add Currency
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                    type="text"
                    placeholder="Search currencies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                />
            </div>

            <div className="bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-white/60 text-sm font-medium uppercase">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Symbol</th>
                            <th className="px-6 py-4">Country</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr><td colSpan={3} className="px-6 py-8 text-center text-white/40"><Loader2 className="animate-spin mx-auto w-6 h-6" /></td></tr>
                        ) : filtered.map((item: any) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                                <td className="px-6 py-4 text-white/70">{item.symbol}</td>
                                <td className="px-6 py-4 text-white/70">{item.country}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Add Currency</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Name</label>
                                <input {...register("name")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" />
                                {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Symbol</label>
                                <input {...register("symbol")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" />
                                {errors.symbol && <p className="text-red-400 text-xs">{errors.symbol.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70">Country</label>
                                <input {...register("country")} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white" />
                                {errors.country && <p className="text-red-400 text-xs">{errors.country.message}</p>}
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-white">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
