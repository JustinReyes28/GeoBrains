import Link from "next/link";
import { LayoutDashboard, Globe, MapPin, Users, Landmark, FileText, BadgeDollarSign, Languages, LogOut } from "lucide-react";
import { signOut } from "@/src/auth";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-neutral-950 text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-neutral-900/50 backdrop-blur-xl flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-blue-400" />
                        GeoBrains Admin
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <AdminLink href="/admin" icon={<LayoutDashboard />} label="Dashboard" />
                    <div className="text-xs uppercase text-white/40 font-semibold px-4 pt-4 pb-2">Collections</div>
                    <AdminLink href="/admin/countries" icon={<Globe />} label="Countries" />
                    <AdminLink href="/admin/capitals" icon={<MapPin />} label="Capitals" />
                    <AdminLink href="/admin/famous-people" icon={<Users />} label="Famous People" />
                    <AdminLink href="/admin/landmarks" icon={<Landmark />} label="Landmarks" />
                    <AdminLink href="/admin/currencies" icon={<BadgeDollarSign />} label="Currencies" />
                    <AdminLink href="/admin/languages" icon={<Languages />} label="Languages" />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <form action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/" })
                    }}>
                        <button className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-neutral-950">
                <div className="container mx-auto p-8 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}

function AdminLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm font-medium"
        >
            <span className="[&>svg]:w-5 [&>svg]:h-5">{icon}</span>
            {label}
        </Link>
    );
}
