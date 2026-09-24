import { memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Package,
    Wallet,
    ShoppingBag,
    Users,
    Repeat,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    MapPin,
    ChevronRight,
} from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useAdminDashboardContext } from "../AdminContexts/AdminDashboardContext";
import { useAuthContext } from "../Contexts/AuthContext";

// =====================================================
// Constantes / helpers
// =====================================================

const ACCENT = "#B89B72";
const DARK = "#171717";

const STATUS_COLORS: Record<string, string> = {
    EN_PREPARATION: "#F59E0B",
    EXPEDIEE: "#3B82F6",
    LIVREE: "#16A34A",
    ANNULEE: "#DC2626",
};

const STATUS_LABELS: Record<string, string> = {
    EN_PREPARATION: "En préparation",
    EXPEDIEE: "Expédiée",
    LIVREE: "Livrée",
    ANNULEE: "Annulée",
};

const CATEGORY_COLORS = ["#171717", "#B89B72", "#8C7355", "#D9C6A5", "#4B4B4B", "#A38A64"];

const formatDA = (value: number) =>
    `${value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} DA`;

const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
};

const formatRelative = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffH < 24) return `Il y a ${diffH}h`;
    if (diffD === 1) return "Hier";
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

const cardClass =
    "bg-white rounded-[10px] p-5 shadow-sm border border-gray-100 flex flex-col";

// =====================================================
// Custom tooltip (recharts)
// =====================================================

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="bg-[#171717] text-white px-3 py-2 rounded-[6px] text-[13px] shadow-lg">
            {label && <p className="font-[600] mb-1">{label}</p>}
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: p.color || p.fill }}>
                    {p.name} : {typeof p.value === "number" ? p.value.toLocaleString("fr-FR") : p.value}
                </p>
            ))}
        </div>
    );
};

// =====================================================
// KPI card
// =====================================================

interface KPICardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    tint: string;
    onClick?: () => void;
}

const KPICard = ({ icon, label, value, tint, onClick }: KPICardProps) => (
    <div
        onClick={onClick}
        className={
            cardClass +
            " gap-3" +
            (onClick ? " cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60" : "")
        }
    >
        <div className="flex items-center justify-between">
            <p className="text-[13px] font-[500] text-gray-500">{label}</p>
            <div
                className="w-9 h-9 rounded-[8px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: tint }}
            >
                {icon}
            </div>
        </div>
        <p className="text-[1.5em] font-bold" style={{ color: DARK }}>
            {value}
        </p>
    </div>
);

// =====================================================
// Action card (avec navigation + badge chiffré)
// =====================================================

interface ActionCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    tint: string;
    onClick: () => void;
}

const ActionCard = ({ icon, label, value, tint, onClick }: ActionCardProps) => (
    <div
        onClick={onClick}
        className="flex flex-row items-center justify-between gap-3 bg-white rounded-[10px] shadow-sm
        border border-gray-100 p-4 cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
    >
        <div className="flex flex-row items-center gap-3 min-w-0">
            <div
                className="flex items-center justify-center w-[42px] h-[42px] rounded-[8px] shrink-0"
                style={{ backgroundColor: tint }}
            >
                {icon}
            </div>
            <div className="flex flex-col min-w-0">
                <p className="text-[13px] text-gray-500 font-[500] truncate">{label}</p>
                <p className="text-[18px] font-bold truncate" style={{ color: DARK }}>
                    {value}
                </p>
            </div>
        </div>
        <ChevronRight size={16} className="text-gray-300 shrink-0" />
    </div>
);

// =====================================================
// Dashboard
// =====================================================

