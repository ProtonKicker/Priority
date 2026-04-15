import {
  Inbox,
  Folder,
  Star,
  Heart,
  Hash,
  Home,
  BookOpen,
  Target,
  Flag,
  Archive,
  ArchiveRestore,
  Bell,
  Clock,
  Zap,
  Calendar,
  Coffee,
  Music,
  Camera,
  Gamepad2,
  Dumbbell,
  Plane,
  Car,
  MapPin,
  ShoppingBag,
  Gift,
  Trophy,
  Award,
  Bookmark,
  Tag,
  Layers,
  Grid,
  List,
  LayoutGrid,
  Palette,
  Globe,
  Smartphone,
  Laptop,
  Monitor,
  Database,
  Code,
  Terminal,
  GitBranch,
  PieChart,
  BarChart3,
  TrendingUp,
  DollarSign,
  CreditCard,
  Wallet,
  Building2,
  Factory,
  Store,
  Briefcase,
  GraduationCap,
  School,
  Stethoscope,
  Utensils,
  Pizza,
  CakeSlice,
  Apple,
  Beer,
  Wine,
  Baby,
  Users,
  MessageCircle,
  Mail,
  Phone,
  Video,
  Image,
  FileText,
  ClipboardList,
  CheckSquare,
  Radio,
  Wifi,
  Bluetooth,
  Cloud,
  CloudRain,
  Snowflake,
  Flame,
  Droplets,
  Wind,
  Compass,
  Anchor,
  Mountain,
  Flower2,
  TreePine,
  Leaf,
  Sprout,
  Cat,
  Dog,
  Bug,
  Key,
  Lock,
  Shield,
  Eye,
  Ear,
  Hand,
  Footprints,
  Brain,
  Sparkles,
  Lightbulb,
  Rocket,
  Hammer,
  Wrench,
  Ruler,
  Scissors,
  Paperclip
} from 'lucide-react'

export const AVAILABLE_ICONS: Record<string, any> = {
  // Basic & Common
  Inbox, Folder, Star, Heart, Hash, Home, BookOpen, Target, Flag, Archive, ArchiveRestore,

  // Notifications & Time
  Bell, Clock, Zap, Calendar,

  // Lifestyle & Hobbies
  Coffee, Music, Camera, Gamepad2, Dumbbell, Plane, Car, MapPin,
  ShoppingBag, Gift, Trophy, Award,

  // Organization
  Bookmark, Tag, Layers, Grid, List, LayoutGrid, Palette,

  // Technology
  Globe, Smartphone, Laptop, Monitor, Database, Code, Terminal, GitBranch,

  // Business & Finance
  PieChart, BarChart3, TrendingUp, DollarSign, CreditCard, Wallet,
  Building2, Factory, Store, Briefcase,

  // Education & Health
  GraduationCap, School, Stethoscope, Utensils, Pizza, CakeSlice, Apple,
  Beer, Wine, Baby, Users,

  // Communication
  MessageCircle, Mail, Phone, Video, Image,

  // Documents & Tasks
  FileText, ClipboardList, CheckSquare, Radio,

  // Connectivity & Weather
  Wifi, Bluetooth, Cloud, CloudRain, Snowflake, Flame, Droplets, Wind,

  // Nature & Travel
  Compass, Anchor, Mountain, Flower2, TreePine, Leaf, Sprout,

  // Animals
  Cat, Dog, Bug,

  // Security & Access
  Key, Lock, Shield, Eye, Ear,

  // Body & Mind
  Hand, Footprints, Brain,

  // Ideas & Tools
  Sparkles, Lightbulb, Rocket, Hammer, Wrench, Ruler, Scissors, Paperclip
}

// Persistence keys
export const STORAGE_KEY_CATEGORIES = 'priority_categories'
export const STORAGE_KEY_TASKS = 'priority_tasks'
export const STORAGE_KEY_THEME = 'priority_theme'
export const STORAGE_KEY_SIDEBAR_WIDTH = 'priority_sidebar_width'
export const STORAGE_KEY_ARCHIVE_PANEL_WIDTH = 'priority_archive_panel_width'
export const STORAGE_KEY_ARCHIVED = 'priority_archived_tasks_by_workspace'

// Default empty state
export const DEFAULT_CATEGORIES: any[] = []
export const DEFAULT_TASKS: any[] = []
export const DEFAULT_ARCHIVED_TASKS: Record<string, any[]> = {}
export const DEFAULT_THEME = 'system'
