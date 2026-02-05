import { Droplets, Repeat, CornerDownRight, Box, Circle, Hexagon, Component, Waypoints, Zap, Wind } from 'lucide-react';

    export const ITEM_TYPES = {
      NODE: 'node',
    };

    export const NODE_TYPES = {
      well: {
        label: 'Well',
        icon: Droplets,
        bgColor: 'bg-green-600/80',
        iconColor: 'text-green-200',
        properties: ['gor_scf_stb', 'water_cut_percent'],
      },
      injector: {
        label: 'Injector',
        icon: Repeat,
        bgColor: 'bg-blue-600/80',
        iconColor: 'text-blue-200',
        properties: ['injection_rate_bpd', 'injection_pressure_psi'],
      },
      header: {
        label: 'Header',
        icon: CornerDownRight,
        bgColor: 'bg-sky-600/80',
        iconColor: 'text-sky-200',
        properties: ['max_capacity_bpd'],
      },
      manifold: {
        label: 'Manifold',
        icon: Waypoints,
        bgColor: 'bg-indigo-600/80',
        iconColor: 'text-indigo-200',
        properties: ['valve_positions'],
      },
      separator: {
        label: 'Separator',
        icon: Component,
        bgColor: 'bg-purple-600/80',
        iconColor: 'text-purple-200',
        properties: ['vessel_size', 'design_pressure_psi'],
      },
      compressor: {
        label: 'Compressor',
        icon: Wind,
        bgColor: 'bg-red-600/80',
        iconColor: 'text-red-200',
        properties: ['suction_pressure_psi', 'discharge_pressure_psi', 'horsepower'],
      },
      pump: {
        label: 'Pump',
        icon: Zap,
        bgColor: 'bg-orange-600/80',
        iconColor: 'text-orange-200',
        properties: ['head_psi', 'horsepower'],
      },
      water_plant: {
        label: 'Water Plant',
        icon: Hexagon,
        bgColor: 'bg-teal-600/80',
        iconColor: 'text-teal-200',
        properties: ['treatment_capacity_bwpd'],
      },
      tank: {
        label: 'Tank',
        icon: Box,
        bgColor: 'bg-yellow-600/80',
        iconColor: 'text-yellow-200',
        properties: ['capacity_bbl', 'fluid_level_ft'],
      },
      export_point: {
        label: 'Export',
        icon: Circle,
        bgColor: 'bg-slate-600/80',
        iconColor: 'text-slate-200',
        properties: ['contract_rate_bpd', 'delivery_pressure_psi'],
      },
    };