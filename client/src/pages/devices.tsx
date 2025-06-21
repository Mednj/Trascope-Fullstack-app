import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Tablet, Edit, Trash2, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { deviceApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { DeviceModal } from "@/components/modals/device-modal";
import type { PosDeviceWithSite } from "@shared/schema";

export default function DevicesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<PosDeviceWithSite | undefined>();

  const { data: devices = [], isLoading } = useQuery({
    queryKey: [`/devices/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: deviceApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Success", description: "Device deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete device", variant: "destructive" });
    },
  });

  const handleEdit = (device: PosDeviceWithSite) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this POS device?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleNewDevice = () => {
    setSelectedDevice(undefined);
    setIsModalOpen(true);
  };

  // Mock device status for demo
  const getDeviceStatus = (deviceId: string) => {
    return Math.random() > 0.2 ? "ONLINE" : "OFFLINE";
  };

  const getLastActivity = (deviceId: string) => {
    const activities = ["2 minutes ago", "15 minutes ago", "1 hour ago", "3 hours ago"];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">POS Devices</h1>
        <Button onClick={handleNewDevice}>
          <Plus className="w-4 h-4 mr-2" />
          Add Device
        </Button>
      </div>

      {/* Devices Table */}
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
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Tablet className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-lg font-medium">No POS devices found</p>
              <p className="text-muted-foreground mb-4">
                Add your first POS device to get started
              </p>
              <Button onClick={handleNewDevice}>
                <Plus className="w-4 h-4 mr-2" />
                Add Device
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Device</th>
                    <th className="text-left py-3 px-4 font-medium">Model</th>
                    <th className="text-left py-3 px-4 font-medium">Site</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Last Activity</th>
                    <th className="text-left py-3 px-4 font-medium">Created</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => {
                    const status = getDeviceStatus(device.deviceId);
                    const lastActivity = getLastActivity(device.deviceId);
                    
                    return (
                      <tr key={device.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <Tablet className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{device.deviceId}</p>
                              <p className="text-xs text-muted-foreground">ID: {device.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">{device.model}</td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium">{device.site.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-32">
                              {device.site.address}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={
                            status === "ONLINE" 
                              ? "status-badge status-authorized"
                              : "status-badge status-reversed"
                          }>
                            {status === "ONLINE" ? (
                              <Wifi className="w-3 h-3 mr-1" />
                            ) : (
                              <WifiOff className="w-3 h-3 mr-1" />
                            )}
                            {status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {lastActivity}
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {formatDate(device.createdAt)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(device)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(device.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <DeviceModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        device={selectedDevice}
      />
    </div>
  );
}
