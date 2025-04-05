export default function MenuLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <section id="menu" className="w-5/12 mx-auto h-auto">
                {children}
            </section>
        </div>
    );
}
