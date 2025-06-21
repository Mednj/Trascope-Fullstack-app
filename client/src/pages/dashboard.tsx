import { useQuery } from "@tanstack/react-query";
import { DollarSign, ArrowRightLeft, Store, Tablet, TrendingUp, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import { dashboardApi, transactionApi } from "@/lib/api";
import { formatCurrency, formatDateTime, getStatusBadgeClass } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [`/dashboard/stats/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: [`/transactions/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const recentTransactions = transactions?.slice(0, 5) || [];

  const statCards = [
    {
      title: "Total Revenue",
      value: stats ? formatCurrency(stats.totalRevenue) : "$0",
      change: "+12.5% from last month",
      changeType: "positive" as const,
      icon: DollarSign,
      iconColor: "text-blue-600 bg-blue-100",
    },
    {
      title: "Transactions",
      value: stats?.totalTransactions?.toLocaleString() || "0",
      change: "+8.2% from last month",
      changeType: "positive" as const,
      icon: ArrowRightLeft,
      iconColor: "text-green-600 bg-green-100",
    },
    {
      title: "Active Sites",
      value: stats?.activeSites?.toString() || "0",
      change: "Across multiple locations",
      changeType: "neutral" as const,
      icon: Store,
      iconColor: "text-orange-600 bg-orange-100",
    },
    {
      title: "POS Devices",
      value: stats?.posDevices?.toString() || "0",
      change: "All operational",
      changeType: "positive" as const,
      icon: Tablet,
      iconColor: "text-purple-600 bg-purple-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <p className="text-3xl font-bold">{stat.value}</p>
                    )}
                    <p className={`text-sm ${
                      stat.changeType === "positive" 
                        ? "text-green-600" 
                        : stat.changeType === "negative" 
                        ? "text-red-600" 
                        : "text-muted-foreground"
                    }`}>
                      {stat.changeType === "positive" && <TrendingUp className="inline w-4 h-4 mr-1" />}
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">
              View all
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ArrowRightLeft className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-muted-foreground">No transactions found</p>
              <p className="text-sm text-muted-foreground">Your recent transactions will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Device</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium">{transaction.customerName}</p>
                          <p className="text-sm text-muted-foreground">ID: {transaction.id.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusBadgeClass(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {transaction.posDevice.deviceId}
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {formatDateTime(transaction.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
