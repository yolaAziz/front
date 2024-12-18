import { Facebook, Instagram } from "lucide-react";

function Footer() {
  return (
    <footer className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-bold text-xl mb-2">About the Shop</h2>
          <p className="text-md leading-relaxed">
            A cozy socks shop full of vibrant colors, <br />
            quirky patterns, and comfort for every step. <br /> More than socks...
            <br />
            — it’s a step into joy and style!
          </p>
        </div>
        <div>
          <h2 className="font-bold text-xl mb-2">Contact Us</h2>
          <div className="space-y-2">
            <p className="text-md">Phone: 01021550979</p>
            <p className="text-md break-words">Email: watermelon@gmail.com</p>
          </div>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.instagram.com/batei55/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-amber-700"
            >
              <Instagram />
            </a>
            <a
              href="https://www.facebook.com/batei55/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-600"
            >
              <Facebook />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
