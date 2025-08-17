import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} Eventora. All rights reserved.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center">
          <a
            href="https://www.privacypolicygenerator.info/live.php?token=sample"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.termsandconditionsgenerator.com/live.php?token=sample"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition-colors"
          >
            Terms of Service
          </a>
          <a
            href="https://www.example.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>

      <div className="mt-6 border-t border-gray-700"></div>
    </footer>
  );
};

export default Footer;

