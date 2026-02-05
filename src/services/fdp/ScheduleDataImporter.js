/**
 * Schedule Data Importer
 * Simulates importing project plans from external tools (Primavera, MS Project, etc.)
 */

export class ScheduleDataImporter {
    static async importFromProjectManagement() {
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 800));

        const today = new Date();
        const fmt = (date) => date.toISOString().split('T')[0];
        const add = (days) => {
            const d = new Date(today);
            d.setDate(d.getDate() + days);
            return fmt(d);
        };

        return [
            { id: 'act-1', name: 'Project Sanction', type: 'Milestone', start: add(0), end: add(0), duration: 0, progress: 100, dependencies: [] },
            { id: 'act-2', name: 'Detailed Engineering', type: 'Engineering', start: add(1), end: add(60), duration: 60, progress: 45, dependencies: ['act-1'] },
            { id: 'act-3', name: 'Procurement - Long Lead', type: 'Procurement', start: add(30), end: add(120), duration: 90, progress: 20, dependencies: ['act-1'] },
            { id: 'act-4', name: 'Fabrication - Topsides', type: 'Fabrication', start: add(121), end: add(300), duration: 180, progress: 0, dependencies: ['act-3'] },
            { id: 'act-5', name: 'Drilling Campaign', type: 'Drilling', start: add(150), end: add(400), duration: 250, progress: 0, dependencies: ['act-2'] },
            { id: 'act-6', name: 'Installation & HUC', type: 'Installation', start: add(301), end: add(360), duration: 60, progress: 0, dependencies: ['act-4'] },
            { id: 'act-7', name: 'First Oil', type: 'Milestone', start: add(401), end: add(401), duration: 0, progress: 0, dependencies: ['act-5', 'act-6'] }
        ];
    }
}