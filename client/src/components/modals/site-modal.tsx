import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertMerchantSiteSchema, type InsertMerchantSite, type MerchantSiteWithDevices } from "@shared/schema";
import { siteApi } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

interface SiteModalProps {
  open: boolean;
  onClose: () => void;
  site?: MerchantSiteWithDevices;
}

export function SiteModal({ open, onClose, site }: SiteModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertMerchantSite>({
    resolver: zodResolver(insertMerchantSiteSchema),
    defaultValues: {
      name: site?.name || "",
      address: site?.address || "",
      userId: user?.id || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: siteApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/sites/user/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/dashboard/stats/${user?.id}`] });
      toast({ title: "Success", description: "Site created successfully" });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create site", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertMerchantSite> }) =>
      siteApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/sites/user/${user?.id}`] });
      toast({ title: "Success", description: "Site updated successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update site", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertMerchantSite) => {
    if (site) {
      updateMutation.mutate({ id: site.id, data });
    } else {
      createMutation.mutate({ ...data, userId: user?.id || "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {site ? "Edit Site" : "Add Site"}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter site name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter full address"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) 
                  ? "Saving..." 
                  : site ? "Update Site" : "Create Site"
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
