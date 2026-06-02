import React, { useState, useEffect, FormEvent } from "react";
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, Image as ImageIcon, Loader2, ArrowLeft, Save, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../../services/apiService";

interface Event {
  EventID: string;
  Title: string;
  Date: string;
  Description: string;
  PosterURL: string;
}

export default function EventManagement() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    poster_url: "",
    registration_link: ""
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin_user");
    const savedToken = localStorage.getItem("token");
    if (!savedAdmin || !savedToken) {
      navigate("/admin-login");
    } else {
      const parsed = JSON.parse(savedAdmin);
      const userEmail = parsed.email ? parsed.email.toLowerCase() : "";
      if (userEmail !== "meetkhakhkhar05@gmail.com") {
        localStorage.removeItem("admin_user");
        localStorage.removeItem("token");
        navigate("/admin-login");
      } else {
        fetchEvents();
      }
    }
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const result = await apiService.getEvents();
      if (result.success) setEvents(result.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (event?: any) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        description: event.description,
        poster_url: event.poster_url,
        registration_link: event.registration_link || ""
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        date: "",
        description: "",
        poster_url: "",
        registration_link: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let result;
      if (editingEvent) {
        result = await apiService.updateEvent((editingEvent as any).id, formData);
      } else {
        result = await apiService.createEvent(formData);
      }
      
      if (result.success) {
        setIsModalOpen(false);
        fetchEvents();
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (error: any) {
      console.error("Submission failed", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      const result = await apiService.deleteEvent(id);
      if (result.success) fetchEvents();
    } catch (error) {
      console.error("Deletion failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link to="/admin/dashboard" className="flex items-center text-[#00ff88] text-[10px] font-black uppercase tracking-widest mb-4 hover:opacity-70 transition-opacity">
              <ArrowLeft className="w-3 h-3 mr-2" /> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Event <span className="text-[#00ff88]">Management</span></h1>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center px-6 py-3 bg-[#00ff88] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,136,0.2)]"
          >
            <Plus className="w-4 h-4 mr-2" /> Add New Event
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#00ff88] animate-spin mb-4" />
            <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">Loading Events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event: any) => (
              <div key={event.id} className="bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-[#00ff88]/30 transition-all flex flex-col group">
                {/* Image Preview */}
                <div className="aspect-video relative overflow-hidden bg-black/40">
                  {event.poster_url ? (
                    <img src={event.poster_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-white/5" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button 
                      onClick={() => handleOpenModal(event)}
                      className="p-2 bg-black/60 rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="p-2 bg-black/60 rounded-lg hover:bg-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-6 flex-grow">
                  <div className="flex items-center space-x-2 text-[#00ff88] text-[8px] font-black uppercase tracking-widest mb-3">
                    <Calendar className="w-3 h-3" />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight mb-3 line-clamp-1">{event.title}</h3>
                  <p className="text-white/40 text-xs line-clamp-3 leading-relaxed mb-4">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && (
          <div className="text-center py-32 rounded-[40px] border border-dashed border-white/10">
            <ImageIcon className="w-16 h-16 text-white/10 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-2">No Events Found</h3>
            <p className="text-white/30 text-sm italic">Click 'Add New Event' to get started</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {editingEvent ? "Edit" : "Add"} <span className="text-[#00ff88]">Event</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Event Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#00ff88] outline-none transition-colors"
                  placeholder="e.g. INTELLIFY Hackathon"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Date</label>
                  <input 
                    required
                    type="text" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#00ff88] outline-none transition-colors"
                    placeholder="e.g. 15th Aug 2026"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Poster URL</label>
                  <input 
                    type="text" 
                    value={formData.poster_url}
                    onChange={(e) => setFormData({...formData, poster_url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#00ff88] outline-none transition-colors"
                    placeholder="Direct Image URL"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Registration Link (Optional)</label>
                <input 
                  type="text" 
                  value={formData.registration_link}
                  onChange={(e) => setFormData({...formData, registration_link: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#00ff88] outline-none transition-colors"
                  placeholder="https://docs.google.com/forms/..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#00ff88] outline-none transition-colors resize-none"
                  placeholder="What is this event about?"
                />
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#00ff88] text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {editingEvent ? "Update Event" : "Save Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
