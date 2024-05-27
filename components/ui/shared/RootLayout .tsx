// components/ui/shared/RootLayout.tsx

import Footer from "./Footer";
import Header from "./Header";

const RootLayout = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      <Header/>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
