"use client";

import { useEffect, useState } from "react";

interface Business {
  _id: string;
  name: string;
  slug: string;
  description: string;
  whatsappNumber: string;
  phoneNumber: string;
  address: string;
  logo: string;
  coverImage: string;
}

function SettingsIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.03H6.7v-2.4h.2A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03h.2v2.4h-.2A1.7 1.7 0 0 0 19.4 15Z"
      />
    </svg>
  );
}

function StoreIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 10v9a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-9"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10 5 4h14l2 6"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 20v-5h6v5"
      />
    </svg>
  );
}

function PhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.6 3.5h2.1l1.4 4-1.8 1.8a15.5 15.5 0 0 0 6.4 6.4l1.8-1.8 4 1.4v2.1a2 2 0 0 1-2.2 2A16.3 16.3 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"
      />
    </svg>
  );
}

function ImageIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 15-4.5-4.5L7 20"
      />
    </svg>
  );
}

function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5 12 4 4L19 6"
      />
    </svg>
  );
}

function AlertIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17h.01"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.3 4.2 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3l-7.5-12.8a2 2 0 0 0-3.4 0Z"
      />
    </svg>
  );
}

export default function SettingsPage() {
  const [business, setBusiness] = useState<Business | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // Existing saved image URLs
  const [logo, setLogo] = useState("");
  const [coverImage, setCoverImage] = useState("");

  // NEW:
  // Selected files stay in browser until Save Changes.
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Temporary browser previews
  const [logoPreview, setLogoPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadBusiness();
  }, []);

  async function loadBusiness() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/business");

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Server returned an invalid response.");
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to load business settings.");
        return;
      }

      const currentBusiness: Business = data.business;

      setBusiness(currentBusiness);

      setName(currentBusiness.name || "");
      setDescription(currentBusiness.description || "");
      setWhatsappNumber(currentBusiness.whatsappNumber || "");
      setPhoneNumber(currentBusiness.phoneNumber || "");
      setAddress(currentBusiness.address || "");

      setLogo(currentBusiness.logo || "");
      setCoverImage(currentBusiness.coverImage || "");

      // Existing images are used as initial previews
      setLogoPreview(currentBusiness.logo || "");
      setCoverPreview(currentBusiness.coverImage || "");
    } catch (error) {
      console.error(error);
      setError("Failed to load business settings.");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Only selects the image.
   *
   * IMPORTANT:
   * This function DOES NOT call /api/upload.
   * Therefore Cloudinary is NOT contacted until Save Changes.
   */
  function selectImage(
    file: File,
    type: "logo" | "cover"
  ) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      setSuccess("");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");

    const previewUrl = URL.createObjectURL(file);

    if (type === "logo") {
      // Revoke previous temporary preview if it was created locally
      if (logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }

      setLogoFile(file);
      setLogoPreview(previewUrl);
    } else {
      if (coverPreview.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview);
      }

      setCoverFile(file);
      setCoverPreview(previewUrl);
    }
  }

  /**
   * Upload selected file to Cloudinary.
   *
   * This function is called ONLY inside saveSettings().
   */
  async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      throw new Error("Image upload server returned an invalid response.");
    }

    const data = await response.json();

    if (!response.ok || !data.success || !data.url) {
      throw new Error(data.message || "Image upload failed.");
    }

    return data.url;
  }

  async function saveSettings(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Business name is required.");
      return;
    }

    if (!whatsappNumber.trim()) {
      setError("WhatsApp number is required.");
      return;
    }

    try {
      setSaving(true);

      let finalLogo = logo;
      let finalCoverImage = coverImage;

      /*
       * -------------------------------------------------------
       * 1. Upload LOGO only if user selected a new file
       * -------------------------------------------------------
       */
      if (logoFile) {
        finalLogo = await uploadToCloudinary(logoFile);
      }

      /*
       * -------------------------------------------------------
       * 2. Upload COVER only if user selected a new file
       * -------------------------------------------------------
       */
      if (coverFile) {
        finalCoverImage = await uploadToCloudinary(coverFile);
      }

      /*
       * -------------------------------------------------------
       * 3. NOW update MongoDB
       * -------------------------------------------------------
       */
      const response = await fetch("/api/business", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          whatsappNumber: whatsappNumber.trim(),
          phoneNumber: phoneNumber.trim(),
          address: address.trim(),
          logo: finalLogo,
          coverImage: finalCoverImage,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Business API returned an invalid response.");
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message || "Failed to update business settings."
        );
        return;
      }

      /*
       * -------------------------------------------------------
       * 4. Update local state after successful DB save
       * -------------------------------------------------------
       */
      setBusiness(data.business);

      setLogo(data.business.logo || "");
      setCoverImage(data.business.coverImage || "");

      // New files are no longer pending
      setLogoFile(null);
      setCoverFile(null);

      // Replace blob previews with Cloudinary URLs
      setLogoPreview(data.business.logo || "");
      setCoverPreview(data.business.coverImage || "");

      setSuccess("Business settings updated successfully.");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save business settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse">
        <div className="mb-8">
          <div className="h-4 w-28 rounded bg-slate-200" />
          <div className="mt-4 h-9 w-64 rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-200" />
        </div>

        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="h-6 w-48 rounded bg-slate-200" />

              <div className="mt-6 space-y-5">
                <div className="h-11 rounded-xl bg-slate-100" />
                <div className="h-11 rounded-xl bg-slate-100" />
                <div className="h-24 rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-12">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
          <span>Dashboard</span>

          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="m7.5 15 5-5-5-5 1.4-1.4L15.3 10l-6.4 6.4L7.5 15Z" />
          </svg>

          <span className="font-medium text-slate-900">
            Settings
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <SettingsIcon className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Business Settings
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your store information, contact details and
                  branding.
                </p>
              </div>
            </div>
          </div>

          {business?.slug && (
            <div className="flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm sm:self-auto">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Store active
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <div className="mt-0.5 shrink-0">
            <AlertIcon className="h-5 w-5" />
          </div>

          <div>
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-0.5 text-red-600">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckIcon className="h-3.5 w-3.5" />
          </div>

          <div>
            <p className="font-semibold">Success</p>
            <p className="mt-0.5 text-emerald-600">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={saveSettings} className="space-y-6">
        {/* Business Information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <StoreIcon className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Basic Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Information customers will see about your business.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6 sm:p-7">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Business Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your business name"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Store URL
              </label>

              <div className="flex items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <span className="border-r border-slate-200 px-4 py-3 text-sm text-slate-400">
                  /shop/
                </span>

                <span className="px-4 py-3 text-sm font-medium text-slate-700">
                  {business?.slug || "your-store"}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                The store URL cannot be changed from here.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Business Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Tell customers about your business..."
                rows={5}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                A short description helps customers understand your
                business.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <PhoneIcon className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Contact Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Contact details customers can use to reach your
                  business.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-7">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  WhatsApp Number
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-slate-200 px-3 text-sm text-slate-400">
                    +94
                  </span>

                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(event) =>
                      setWhatsappNumber(event.target.value)
                    }
                    placeholder="771234567"
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-16 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Orders will be sent to this WhatsApp number.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(event.target.value)
                  }
                  placeholder="0112345678"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Business Address
                </label>

                <textarea
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="Your business address"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Store Branding */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-5 sm:px-7">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <ImageIcon className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Store Branding
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add images that represent your business online.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8 p-6 sm:p-7">
            {/* Logo */}
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-700">
                  Store Logo
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Recommended: square image, PNG or JPG.
                </p>
              </div>

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Store logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-7 w-7 text-slate-300" />
                      <p className="mt-2 text-xs text-slate-400">
                        No logo
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className={`inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
                      saving
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-slate-800"
                    }`}
                  >
                    <ImageIcon className="h-4 w-4" />

                    {logoFile
                      ? "Change Logo"
                      : logo
                        ? "Change Logo"
                        : "Upload Logo"}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={saving}
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          selectImage(file, "logo");
                        }

                        event.target.value = "";
                      }}
                    />
                  </label>

                  {logoFile && (
                    <p className="mt-2 text-xs font-medium text-amber-600">
                      New logo selected. Click Save Changes to upload.
                    </p>
                  )}

                  <p className="mt-2 text-xs text-slate-400">
                    Maximum file size: 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Cover */}
            <div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-700">
                  Store Cover Image
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Recommended: wide landscape image.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Store cover"
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-9 w-9 text-slate-300" />

                      <p className="mt-2 text-sm text-slate-400">
                        No cover image uploaded
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label
                  className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition ${
                    saving
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <ImageIcon className="h-4 w-4" />

                  {coverFile
                    ? "Change Cover Image"
                    : coverImage
                      ? "Change Cover Image"
                      : "Upload Cover Image"}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={saving}
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        selectImage(file, "cover");
                      }

                      event.target.value = "";
                    }}
                  />
                </label>

                {coverFile && (
                  <p className="mt-2 text-xs font-medium text-amber-600">
                    New cover image selected. Click Save Changes to upload.
                  </p>
                )}

                <p className="mt-2 text-xs text-slate-400">
                  Maximum file size: 5MB
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Save Bar */}
        <div className="sticky bottom-4 z-20">
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Business settings
              </p>

              <p className="text-xs text-slate-500">
                {logoFile || coverFile
                  ? "New images are ready. Save to upload and apply changes."
                  : "Save your changes when you're finished."}
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                    />

                    <path
                      className="opacity-90"
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>

                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
