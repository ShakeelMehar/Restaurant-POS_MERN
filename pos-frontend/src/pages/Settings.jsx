import React, { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, updateSettings } from "../https/index";
import { enqueueSnackbar } from "notistack";
import Switch from "../components/shared/Switch";

const Settings = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    restaurantName: "",
    location: "",
    branch: "",
    contactNumber: "",
    logoUrl: "",
    enableCash: true,
    enableCard: true,
    enableOnline: true,
    enableTaxes: true,
    enableTakeaway: true,
  });

  const { data: resData, isLoading, isError } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => await getSettings(),
  });

  useEffect(() => {
    document.title = "POS | Brand Settings";
  }, []);

  useEffect(() => {
    if (resData?.data?.data) {
      const settings = resData.data.data;
      setFormData({
        restaurantName: settings.restaurantName || "",
        location: settings.location || "",
        branch: settings.branch || "",
        contactNumber: settings.contactNumber || "",
        logoUrl: settings.logoUrl || "",
        enableCash: settings.enableCash ?? true,
        enableCard: settings.enableCard ?? true,
        enableOnline: settings.enableOnline ?? true,
        enableTaxes: settings.enableTaxes ?? true,
        enableTakeaway: settings.enableTakeaway ?? true,
      });
    }
  }, [resData]);

  const mutation = useMutation({
    mutationFn: async (data) => await updateSettings(data),
    onSuccess: (res) => {
      enqueueSnackbar("Settings updated successfully!", { variant: "success" });
      queryClient.invalidateQueries(["settings"]);
    },
    onError: () => {
      enqueueSnackbar("Failed to update settings.", { variant: "error" });
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-4rem)]">
        <p className="text-muted-foreground font-medium">Loading settings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-4rem)]">
        <p className="text-error font-medium">Failed to load settings.</p>
      </div>
    );
  }

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-background pb-24 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Brand Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your POS brand identity and receipt details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-[14px] border border-border p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Restaurant Name */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Restaurant Name <span className="text-error">*</span></label>
              <input
                type="text"
                name="restaurantName"
                value={formData.restaurantName}
                onChange={handleInputChange}
                required
                className="input-base"
                placeholder="e.g. Restro"
              />
            </div>

            {/* Branch Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Branch Name</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="input-base"
                placeholder="e.g. Downtown Branch"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="input-base"
                placeholder="e.g. +1 234 567 890"
              />
            </div>

            {/* Location */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Location / Address</label>
              <textarea
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                rows={2}
                className="input-base resize-none !h-auto"
                placeholder="e.g. 123 Main St, City, Country"
              />
            </div>

            {/* Logo URL */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">Logo URL (Optional)</label>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                className="input-base"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Provide a valid URL to your restaurant's logo. It will be displayed in the sidebar and receipts.
              </p>
              
              {formData.logoUrl && (
                <div className="mt-4 p-4 rounded-xl border border-dashed border-border bg-[hsl(var(--surface-soft))] inline-block">
                  <img src={formData.logoUrl} alt="Logo Preview" className="h-12 object-contain" onError={(e) => e.target.style.display='none'} />
                </div>
              )}
            </div>
            
          </div>

          {/* Feature Toggles Section */}
          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-lg font-bold text-foreground mb-4 tracking-tight">Feature Toggles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              
              {[
                { name: "enableCash", label: "Cash Payments", desc: "Allow staff to checkout with cash." },
                { name: "enableCard", label: "Card Payments", desc: "Show Card/Swipe option at checkout." },
                { name: "enableOnline", label: "Online Payments", desc: "Enable Razorpay integration." },
                { name: "enableTaxes", label: "Calculate Taxes", desc: "Apply global 5.25% tax to orders." },
                { name: "enableTakeaway", label: "Takeaway Mode", desc: "Allow orders for Takeaway." },
              ].map((toggle) => (
                <div key={toggle.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{toggle.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{toggle.desc}</p>
                  </div>
                  <Switch
                    id={`toggle-${toggle.name}`}
                    checked={formData[toggle.name]}
                    onChange={() => setFormData(prev => ({ ...prev, [toggle.name]: !prev[toggle.name] }))}
                  />
                </div>
              ))}
              
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn btn-primary"
            >
              <FiSave size={16} />
              {mutation.isPending ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Settings;
