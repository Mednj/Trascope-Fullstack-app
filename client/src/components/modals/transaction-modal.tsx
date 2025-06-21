import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertTransactionSchema, type InsertTransaction, type TransactionWithDetails } from "@shared/schema";
import { transactionApi, deviceApi } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  transaction?: TransactionWithDetails;
}

const transactionFormSchema = insertTransactionSchema.extend({
  amount: insertTransactionSchema.shape.amount.transform(val => val.toString()),
});

export function TransactionModal({ open, onClose, transaction }: TransactionModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertTransaction & { amount: string }>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      customerName: transaction?.customerName || "",
      amount: transaction?.amount || "",
      currency: transaction?.currency || "USD",
      type: transaction?.type || "PURCHASE",
      status: transaction?.status || "AUTHORIZED",
      userId: user?.id || "",
      posDeviceId: transaction?.posDeviceId || "",
    },
  });

  const { data: devices } = useQuery({
    queryKey: [`/devices/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertTransaction) => transactionApi.create({
      ...data,
      amount: data.amount.toString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/transactions/user/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/dashboard/stats/${user?.id}`] });
      toast({ title: "Success", description: "Transaction created successfully" });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create transaction", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertTransaction & { amount: string }) => {
    createMutation.mutate({
      ...data,
      amount: data.amount,
      userId: user?.id || "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {transaction ? "Edit Transaction" : "New Transaction"}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PURCHASE">PURCHASE</SelectItem>
                        <SelectItem value="REFUND">REFUND</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="posDeviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>POS Device</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>  
                          <SelectTrigger>
                            <SelectValue placeholder="Select POS Device" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {devices?.map((device) => (
                            <SelectItem key={device.id} value={device.id}>
                              {device.deviceId} - {device.site.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Save Transaction"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
