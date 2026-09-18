import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type {
    Order,
    OrderFilterType,
    OrderStats,
} from "../Types/Types";

import { useAuthContext } from "../Contexts/AuthContext";


interface OrdersAdminContextType {

    // Orders
    orders: Order[];

    loadingOrders: boolean;

    getOrders: () => Promise<void>;

    // Filters
    filterOrders: OrderFilterType;

    setFilterOrders: (
        filters: OrderFilterType
    ) => void;

    // Pagination
    page: number;

    setPage: React.Dispatch<
        React.SetStateAction<number>
    >;

    limit: number;

    setLimit: React.Dispatch<
        React.SetStateAction<number>
    >;

    total: number;

    totalPages: number;

    // Statistics
    stats: OrderStats;
}


// =====================================================
// Context
// =====================================================

const OrdersAdminContext =
    createContext<OrdersAdminContextType | null>(null);


// =====================================================
// Provider
// =====================================================

export const OrdersAdminProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const { token } = useAuthContext();


    // =================================================
    // Orders
    // =================================================

    const [orders, setOrders] =
        useState<Order[]>([]);


    const [loadingOrders, setLoadingOrders] =
        useState<boolean>(false);


    // =================================================
    // Filters
    // =================================================

    const [filterOrders, setFilterOrdersState] =
        useState<OrderFilterType>(() => {

            const saved =
                localStorage.getItem(
                    "adminFilterOrders"
                );

            return saved
                ? JSON.parse(saved)
                : {
                    search: "",
                    status: "",
                    tri: "all",
                    startDate: "",
                    endDate: "",
                    sort: "newest",
                };
        });


    // =================================================
    // Pagination
    // =================================================

    const [page, setPage] =
        useState<number>(1);


    const [limit, setLimit] =
        useState<number>(10);


    const [total, setTotal] =
        useState<number>(0);


    const [totalPages, setTotalPages] =
        useState<number>(0);


    // =================================================
    // Statistics
    // =================================================

    const [stats, setStats] =
        useState<OrderStats>({
            totalOrders: 0,
            preparationOrders: 0,
            shippedOrders: 0,
            deliveredOrders: 0,
            cancelledOrders: 0,
            revenue: 0,
            productsSold: 0,
        });


    // =================================================
    // Save filters
    // =================================================

    useEffect(() => {

        localStorage.setItem(
            "adminFilterOrders",
            JSON.stringify(filterOrders)
        );

    }, [filterOrders]);


    // =================================================
    // Update filters
    // =================================================

    const setFilterOrders = (
        filters: OrderFilterType
    ) => {

        setFilterOrdersState(filters);

        // Revenir à la première page
        // lorsqu'un filtre change
        setPage(1);
    };


    // =================================================
    // Get Orders
    // =================================================

    const getOrders = async () => {

        if (!token) return;

        try {

            setLoadingOrders(true);


            // -----------------------------------------
            // Query params
            // -----------------------------------------

            const params =
                new URLSearchParams();


            params.append(
                "page",
                page.toString()
            );


            params.append(
                "limit",
                limit.toString()
            );


            // -----------------------------------------
            // Search
            // -----------------------------------------

            if (
                filterOrders.search?.trim()
            ) {

                params.append(
                    "search",
                    filterOrders.search.trim()
                );
            }


            // -----------------------------------------
            // Status
            // -----------------------------------------

            if (
                filterOrders.status?.trim()
            ) {

                params.append(
                    "status",
                    filterOrders.status.trim()
                );
            }


            // -----------------------------------------
            // Date filter
            // -----------------------------------------

            if (
                filterOrders.tri?.trim()
            ) {

                params.append(
                    "tri",
                    filterOrders.tri
                );
            }


            // -----------------------------------------
            // Custom date
            // -----------------------------------------

            if (
                filterOrders.tri === "custom"
            ) {

                if (
                    filterOrders.startDate
                ) {

                    params.append(
                        "startDate",
                        filterOrders.startDate
                    );
                }


                if (
                    filterOrders.endDate
                ) {

                    params.append(
                        "endDate",
                        filterOrders.endDate
                    );
                }
            }


            // -----------------------------------------
            // Sort
            // -----------------------------------------

            if (
                filterOrders.sort?.trim()
            ) {

                params.append(
                    "sort",
                    filterOrders.sort
                );
            }


            // -----------------------------------------
            // Request
            // -----------------------------------------

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/orders?${params.toString()}`,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            const data =
                await res.json();


            // -----------------------------------------
            // Error
            // -----------------------------------------

            if (!res.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    "Error in getting orders"
                );
            }


            // -----------------------------------------
            // Orders
            // -----------------------------------------

            setOrders(
                data.data ?? []
            );


            // -----------------------------------------
            // Pagination
            // -----------------------------------------

            setTotal(
                data.pagination?.total ?? 0
            );


            setTotalPages(
                data.pagination?.totalPages ?? 0
            );


            // -----------------------------------------
            // Statistics
            // -----------------------------------------

            setStats({

                totalOrders:
                    data.stats?.totalOrders ?? 0,

                preparationOrders:
                    data.stats?.preparationOrders ?? 0,

                shippedOrders:
                    data.stats?.shippedOrders ?? 0,

                deliveredOrders:
                    data.stats?.deliveredOrders ?? 0,

                cancelledOrders:
                    data.stats?.cancelledOrders ?? 0,

                revenue:
                    data.stats?.revenue ?? 0,

                productsSold:
                    data.stats?.productsSold ?? 0,

            });


        } catch (err) {

            console.error(
                "Error getting admin orders:",
                err
            );

        } finally {

            setLoadingOrders(false);
        }
    };


    // =================================================
    // Fetch when filters/pagination change
    // =================================================

    useEffect(() => {

        if (!token) return;

        getOrders();

    }, [
        token,
        filterOrders,
        page,
        limit,
    ]);


    // =================================================
    // Provider
    // =================================================

    return (

        <OrdersAdminContext.Provider
            value={{

                // Orders
                orders,
                loadingOrders,
                getOrders,

                // Filters
                filterOrders,
                setFilterOrders,

                // Pagination
                page,
                setPage,
                limit,
                setLimit,
                total,
                totalPages,

                // Statistics
                stats,

            }}
        >

            {children}

        </OrdersAdminContext.Provider>
    );
};


// =====================================================
// Hook
// =====================================================

export const useOrdersAdminContext = () => {

    const context =
        useContext(
            OrdersAdminContext
        );


    if (!context) {

        throw new Error(
            "Please use the useOrdersAdminContext hook inside the OrdersAdminProvider"
        );
    }


    return context;
};