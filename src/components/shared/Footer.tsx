export default function Footer() {
    return (
        <footer className="border-t bg-slate-50 py-8 mt-auto">
            <div className="container mx-auto px-4 text-center text-sm text-slate-600">
                <p>&copy; {new Date().getFullYear()} TiendaUCN. Todos los derechos reservados.</p>
                <p className="mt-2">Calidad garantizada en cada producto.</p>
            </div>
        </footer>
    );
}