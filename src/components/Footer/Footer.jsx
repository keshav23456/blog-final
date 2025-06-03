import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

function Footer() {
  return (
    <section className="relative overflow-hidden py-10 bg-gray-100 border-t border-gray-300">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap -m-6">
          {/* Logo & Copyright */}
          <div className="w-full p-6 md:w-1/2 lg:w-5/12">
            <div className="flex h-full flex-col justify-between">
              <div className="mb-4 inline-flex items-center">
                <Logo width="70px" />
              </div>
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} All rights reserved by Shreya.
              </p>
            </div>
          </div>

          {/* Company Links */}
          <FooterColumn title="Company" links={['Features', 'Pricing', 'Affiliate Program', 'Press Kit']} />

          {/* Support Links */}
          <FooterColumn title="Support" links={['Account', 'Help', 'Contact Us', 'Customer Support']} />

          {/* Legal Links */}
          <FooterColumn title="Legals" links={['Terms & Conditions', 'Privacy Policy', 'Licensing']} />
        </div>
      </div>
    </section>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
      <div className="h-full">
        <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-gray-600">{title}</h3>
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link}>
              <Link
                to="/"
                className="text-base font-medium text-gray-700 hover:text-indigo-500 transition-colors duration-200"
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Footer;
