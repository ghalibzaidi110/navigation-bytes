import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './BytesMenu.css';

interface BytesMenuProps {
  heroImage?: string;
  logoImage?: string;
  className?: string;
}

const BytesMenu: React.FC<BytesMenuProps> = ({
  heroImage = '/assets/hero.jpg',
  logoImage = '/assets/bytes-logo.png',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const menuImgContainerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0 });
  const center = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const defaultEase = "power4.inOut";
  const scales = [0.81, 0.84, 0.87, 0.9];

  useEffect(() => {
    // Initial GSAP setup
    gsap.set(".menu-logo img", { y: 50 });
    gsap.set(".menu-link p", { y: 40 });
    gsap.set(".menu-sub-item p", { y: 12 });
    gsap.set(["#img-2, #img-3, #img-4"], { top: "150%" });

    // Mouse move handler for tilt effect
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      updateTilt();
    };

    // Resize handler
    const handleResize = () => {
      center.current.x = window.innerWidth / 2;
      center.current.y = window.innerHeight / 2;
    };

    document.body.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const updateTilt = () => {
    if (!menuImgContainerRef.current || !imagesRef.current) return;

    const dx = mouse.current.x - center.current.x;
    const dy = mouse.current.y - center.current.y;

    const tiltx = (dy / center.current.y) * 20;
    const tilty = (dx / center.current.x) * 20;

    gsap.to(menuImgContainerRef.current, {
      duration: 2,
      transform: `rotate3d(${tiltx}, ${tilty}, 0, 15deg)`,
      ease: "power3.out",
    });

    imagesRef.current.forEach((img, index) => {
      if (!img) return;
      const parallaxX = -(dx * (index + 1)) / 100;
      const parallaxY = -(dy * (index + 1)) / 100;

      const transformStyles = `translate(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px)) scale(${scales[index]})`;
      gsap.to(img, {
        duration: 2,
        transform: transformStyles,
        ease: "power3.out",
      });
    });
  };

  const openMenu = () => {
    gsap.to(".menu", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      pointerEvents: "all",
      duration: 1.25,
      ease: defaultEase,
    });

    gsap.to(".hero", {
      top: "-50%",
      opacity: 0,
      duration: 1.25,
      ease: defaultEase,
    });

    gsap.to(".menu-logo img", {
      y: 0,
      duration: 1,
      delay: 0.75,
      ease: "power3.out",
    });

    gsap.to(".menu-link p", {
      y: 0,
      duration: 1,
      stagger: 0.075,
      delay: 1,
      ease: "power3.out",
    });

    gsap.to(".menu-sub-item p", {
      y: 0,
      duration: 0.75,
      stagger: 0.05,
      delay: 1,
      ease: "power3.out",
    });

    gsap.to(["#img-2, #img-3, #img-4"], {
      top: "50%",
      duration: 1.25,
      ease: defaultEase,
      stagger: 0.1,
      delay: 0.25,
      onComplete: () => {
        gsap.set(".hero", { top: "50%" });
        setIsOpen(true);
      },
    });
  };

  const closeMenu = () => {
    gsap.to(".menu", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      pointerEvents: "none",
      duration: 1.25,
      ease: defaultEase,
    });

    gsap.to(".menu-items", {
      top: "-300px",
      opacity: 0,
      duration: 1.25,
      ease: defaultEase,
    });

    gsap.to(".hero", {
      top: "0%",
      opacity: 1,
      duration: 1.25,
      ease: defaultEase,
      onComplete: () => {
        gsap.set(".menu", {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        });
        gsap.set(".menu-logo img", { y: 50 });
        gsap.set(".menu-link p", { y: 40 });
        gsap.set(".menu-sub-item p", { y: 12 });
        gsap.set(".menu-items", { opacity: 1, top: "0px" });
        gsap.set(["#img-2, #img-3, #img-4"], { top: "150%" });

        setIsOpen(false);
      },
    });
  };

  const handleMenuOpen = () => {
    if (isOpen) return;
    openMenu();
  };

  const handleMenuClose = () => {
    if (!isOpen) return;
    closeMenu();
  };

  const setImageRef = (index: number) => (el: HTMLImageElement | null) => {
    if (imagesRef.current) {
      imagesRef.current[index] = el;
    }
  };

  return (
    <div className={`bytes-menu-container ${className}`}>
      <nav className="bytes-nav">
        <div className="logo">
          <img src={logoImage} alt="Bytes Platform Logo" />
        </div>
        <p className="menu-open" onClick={handleMenuOpen}>
          Menu
        </p>
      </nav>

      <section className="hero" ref={heroRef}>
        <div className="header">
          <h1>Bytes Platform</h1>
          <sup>&copy;</sup>
        </div>
      </section>

      <div className="menu" ref={menuRef}>
        <div className="menu-nav">
          <p className="menu-close" onClick={handleMenuClose}>
            Close
          </p>
        </div>

        <div className="menu-col menu-img" ref={menuImgContainerRef}>
          <img
            id="img-1"
            src={heroImage}
            alt=""
            ref={setImageRef(0)}
          />
          <img
            id="img-2"
            src={heroImage}
            alt=""
            ref={setImageRef(1)}
          />
          <img
            id="img-3"
            src={heroImage}
            alt=""
            ref={setImageRef(2)}
          />
          <img
            id="img-4"
            src={heroImage}
            alt=""
            ref={setImageRef(3)}
          />
        </div>

        <div className="menu-col menu-items">
          <div className="menu-logo">
            <img src={logoImage} alt="Bytes Platform Logo" />
          </div>

          <div className="menu-links">
            <div className="menu-link">
              <p><a href="#">Home</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#">About</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#">Services</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#">Technologies</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#">Careers</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#">Portfolio</a></p>
            </div>
            <div className="menu-link">
              <p><a href="#">Contact Us</a></p>
            </div>
          </div>

          <div className="menu-footer">
            <div className="menu-sub-col">
              <div className="menu-sub-item">
                <p className="section-title">Contact Us</p>
              </div>
              <div className="menu-sub-item">
                <p>+12149374683</p>
              </div>
              <div className="menu-sub-item">
                <p>info@bytesplatform.com</p>
              </div>
              <br />
              <div className="menu-sub-item">
                <p className="section-title">Location</p>
              </div>
              <div className="menu-sub-item">
                <p>Bytes Platform Production Office</p>
              </div>
              <div className="menu-sub-item">
                <p>14-C 2nd Commercial Ln</p>
              </div>
              <div className="menu-sub-item">
                <p>Defence V</p>
              </div>
            </div>
            <div className="menu-sub-col">
              <div className="menu-sub-item">
                <p className="section-title">Follow Us</p>
              </div>
              <div className="menu-sub-item">
                <p><a href="#">LinkedIn</a></p>
              </div>
              <div className="menu-sub-item">
                <p><a href="https://www.instagram.com/bytesplatform/">Instagram</a></p>
              </div>
              <div className="menu-sub-item">
                <p><a href="#">Twitter</a></p>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BytesMenu;