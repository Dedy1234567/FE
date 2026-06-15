import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-1 container mx-auto p-6">
        {children}
      </main>

      <Footer />

    </div>
  );
}

export default MainLayout;