
import { 
    Layers3, Database, Workflow, DollarSign, Wrench, Search, Calculator, Target, 
    SplitSquareHorizontal, Beaker, LandPlot, Route, Waves, ScanSearch, Waypoints, 
    Scaling, HelpingHand, Sprout, Wind, Droplet, Fuel, HardHat, Lightbulb as Bolt, 
    Pipette, LayoutDashboard, Settings, Compass, Box, Package, Globe, Users, 
    TrendingUp, HeartHandshake as Handshake, Shield, Monitor, Briefcase, FileText, 
    CheckCircle, Lightbulb, Rocket, BarChart2, Zap, Cloud, Sun, Leaf, Factory, 
    Recycle, Activity, FlaskConical, CircleDollarSign, Coins, Scale, TrendingDown, 
    Eye, LightbulbOff, FlaskRound, Sparkles, Network, GaugeCircle as CircleGauge, 
    Gauge, Hammer, BadgeInfo as FactoryIcon, Calendar, BookOpen, UserCheck, Code, 
    Bell, UserPlus, FileUp, Files, TestTube, Thermometer, Droplets, Droplet as DropletIcon, 
    Component, Lightbulb as LightbulbIcon, Coins as HandCoins, Building, Building2, 
    HelpCircle, Upload, DraftingCompass, Tornado, Waves as WavesIcon, Filter, 
    FileClock, ShieldHalf, Footprints, Cylinder, Cuboid, ShieldCheck, AlertTriangle, 
    Grid, Dices, GitBranch, Layers, List, Lock, History, Map
} from 'lucide-react';

// Central Icon Registry for Dynamic App Loading
export const iconRegistry = {
    Layers3, Database, Workflow, DollarSign, Wrench, Search, Calculator, Target, 
    SplitSquareHorizontal, Beaker, LandPlot, Route, Waves, ScanSearch, Waypoints, 
    Scaling, HelpingHand, Sprout, Wind, Droplet, Fuel, HardHat, Bolt, 
    Pipette, LayoutDashboard, Settings, Compass, Box, Package, Globe, Users, 
    TrendingUp, Handshake, Shield, Monitor, Briefcase, FileText, 
    CheckCircle, Lightbulb, Rocket, BarChart2, Zap, Cloud, Sun, Leaf, Factory, 
    Recycle, Activity, FlaskConical, CircleDollarSign, Coins, Scale, TrendingDown, 
    Eye, LightbulbOff, FlaskRound, Sparkles, Network, CircleGauge, 
    Gauge, Hammer, FactoryIcon, Calendar, BookOpen, UserCheck, Code, 
    Bell, UserPlus, FileUp, Files, TestTube, Thermometer, Droplets, DropletIcon, 
    Component, LightbulbIcon, HandCoins, Building, Building2, 
    HelpCircle, Upload, DraftingCompass, Tornado, WavesIcon, Filter, 
    FileClock, ShieldHalf, Footprints, Cylinder, Cuboid, ShieldCheck, AlertTriangle, 
    Grid, Dices, GitBranch, Layers, List, Lock, History, Map
};

export const getAppIcon = (iconName) => {
    if (!iconName) return Box;
    return iconRegistry[iconName] || Box;
};

// Deprecated: Hardcoded lists are removed in favor of Database-driven lists via useAppsFromDatabase hook.
export const appCategories = [];
export const applications = [];

/**
 * Retrieves an application definition by its ID or Slug.
 * Note: This searches the static 'applications' array. For database apps, use the useAppsFromDatabase hook.
 * @param {string} id - The app ID or slug
 * @returns {object|undefined} The app definition or undefined
 */
export const getAppById = (id) => {
    if (!id) return undefined;
    return applications.find(app => app.id === id || app.slug === id);
};
