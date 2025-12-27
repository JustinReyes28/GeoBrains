import Link from "next/link";
import { Globe, MapPin, Users, Landmark, BadgeDollarSign, Languages, ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-white/60">Welcome back, Admin. Manage your GeoBrains content.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Countries"
                    description="Manage countries and their coordinates"
                    icon={<Globe className="w-8 h-8 text-blue-400" />}
                    href="/admin/countries"
                    color="bg-blue-500/10 border-blue-500/20"
                />
                <DashboardCard
                    title="Capitals"
                    description="Link capitals to countries"
                    icon={<MapPin className="w-8 h-8 text-emerald-400" />}
                    href="/admin/capitals"
                    color="bg-emerald-500/10 border-emerald-500/20"
                />
                <DashboardCard
                    title="Famous People"
                    description="Historical figures and celebrities"
                    icon={<Users className="w-8 h-8 text-purple-400" />}
                    href="/admin/famous-people"
                    color="bg-purple-500/10 border-purple-500/20"
                />
                <DashboardCard
                    title="Landmarks"
                    description="Famous landmarks and hints"
                    icon={<Landmark className="w-8 h-8 text-amber-400" />}
                    href="/admin/landmarks"
                    color="bg-amber-500/10 border-amber-500/20"
                />
                <DashboardCard
                    title="Currencies"
                    description="Global currencies and symbols"
                    icon={<BadgeDollarSign className="w-8 h-8 text-green-400" />}
                    href="/admin/currencies"
                    color="bg-green-500/10 border-green-500/20"
                />
                <DashboardCard
                    title="Languages"
                    description="Official languages by country"
                    icon={<Languages className="w-8 h-8 text-pink-400" />}
                    href="/admin/languages"
                    color="bg-pink-500/10 border-pink-500/20"
                />
            </div>
        </div>
    );
}

function DashboardCard({ title, description, icon, href, color }: any) {
    return (
        <Link
            href={href}
            className={`group relative p-6 rounded-2xl border ${color} hover:bg-white/5 transition-all duration-300`}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    {icon}
                </div>
                <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-white/50">{description}</p>
        </Link>
    );
}
