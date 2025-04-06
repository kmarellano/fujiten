import { Card } from '@/components/ui/card';

export default function ColorsShowcase() {
    const colorSections = [
        {
            title: 'Base Colors',
            colors: [
                { name: 'Background', var: 'bg-background' },
                { name: 'Foreground', var: 'text-foreground' },
            ],
        },
        {
            title: 'Card Colors',
            colors: [
                { name: 'Card', var: 'bg-card' },
                { name: 'Card Foreground', var: 'text-card-foreground' },
            ],
        },
        {
            title: 'Popover Colors',
            colors: [
                { name: 'Popover', var: 'bg-popover' },
                { name: 'Popover Foreground', var: 'text-popover-foreground' },
            ],
        },
        {
            title: 'Primary & Secondary',
            colors: [
                { name: 'Primary', var: 'bg-primary' },
                { name: 'Primary Foreground', var: 'text-primary-foreground' },
                { name: 'Secondary', var: 'bg-secondary' },
                {
                    name: 'Secondary Foreground',
                    var: 'text-secondary-foreground',
                },
            ],
        },
        {
            title: 'Muted & Accent',
            colors: [
                { name: 'Muted', var: 'bg-muted' },
                { name: 'Muted Foreground', var: 'text-muted-foreground' },
                { name: 'Accent', var: 'bg-accent' },
                { name: 'Accent Foreground', var: 'text-accent-foreground' },
            ],
        },
        {
            title: 'Destructive & Border',
            colors: [
                { name: 'Destructive', var: 'bg-destructive' },
                {
                    name: 'Destructive Foreground',
                    var: 'text-destructive-foreground',
                },
                { name: 'Border', var: 'border' },
                { name: 'Input', var: 'bg-input' },
                { name: 'Ring', var: 'ring' },
            ],
        },
        {
            title: 'Chart Colors',
            colors: [
                { name: 'Chart 1', var: 'bg-[--chart-1]' },
                { name: 'Chart 2', var: 'bg-[--chart-2]' },
                { name: 'Chart 3', var: 'bg-[--chart-3]' },
                { name: 'Chart 4', var: 'bg-[--chart-4]' },
                { name: 'Chart 5', var: 'bg-[--chart-5]' },
            ],
        },
        {
            title: 'Sidebar Colors',
            colors: [
                { name: 'Sidebar', var: 'bg-sidebar' },
                { name: 'Sidebar Foreground', var: 'text-sidebar-foreground' },
                { name: 'Sidebar Primary', var: 'bg-sidebar-primary' },
                {
                    name: 'Sidebar Primary Foreground',
                    var: 'text-sidebar-primary-foreground',
                },
                { name: 'Sidebar Accent', var: 'bg-sidebar-accent' },
                {
                    name: 'Sidebar Accent Foreground',
                    var: 'text-sidebar-accent-foreground',
                },
                { name: 'Sidebar Border', var: 'border-sidebar' },
                { name: 'Sidebar Ring', var: 'ring-sidebar' },
            ],
        },
        {
            title: 'Additional Colors',
            colors: [
                { name: 'Highlight', var: 'bg-highlight' },
                { name: 'Warning', var: 'bg-warning' },
                { name: 'Success', var: 'bg-success' },
            ],
        },
    ];

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">Color Palette Showcase</h1>

            <div className="grid gap-8">
                {colorSections.map((section) => (
                    <Card key={section.title} className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            {section.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {section.colors.map((color) => (
                                <div key={color.name} className="space-y-2">
                                    <div
                                        className={`h-24 rounded-lg ${color.var}`}
                                        style={{
                                            boxShadow:
                                                'inset 0 0 0 1px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <p className="text-sm font-medium">
                                        {color.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground font-mono">
                                        {color.var}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-8">
                <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        Theme Toggle Example
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        The colors will change based on your theme preference.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex-1 p-4 bg-card rounded-lg">
                            <p className="text-card-foreground">Card Example</p>
                        </div>
                        <div className="flex-1 p-4 bg-popover rounded-lg">
                            <p className="text-popover-foreground">
                                Popover Example
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
