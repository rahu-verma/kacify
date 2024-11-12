import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Products from "@/components/products";

export default function Home() {
  return (
    <div className="px-5">
      <Navbar />
      <div className="h-4" />
      <Products />
      <div className="h-4" />
      <Footer />
    </div>
  );
}