const Dashboard = () => {

    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { dashboardData, loadingDashboard, errorDashboard, getDashboardData } =
        useAdminDashboardContext();

    // ── Données graphes ──

    const revenueByDayData = useMemo(() => {
        if (!dashboardData) return [];
        return dashboardData.revenueByDay.map((d) => ({
            date: formatDay(d._id),
            revenue: d.revenue,
        }));
    }, [dashboardData]);

    const revenueByMonthData = useMemo(() => {
        if (!dashboardData) return [];
        return dashboardData.revenueByMonth.map((m) => ({
            month: formatMonth(m._id),
            revenue: m.revenue,
            orders: m.orders,
        }));
    }, [dashboardData]);

    const ordersByStatusData = useMemo(() => {
        if (!dashboardData) return [];
        return dashboardData.ordersByStatus
            .filter((s) => s.count > 0)
            .map((s) => ({
                name: STATUS_LABELS[s.status] ?? s.status,
                value: s.count,
                color: STATUS_COLORS[s.status] ?? "#9CA3AF",
            }));
    }, [dashboardData]);

    const topProductsData = useMemo(() => {
        if (!dashboardData) return [];
        return [...dashboardData.topProducts]
            .slice(0, 8)
            .reverse()
            .map((p) => ({ name: p._id, quantite: p.quantitySold }));
    }, [dashboardData]);

    const salesByCategoryData = useMemo(() => {
        if (!dashboardData) return [];
        return dashboardData.salesByCategory.map((c) => ({
            name: c._id,
            value: c.revenue,
        }));
    }, [dashboardData]);

    const topWilayasData = useMemo(() => {
        if (!dashboardData) return [];
        return [...dashboardData.topWilayas]
            .reverse()
            .map((w) => ({ name: w._id, commandes: w.orders }));
    }, [dashboardData]);


    // ── Loading / error states ──

    if (loadingDashboard && !dashboardData) {
        return (
            <section className="min-h-screen flex flex-col items-center justify-center w-full" style={{ backgroundColor: "#F7F4EE" }}>
                <i className="fa-solid fa-spinner fa-spin text-[2em] mb-3" style={{ color: DARK }}></i>
                <p className="text-[1.1em] text-gray-700">Chargement du tableau de bord...</p>
            </section>
        );
    }

    if (errorDashboard && !dashboardData) {
        return (
            <section className="min-h-screen flex flex-col items-center justify-center w-full gap-4" style={{ backgroundColor: "#F7F4EE" }}>
                <AlertTriangle size={42} className="text-red-500" />
                <p className="text-[1.1em] text-gray-800 text-center px-4">{errorDashboard}</p>
                <button
                    onClick={getDashboardData}
                    className="text-white px-4 py-2 rounded-[5px] text-[15px]
                    cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    style={{ backgroundColor: DARK }}
                >
                    Réessayer
                </button>
            </section>
        );
    }

    if (!dashboardData) return null;

    const { kpis, comparison } = dashboardData;
    const isGrowthPositive = comparison.monthGrowthPercent >= 0;

    return (
        <section className="min-h-screen flex flex-col items-center w-full pb-16" style={{ backgroundColor: "#F7F4EE" }}>
            <div className="w-full max-w-[1300px] px-4 lg:px-10">

                {/* ── Header ── */}
                <div className="mb-8 mt-24">
                    <h1 className="text-xl font-medium" style={{ color: DARK }}>
                        Bon retour, <span className="font-semibold">{user?.firstName} {user?.lastName}</span>
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Aperçu des ventes, du stock et de l'activité de Nova Fashion aujourd'hui.
                    </p>
                </div>

                {/* ── Actions requises ── */}
                <div className="grid grid-cols-1 min-[600px]:grid-cols-3 gap-4">
                    <ActionCard
                        icon={<Package size={18} color="#fff" />}
                        label="Commandes en préparation"
                        value={comparison.today.orders > 0 ? kpis.totalOrders : kpis.totalOrders}
                        tint="#F59E0B"
                        onClick={() => navigate("/admin/orders?status=EN_PREPARATION")}
                    />
                    <ActionCard
                        icon={<AlertTriangle size={18} color="#fff" />}
                        label="Variantes en rupture"
                        value={kpis.outOfStockCount}
                        tint="#DC2626"
                        onClick={() => navigate("/admin/clothes?stock=out")}
                    />
                    <ActionCard
                        icon={<TrendingDown size={18} color="#fff" />}
                        label="Stock faible"
                        value={kpis.lowStockCount}
                        tint="#F97316"
                        onClick={() => navigate("/admin/clothes?stock=low")}
                    />
                </div>

                {/* ── KPIs ── */}
                <div className="grid grid-cols-1 min-[500px]:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <KPICard
                        icon={<Wallet size={18} color="#fff" />}
                        label="Revenu total"
                        value={formatDA(kpis.totalRevenue)}
                        tint={DARK}
                    />
                    <KPICard
                        icon={<ShoppingBag size={18} color="#fff" />}
                        label="Commandes totales"
                        value={kpis.totalOrders.toString()}
                        tint={ACCENT}
                        onClick={() => navigate("/admin/orders")}
                    />
                    <KPICard
                        icon={<TrendingUp size={18} color="#fff" />}
                        label="Panier moyen"
                        value={formatDA(kpis.avgOrderValue)}
                        tint="#16A34A"
                    />
                    <KPICard
                        icon={<Package size={18} color="#fff" />}
                        label="Articles vendus"
                        value={kpis.totalProductsSold.toString()}
                        tint="#2563EB"
                    />
                    <KPICard
                        icon={<Users size={18} color="#fff" />}
                        label="Clients"
                        value={kpis.totalCustomers.toString()}
                        tint="#7C3AED"
                    />
                    <KPICard
                        icon={<Repeat size={18} color="#fff" />}
                        label="Clients récurrents"
                        value={kpis.returningCustomers.toString()}
                        tint="#0891B2"
                    />
                    <KPICard
                        icon={isGrowthPositive ? <TrendingUp size={18} color="#fff" /> : <TrendingDown size={18} color="#fff" />}
                        label="Croissance (vs mois dernier)"
                        value={`${isGrowthPositive ? "+" : ""}${comparison.monthGrowthPercent.toFixed(1)}%`}
                        tint={isGrowthPositive ? "#16A34A" : "#DC2626"}
                    />
                    <KPICard
                        icon={<Wallet size={18} color="#fff" />}
                        label="Revenu aujourd'hui"
                        value={formatDA(comparison.today.revenue)}
                        tint="#DB2777"
                    />
                </div>

                {/* ── Évolution du revenu (30j) ── */}
                <div className={cardClass + " mt-6"}>
                    <p className="font-[700] text-[16px] mb-4" style={{ color: DARK }}>
                        Revenu — 30 derniers jours
                    </p>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={revenueByDayData}>
                            <defs>
                                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={ACCENT} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8C7355" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#8C7355" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                name="Revenu"
                                stroke={DARK}
                                strokeWidth={2}
                                fill="url(#revenueFill)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* ── Répartition commandes + Revenu mensuel ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
                    <div className={cardClass}>
                        <p className="font-[700] text-[16px] mb-2" style={{ color: DARK }}>
                            Commandes par statut
                        </p>
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie
                                    data={ordersByStatusData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={3}
                                >
                                    {ordersByStatusData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    iconType="circle"
                                    formatter={(value) => <span className="text-[12px]" style={{ color: DARK }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={cardClass + " lg:col-span-2"}>
                        <p className="font-[700] text-[16px] mb-4" style={{ color: DARK }}>
                            Revenu — 12 derniers mois
                        </p>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={revenueByMonthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8C7355" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#8C7355" }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="revenue" name="Revenu" fill={ACCENT} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── Top produits + Ventes par catégorie ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                    <div className={cardClass}>
                        <p className="font-[700] text-[16px] mb-4" style={{ color: DARK }}>
                            Top produits vendus (quantité)
                        </p>
                        {topProductsData.length === 0 ? (
                            <p className="text-gray-400 text-[14px] text-center mt-10">Aucune vente pour le moment</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={topProductsData} layout="vertical" margin={{ left: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" horizontal={false} />
                                    <XAxis type="number" tick={{ fontSize: 11, fill: "#8C7355" }} axisLine={false} tickLine={false} />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        tick={{ fontSize: 11, fill: "#171717" }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={110}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="quantite" name="Quantité" fill={DARK} radius={[0, 6, 6, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <div className={cardClass}>
                        <p className="font-[700] text-[16px] mb-2" style={{ color: DARK }}>
                            Revenu par catégorie
                        </p>
                        {salesByCategoryData.length === 0 ? (
                            <p className="text-gray-400 text-[14px] text-center mt-10">Aucune donnée disponible</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie
                                        data={salesByCategoryData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={90}
                                        paddingAngle={3}
                                    >
                                        {salesByCategoryData.map((_, index) => (
                                            <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend
                                        iconType="circle"
                                        formatter={(value) => <span className="text-[12px]" style={{ color: DARK }}>{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* ── Top wilayas ── */}
                <div className={cardClass + " mt-5"}>
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin size={18} color={ACCENT} />
                        <p className="font-[700] text-[16px]" style={{ color: DARK }}>
                            Top 5 wilayas
                        </p>
                    </div>
                    {topWilayasData.length === 0 ? (
                        <p className="text-gray-400 text-[14px] text-center mt-6">Aucune donnée disponible</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={topWilayasData} layout="vertical" margin={{ left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E1D8" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: "#8C7355" }} axisLine={false} tickLine={false} />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fontSize: 11, fill: "#171717" }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={90}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="commandes" name="Commandes" fill={ACCENT} radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* ── Stock faible + Commandes récentes ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">

                    <div className={cardClass}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <AlertTriangle size={18} color="#DC2626" />
                                <p className="font-[700] text-[16px]" style={{ color: DARK }}>
                                    Alerte stock
                                </p>
                            </div>
                            <button
                                onClick={() => navigate("/admin/clothes?stock=low")}
                                className="text-[12px] font-[600] flex items-center gap-1 cursor-pointer transition-opacity duration-200 hover:opacity-70"
                                style={{ color: ACCENT }}
                            >
                                Voir tout <ChevronRight size={13} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1">
                            {dashboardData.lowStockVariants.length === 0 ? (
                                <p className="text-[13px] text-gray-400">Aucun produit en stock faible 🎉</p>
                            ) : (
                                dashboardData.lowStockVariants.map((v) => (
                                    <div
                                        key={v._id}
                                        className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-none last:pb-0"
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-[14px] font-[500] truncate" style={{ color: DARK }}>
                                                {v.clothing?.name ?? "Produit supprimé"}
                                            </p>
                                            <p className="text-[12px] text-gray-500">
                                                {v.color} · {v.size}
                                            </p>
                                        </div>
                                        <span
                                            className={
                                                "text-[12px] font-[600] px-2 py-1 rounded-[5px] shrink-0 " +
                                                (v.quantity === 0
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-orange-100 text-orange-600")
                                            }
                                        >
                                            {v.quantity === 0 ? "Rupture" : `${v.quantity} en stock`}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className={cardClass}>
                        <div className="flex items-center justify-between mb-4">
                            <p className="font-[700] text-[16px]" style={{ color: DARK }}>
                                Commandes récentes
                            </p>
                            <button
                                onClick={() => navigate("/admin/orders")}
                                className="text-[12px] font-[600] flex items-center gap-1 cursor-pointer transition-opacity duration-200 hover:opacity-70"
                                style={{ color: ACCENT }}
                            >
                                Voir tout <ChevronRight size={13} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1">
                            {dashboardData.recentOrders.length === 0 ? (
                                <p className="text-[13px] text-gray-400">Aucune commande pour le moment</p>
                            ) : (
                                dashboardData.recentOrders.map((o) => (
                                    <div
                                        key={o._id}
                                        onClick={() => navigate(`/admin/orders/${o._id}`)}
                                        className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3
                                        last:border-none last:pb-0 cursor-pointer transition-opacity duration-200 hover:opacity-70"
                                    >
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-[14px] font-[500] truncate" style={{ color: DARK }}>
                                                {o.firstName} {o.lastName}
                                            </p>
                                            <p className="text-[12px] text-gray-500 truncate">
                                                {o.wilaya} · {formatRelative(o.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span
                                                className="text-[11px] font-[600] px-2 py-1 rounded-[5px]"
                                                style={{
                                                    backgroundColor: `${STATUS_COLORS[o.status]}1A`,
                                                    color: STATUS_COLORS[o.status],
                                                }}
                                            >
                                                {STATUS_LABELS[o.status] ?? o.status}
                                            </span>
                                            <p className="text-[13px] font-[600]" style={{ color: DARK }}>
                                                {formatDA(o.totalPrice + o.deliveryFee)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default memo(Dashboard);