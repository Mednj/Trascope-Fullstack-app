import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { insertPosDeviceSchema, type InsertPosDevice, type PosDeviceWithSite } from "@shared/schema";
import { deviceApi, siteApi } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

interface DeviceModalProps {
  open: boolean;
  onClose: () => void;
  device?: PosDeviceWithSite;
}

export function DeviceModal({ open, onClose, device }: DeviceModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertPosDevice>({
    resolver: zodResolver(insertPosDeviceSchema),
    defaultValues: {
      deviceId: device?.deviceId || "",
      model: device?.model || "",
      siteId: device?.siteId || "",
    },
  });

  const { data: sites } = useQuery({
    queryKey: [`/sites/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: deviceApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/devices/user/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/sites/user/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/dashboard/stats/${user?.id}`] });
      toast({ title: "Success", description: "Device created successfully" });
      onClose();
      form.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create device", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertPosDevice> }) =>
      deviceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/devices/user/${user?.id}`] });
      queryClient.invalidateQueries({ queryKey: [`/sites/user/${user?.id}`] });
      toast({ title: "Success", description: "Device updated successfully" });
      onClose();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update device", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertPosDevice) => {
    if (device) {
      updateMutation.mutate({ id: device.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {device ? "Edit Device" : "Add Device"}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="deviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter device ID (e.g., POS-001)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter device model" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sites?.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  : device ? "Update Device" : "Create Device"
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
