import { useEffect, useRef, useState } from "react";
import {
  MessageSquarePlus,
  Construction,
  Flame,
  Car,
  Factory,
  MoreHorizontal,
  Send,
  CheckCircle,
  ImagePlus,
  X,
  Clock,
  Users,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  createReport,
  getMyReports,
  getCommunityReports,
  deleteReport,
} from "@/services/api";

const reportTypes = [
  { id: "construction", label: "Construction", icon: Construction },
  { id: "burning", label: "Burning", icon: Flame },
  { id: "traffic", label: "Traffic", icon: Car },
  { id: "industrial", label: "Industrial", icon: Factory },
  { id: "other", label: "Other", icon: MoreHorizontal },
];

const Reports = () => {
  /* ---------- FORM STATE ---------- */
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------- DATA STATE ---------- */
  const [myReports, setMyReports] = useState<any[]>([]);
  const [communityReports, setCommunityReports] = useState<any[]>([]);

  /* ---------- LOAD DATA ---------- */
  const loadReports = async () => {
    try {
      const [my, community] = await Promise.all([
        getMyReports(),
        getCommunityReports(),
      ]);
      setMyReports(my.data);
      setCommunityReports(community.data);
    } catch {
      toast.error("Failed to load reports");
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  /* ---------- FORM HANDLERS ---------- */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!selectedType) {
      toast.error("Select a pollution type");
      return;
    }

    setSubmitting(true);
    try {
      await createReport({
        title:
          reportTypes.find((t) => t.id === selectedType)?.label ||
          selectedType,
        description,
        image: selectedImage,
      });

      toast.success("Report submitted");
      setSubmitted(true);
      loadReports();

      setTimeout(() => {
        setSubmitted(false);
        setSelectedType(null);
        setDescription("");
        setSelectedImage(null);
      }, 1500);
    } catch {
      toast.error("Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- DELETE ---------- */
  const handleDelete = async (id: string) => {
    await deleteReport(id);
    toast.success("Report deleted");
    loadReports();
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ================= REPORT FORM ================= */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquarePlus />
          <h2 className="font-semibold text-lg">Report Air Pollution</h2>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center py-8">
            <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
            <p className="font-medium">Report submitted</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
              {reportTypes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className={`p-3 rounded-xl border ${
                      selectedType === t.id
                        ? "border-primary bg-primary/10"
                        : "border-border/50"
                    }`}
                  >
                    <Icon className="mx-auto mb-1" />
                    <p className="text-xs">{t.label}</p>
                  </button>
                );
              })}
            </div>

            <Textarea
              placeholder="Describe the pollution source…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-3"
            />

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              hidden
              onChange={handleImageSelect}
            />

            {selectedImage ? (
              <div className="relative mb-3">
                <img src={selectedImage} className="rounded-xl" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 p-1 rounded"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full mb-3"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            )}

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Submitting…" : "Submit Report"}
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </>
        )}
      </div>

      {/* ================= MY REPORTS ================= */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Clock />
          <h2 className="font-semibold">My Reports</h2>
        </div>

        {myReports.length === 0 ? (
          <p className="text-muted-foreground text-sm">No reports yet</p>
        ) : (
          myReports.map((r) => (
            <div key={r._id} className="border p-4 rounded-xl mb-3">
              <p className="font-medium">{r.title}</p>
              <p className="text-sm">{r.description}</p>
              {r.image && <img src={r.image} className="mt-2 rounded-lg" />}
              <Button
                size="sm"
                variant="destructive"
                className="mt-2"
                onClick={() => handleDelete(r._id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          ))
        )}
      </div>

      {/* ================= COMMUNITY REPORTS ================= */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Users />
          <h2 className="font-semibold">Community Reports</h2>
        </div>

        {communityReports.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No community reports yet
          </p>
        ) : (
          communityReports.map((r) => (
            <div key={r._id} className="border p-4 rounded-xl mb-3">
              <p className="font-medium">{r.title}</p>
              <p className="text-sm">{r.description}</p>
              {r.image && <img src={r.image} className="mt-2 rounded-lg" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reports;
