// src/pages/Landing.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  FaStethoscope,
  FaHeartbeat,
  FaUserMd,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaEnvelope,
  FaLinkedin,
  FaFacebook,
  FaBars,
  FaTimes,
} from 'react-icons/fa'
import logo from '/vite.svg' // replace with your actual logo path

export default function Landing() {
  const navigate = useNavigate()
  const cta = () => navigate('/login')
  const [navOpen, setNavOpen] = useState(false)

  const navLinks = [
    { name: 'About', to: '#about' },
    { name: 'Services', to: '#services' },
    { name: 'Contact', to: '#contact' },
  ]

  return (
    <div className="font-sans text-gray-800">
      {/* Navigation Bar */}
      <header className="bg-white fixed w-full z-20 shadow-md">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="JM Clinics Logo"
              className="h-12 w-auto md:h-16"
            />
            <span className="text-2xl font-bold text-blue-700">JM Clinics</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.to}
                className="text-gray-700 hover:text-blue-600 transition"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={cta}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setNavOpen((o) => !o)}
          >
            {navOpen ? <FaTimes /> : <FaBars />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {navOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="flex flex-col items-center space-y-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.to}
                  onClick={() => setNavOpen(false)}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={cta}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section
        id="home"
        className="relative h-screen bg-cover bg-center flex items-center justify-center pt-24"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 max-w-2xl text-center px-4">
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">
            Welcome to JM Clinics
          </h1>
          <p className="text-lg text-gray-200 mb-6">
            Your health is our mission ― expert care, modern facilities, and compassionate
            staff all under one roof.
          </p>
          <button
            onClick={cta}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full shadow-lg transition"
          >
            Book an Appointment
          </button>
        </div>
      </section>

      {/* Features / Services */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-8">Why Choose JM Clinics?</h2>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-4">
              <FaUserMd className="mx-auto text-5xl text-blue-500" />
              <h3 className="text-xl font-semibold">Experienced Doctors</h3>
              <p>Board-certified specialists with years of hands-on experience in every field of medicine.</p>
            </div>
            <div className="space-y-4">
              <FaStethoscope className="mx-auto text-5xl text-blue-500" />
              <h3 className="text-xl font-semibold">Comprehensive Care</h3>
              <p>From routine checkups to advanced diagnostics, we’ve got you covered.</p>
            </div>
            <div className="space-y-4">
              <FaHeartbeat className="mx-auto text-5xl text-blue-500" />
              <h3 className="text-xl font-semibold">Patient-Centered</h3>
              <p>Your comfort and well-being are our top priority in every treatment plan.</p>
            </div>
          </div>
          <button
            onClick={cta}
            className="mt-10 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-full shadow transition"
          >
            Register & Book Now
          </button>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <img
            src="/clinic-team.jpg"
            alt="JM Clinics Team"
            className="w-full md:w-1/2 rounded-lg shadow-lg object-cover h-96"
          />
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-3xl font-semibold mb-4">About JM Clinics</h2>
            <p>
              At JM Clinics, we blend state-of-the-art technology with personalized care.
              Our multidisciplinary team works together to bring you the highest standard
              of medical services in a warm, welcoming environment.
            </p>
            <p>
              Whether you need a general check-up, specialized consultation, or emergency
              care, our doors are always open. Trust us with your health ― you’re in expert hands.
            </p>
            <button
              onClick={cta}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded shadow transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Contact & Connect */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-8">Connect With Us</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <a
              href="https://wa.me/254796719356"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-green-600 hover:text-green-700"
            >
              <FaWhatsapp className="text-2xl" />
              <span>WhatsApp: +254 7967 19356</span>
            </a>
            <a
              href="tel:0748526233"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <FaPhoneAlt className="text-2xl" />
              <span>Call Us: 074 852 6233</span>
            </a>
            <a
              href="mailto:JMclinic@gmail.com"
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <FaEnvelope className="text-2xl" />
              <span>Email: JMclinic@gmail.com</span>
            </a>
            <a
              href="https://www.linkedin.com/in/james-murachia-08b53233b"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-800 hover:text-blue-900"
            >
              <FaLinkedin className="text-2xl" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://www.facebook.com/JMClinics"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
            >
              <FaFacebook className="text-2xl" />
              <span>Facebook</span>
            </a>
            <div className="flex items-center space-x-2 text-gray-600">
              <FaMapMarkerAlt className="text-2xl text-blue-500" />
              <span>123 Health St, Gilgil, Nakuru, Kenya</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-2">
          <p>© {new Date().getFullYear()} JM Clinics. All rights reserved.</p>
          <p>Developed by J.M Murachia</p>
        </div>
      </footer>
    </div>
  )
}
