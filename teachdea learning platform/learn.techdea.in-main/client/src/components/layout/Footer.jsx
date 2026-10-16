import { Link } from "react-router-dom";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiArrowUp,
} from "react-icons/fi";
import {
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <style>{`
        /* ================================
           TECHDEA FOOTER
        ================================= */

        .footer {
          position: relative;
          background: #0b0b12;
          color: #cbd5e1;
          margin-top: 0;
          padding: 58px 5% 0;
          overflow: hidden;
        }

        .footer::before {
          content: "";
          position: absolute;
          width: 450px;
          height: 240px;
          top: -180px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(124, 58, 237, 0.15);
          filter: blur(85px);
          pointer-events: none;
        }

        .footer-grid {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.35fr 0.8fr 1fr 1fr;
          gap: 55px;
          padding-bottom: 48px;
        }

        /* ================================
           COMPANY
        ================================= */

        .footer-company {
          max-width: 330px;
        }

        .footer-logo {
          margin: 0 0 18px;
          font-size: 32px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -1.2px;
        }

        .footer-logo .tech {
          color: #ffffff;
        }

        .footer-logo .dea {
          color: #a855f7;
        }

        .footer-company p {
          margin: 0;
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.85;
        }

        /* ================================
           COLUMNS
        ================================= */

        .footer-column {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .footer-column h4 {
          margin: 0 0 20px;
          color: #ffffff;
          font-size: 18px;
          line-height: 1.2;
          font-weight: 700;
        }

        .footer-column a {
          color: #94a3b8;
          text-decoration: none;
          font-size: 15px;
          line-height: 1.6;
          margin-bottom: 11px;
          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }

        .footer-column a:hover {
          color: #c084fc;
          transform: translateX(3px);
        }

        /* ================================
           CONTACT
        ================================= */

        .footer-contact a,
        .footer-contact > span {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-contact a {
          margin-bottom: 14px;
        }

        .footer-contact svg {
          flex-shrink: 0;
          font-size: 17px;
        }

        .footer-contact a svg,
        .footer-contact > span > svg {
          color: #a78bfa;
        }

        .footer-contact span {
          color: #94a3b8;
          font-size: 15px;
          line-height: 1.5;
        }

        /* ================================
           SOCIAL ICONS
        ================================= */

        .footer-social {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-top: 15px;
        }

        .footer-social a {
          width: 40px;
          height: 40px;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #292936;
          border-radius: 50%;
          background: transparent;
          color: #cbd5e1;
          font-size: 15px;
          transition: all 0.2s ease;
        }

        .footer-social a:hover {
          color: #ffffff;
          background: #24113b;
          border-color: #7c3aed;
          transform: translateY(-3px);
        }

        /* ================================
           BOTTOM
        ================================= */

        .footer-bottom {
          position: relative;
          z-index: 1;
          border-top: 1px solid #20202a;
        }

        .footer-bottom-inner {
          max-width: 1180px;
          min-height: 68px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          font-size: 14px;
          color: #64748b;
        }

        .footer-tagline {
          color: #a78bfa;
          font-size: 14px;
          font-weight: 600;
        }

        /* ================================
           SCROLL TOP
        ================================= */

        .footer-top-btn {
          position: absolute;
          right: 6%;
          bottom: 21px;
          width: 42px;
          height: 42px;
          border: 1px solid #3b2a55;
          border-radius: 50%;
          background: #24113b;
          color: #c084fc;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s ease;
        }

        .footer-top-btn:hover {
          background: #7c3aed;
          border-color: #7c3aed;
          color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(124, 58, 237, 0.25);
        }

        /* ================================
           TABLET
        ================================= */

        @media (max-width: 950px) {
          .footer {
            padding: 48px 5% 0;
          }

          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px 30px;
          }

          .footer-company {
            max-width: 360px;
          }
        }

        /* ================================
           MOBILE
        ================================= */

        @media (max-width: 600px) {
          .footer {
            padding: 42px 20px 0;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 34px;
            padding-bottom: 35px;
          }

          .footer-company {
            max-width: none;
          }

          .footer-logo {
            font-size: 30px;
          }

          .footer-company p {
            font-size: 14px;
          }

          .footer-column h4 {
            font-size: 17px;
          }

          .footer-column a,
          .footer-contact span {
            font-size: 14px;
          }

          .footer-bottom-inner {
            min-height: 82px;
            padding-right: 52px;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: 6px;
          }

          .footer-tagline {
            font-size: 13px;
          }

          .footer-top-btn {
            right: 18px;
            bottom: 20px;
            width: 40px;
            height: 40px;
          }
        }
      `}</style>

      <footer className="footer">

        <div className="footer-grid">

          {/* Company */}
          <div className="footer-company">

            <h2 className="footer-logo">
              <span className="tech">Tech</span>
              <span className="dea">Dea</span>
            </h2>

            <p>
              TechDea creates innovative software, responsive
              websites, internships, and industry-focused
              training programs to help students gain
              real-world experience and build their careers.
            </p>

          </div>

          {/* Quick Links */}
          <div className="footer-column">

            <h4>Quick Links</h4>

            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/training">Training</Link>
            <Link to="/courses">Courses</Link>
            <Link to="/contact">Contact</Link>

          </div>

          {/* Services */}
          <div className="footer-column">

            <h4>Services</h4>

            <Link to="/services">
              Website Development
            </Link>

            <Link to="/services">
              Software Development
            </Link>

            <Link to="/services">
              UI/UX Design
            </Link>

            <Link to="/services">
              IT Training
            </Link>

            <Link to="/services">
              Internship Program
            </Link>

            <Link to="/services">
              Project Guidance
            </Link>

          </div>

          {/* Contact */}
          <div className="footer-column footer-contact">

            <h4>Contact</h4>

            <a href="tel:+919369907885">
              <FiPhone />
              <span>+91 9369907885</span>
            </a>

            <a href="mailto:contact.TechDea@gmail.com">
              <FiMail />
              <span>contact.TechDea@gmail.com</span>
            </a>

            <a href="mailto:manager.TechDea@gmail.com">
              <FiMail />
              <span>manager.TechDea@gmail.com</span>
            </a>

            <span>
              <FiMapPin />
              <span>Ghaziabad, India</span>
            </span>

            {/* Social */}
            <div className="footer-social">

              <a
                href="https://www.youtube.com"
                aria-label="YouTube"
                target="_blank"
                rel="noreferrer"
              >
                <FaYoutube />
              </a>

              <a
                href="https://www.instagram.com"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
              </a>

              <a
                href="https://www.linkedin.com"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://wa.me/919369907885"
                aria-label="WhatsApp"
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp />
              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">

          <div className="footer-bottom-inner">

            <span>
              © {new Date().getFullYear()} TechDea.
              All Rights Reserved.
            </span>

            <span className="footer-tagline">
              Converts Ideas Into Technologies
            </span>

          </div>

        </div>

        {/* Scroll To Top */}
        <button
          type="button"
          className="footer-top-btn"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <FiArrowUp />
        </button>

      </footer>
    </>
  );
}