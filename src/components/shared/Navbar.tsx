import Link from "next/link";

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold text-slate-900">
                    TiendaUCN
                </Link>

                <nav className="hidden md:flex gap-6">
                    <Link href="/limpieza" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                        Suministros de Limpieza
                    </Link>
                    <Link href="/quimicos" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                        Productos Químicos
                    </Link>
                    <Link href="/resenas" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                        Reseñas
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
                        Mi Cuenta
                    </button>
                </div>
            </div>
        </header>
    );
}