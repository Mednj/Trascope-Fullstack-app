import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { transactionApi } from "@/lib/api";
import { formatCurrency, formatDateTime, getStatusBadgeClass, getTypeBadgeClass } from "@/lib/utils";
import { TransactionModal } from "@/components/modals/transaction-modal";
import type { TransactionWithDetails } from "@shared/schema";

export default function TransactionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithDetails | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: [`/transactions/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: transactionApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Success", description: "Transaction deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete transaction", variant: "destructive" });
    },
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleEdit = (transaction: TransactionWithDetails) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);  
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleNewTransaction = () => {
    setSelectedTransaction(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button onClick={handleNewTransaction}>
          <Plus className="w-4 h-4 mr-2" />
          New Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="AUTHORIZED">AUTHORIZED</SelectItem>
                <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                <SelectItem value="REVERSED">REVERSED</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PURCHASE">PURCHASE</SelectItem>
                <SelectItem value="REFUND">REFUND</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="justify-start">
              <Filter className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No transactions found</p>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all" 
                  ? "Try adjusting your filters"
                  : "Create your first transaction to get started"
                }
              </p>
              {!searchTerm && statusFilter === "all" && typeFilter === "all" && (
                <Button onClick={handleNewTransaction}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Transaction
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Customer</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Device</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50 transition-colors">
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
                        <Badge className={getTypeBadgeClass(transaction.type)}>
                          {transaction.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusBadgeClass(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        <div>
                          <p>{transaction.posDevice.deviceId}</p>
                          <p className="text-xs">{transaction.site.name}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {formatDateTime(transaction.timestamp)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(transaction.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}
