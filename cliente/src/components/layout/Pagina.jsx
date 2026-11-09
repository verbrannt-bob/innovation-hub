import Encabezado from "./Encabezado";
import Footer from "./Footer";

function Pagina({ titulo, children }) {
    return (
        <div className="pagina-layout">
            <Encabezado />
            <main className="container-fluid pb-5">
                <h1 className="text-center">{titulo}</h1>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Pagina