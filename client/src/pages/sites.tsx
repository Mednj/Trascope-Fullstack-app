import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Store, MapPin, Calendar, Tablet, Edit, Trash2, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { siteApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { SiteModal } from "@/components/modals/site-modal";
import type { MerchantSiteWithDevices } from "@shared/schema";

export default function SitesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<MerchantSiteWithDevices | undefined>();

  const { data: sites = [], isLoading } = useQuery({
    queryKey: [`/sites/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: siteApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Success", description: "Site deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete site", variant: "destructive" });
    },
  });

  const handleEdit = (site: MerchantSiteWithDevices) => {
    setSelectedSite(site);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this site? This will also affect associated POS devices.")) {
      deleteMutation.mutate(id);
    }
  };

  const handleNewSite = () => {
    setSelectedSite(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Merchant Sites</h1>
        <Button onClick={handleNewSite}>
          <Plus className="w-4 h-4 mr-2" />
          Add Site
        </Button>
      </div>

      {/* Sites Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div className="ml-3 space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Skeleton className="w-8 h-8" />
                    <Skeleton className="w-8 h-8" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-5 w-12" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-5 w-8" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : sites.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Store className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-lg font-medium">No sites found</p>
            <p className="text-muted-foreground mb-4">
              Create your first merchant site to get started
            </p>
            <Button onClick={handleNewSite}>
              <Plus className="w-4 h-4 mr-2" />
              Add Site
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Card key={site.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Store className="w-6 h-6 text-primary" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{site.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {site.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(site)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(site.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="break-words">{site.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Tablet className="w-4 h-4 mr-2" />
                    <span>{site.devices.length} POS Device{site.devices.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Created {formatDate(site.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Monthly Revenue</span>
                      <p className="font-semibold text-gray-900">$8,450</p>
                    </div>
                    <div className="text-right text-sm">
                      <span className="text-muted-foreground">Transactions</span>
                      <p className="font-semibold text-gray-900">324</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SiteModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        site={selectedSite}
      />
    </div>
  );
}
