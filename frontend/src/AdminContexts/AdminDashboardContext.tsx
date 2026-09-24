import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";


// =====================================================
// Types
// =====================================================

interface PeriodStat {
    revenue: number;
    orders: number;
}

interface RevenuePoint {
    _id: string;
    revenue: number;
    orders: number;
}

interface OrderStatusCount {
    status: string;
    count: number;
}

interface TopProduct {
    _id: string;
    quantitySold: number;
    revenue: number;
}

interface CategorySales {
    _id: string;
    quantitySold: number;
    revenue: number;
}

interface WilayaStat {
    _id: string;
    orders: number;
    revenue: number;
}

interface LowStockVariant {
    _id: string;
    color: string;
    size: string;
    quantity: number;
    clothing: { _id: string; name: string } | null;
}

interface RecentOrder {
    _id: string;
    firstName: string;
    lastName: string;
    wilaya: string;
    status: string;
    totalPrice: number;
    deliveryFee: number;
    createdAt: string;
}

interface DashboardData {
    kpis: {
        totalOrders: number;
        totalRevenue: number;
        totalProductsSold: number;
        avgOrderValue: number;
        totalCustomers: number;
        returningCustomers: number;
        outOfStockCount: number;
        lowStockCount: number;
    };

    comparison: {
        today: PeriodStat;
        thisMonth: PeriodStat;
        lastMonth: PeriodStat;
        monthGrowthPercent: number;
    };

    ordersByStatus: OrderStatusCount[];

    revenueByDay: RevenuePoint[];
    revenueByMonth: RevenuePoint[];

    topProducts: TopProduct[];
    salesByCategory: CategorySales[];
    topWilayas: WilayaStat[];

    lowStockVariants: LowStockVariant[];
    recentOrders: RecentOrder[];
}

interface AdminDashboardContextType {
    dashboardData: DashboardData | null;
    loadingDashboard: boolean;
    getDashboardData: () => Promise<void>;
    errorDashboard: string | null;
}


// =====================================================
// Context
// =====================================================

const AdminDashboardContext =
    createContext<AdminDashboardContextType | null>(null);


// =====================================================
// Provider
// =====================================================

export const AdminDashboardProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const { token } = useAuthContext();

    const [dashboardData, setDashboardData] =
        useState<DashboardData | null>(null);

    const [loadingDashboard, setLoadingDashboard] =
        useState<boolean>(false);

    const [errorDashboard, setErrorDashboard] =
        useState<string | null>(null);


    const getDashboardData = async () => {

        if (!token) return;

        try {

            setLoadingDashboard(true);
            setErrorDashboard(null);

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/dashboard`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error in getting dashboard data"
                );
            }

            setDashboardData(data.data);

        } catch (err) {

            console.error("Error getting dashboard data:", err);

            setErrorDashboard(
                err instanceof Error ? err.message : "Erreur inconnue"
            );

        } finally {

            setLoadingDashboard(false);

        }
    };


    useEffect(() => {

        if (token) getDashboardData();

    }, [token]);


    return (
        <AdminDashboardContext.Provider
            value={{
                dashboardData,
                loadingDashboard,
                getDashboardData,
                errorDashboard,
            }}
        >
            {children}
        </AdminDashboardContext.Provider>
    );
};


// =====================================================
// Hook
// =====================================================

export const useAdminDashboardContext = () => {

    const context = useContext(AdminDashboardContext);

    if (!context) {
        throw new Error(
            "Please use the useAdminDashboardContext hook inside the AdminDashboardProvider"
        );
    }

    return context;
};