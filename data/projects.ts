export interface Project {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  category: string;
  cover: string;
}

export const projects: Project[] = [
  {
    id: "tokyo-nights",
    title: "Tokyo Nights",
    subtitle: "Street & Documentary",
    year: "2025",
    category: "STREET",
    cover: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "patagonia",
    title: "Patagonia",
    subtitle: "Landscape & Nature",
    year: "2025",
    category: "TRAVEL",
    cover: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "vogue-campaign",
    title: "Vogue Campaign",
    subtitle: "Fashion Editorial",
    year: "2024",
    category: "FASHION",
    cover: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "tuscany-wedding",
    title: "Wedding in Tuscany",
    subtitle: "Wedding & Portraits",
    year: "2024",
    category: "WEDDINGS",
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "urban-silence",
    title: "Urban Silence",
    subtitle: "Architecture & City",
    year: "2024",
    category: "ARCHITECTURE",
    cover: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop&q=80",
  },
  {
    id: "desert-light",
    title: "Desert Light",
    subtitle: "Travel & Landscape",
    year: "2023",
    category: "TRAVEL",
    cover: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&h=600&fit=crop&q=80",
  },
];
