// App.tsx
import { Articles } from "./articles/articles";
import { Orders } from "./orders/orders";
import { Customers } from "./customers/customers";
import { Home } from "./home/home";
import { OrderDetails } from "./orders/orderDetails/page";
import { ArticleDetails } from "./articles/articleDetails";
import { Navbar } from "./components/ui/navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { CustomerDetails } from "./customers/customerDetails";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:article_id" element={<ArticleDetails />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:order_id" element={<OrderDetails />} />
        <Route path="/customers" element={<Customers />} />
        {/* <Route path="/customers/:customer_id" element={<CustomerDetails />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
