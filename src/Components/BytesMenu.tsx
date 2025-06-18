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
  const [isMobile, setIsMobile] = useState(false); // Track if screen is mobile/tablet
  const [buttonText, setButtonText] = useState('Menu'); // Control button text separately
  
  // Refs for DOM elements
  const menuRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const menuImgContainerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  
  // Mouse tracking for tilt effect
  const mouse = useRef({ x: 0, y: 0 });
  const center = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Animation settings
  const defaultEase = "power4.inOut";
  const scales = [0.81, 0.84, 0.87, 0.9]; // Different scales for layered images

  // Breakpoint for mobile/tablet detection
  const MOBILE_BREAKPOINT = 768;

  // Check if screen size is mobile/tablet
  const checkScreenSize = () => {
    setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
  };

  useEffect(() => {
    // Initial screen size check
    checkScreenSize();

    // Initial GSAP setup - set starting positions for animation elements
    gsap.set(".menu-logo img", { y: 50 }); // Logo slides up from bottom
    gsap.set(".menu-link p", { y: 40 }); // Menu links slide up from bottom
    gsap.set(".menu-sub-item p", { y: 12 }); // Sub-items slight upward movement
    
    // Set initial positions for images 2, 3, 4 based on screen size
    setInitialImagePositions();

    // Mouse move handler for 3D tilt effect on images
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      updateTilt();
    };

    // Window resize handler - updates center point and checks screen size
    const handleResize = () => {
      center.current.x = window.innerWidth / 2;
      center.current.y = window.innerHeight / 2;
      checkScreenSize();
      setInitialImagePositions();
    };

    // Add event listeners
    document.body.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup event listeners
    return () => {
      document.body.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Set initial image positions based on screen size
  const setInitialImagePositions = () => {
    if (isMobile) {
      // Mobile: Images 2, 3, 4 start from right side (150% right)
      gsap.set(["#img-2, #img-3, #img-4"], { right: "-50%", top: "50%" });
    } else {
      // Desktop: Images 2, 3, 4 start from bottom (150% down)
      gsap.set(["#img-2, #img-3, #img-4"], { top: "150%", right: "auto" });
    }
  };

  // 3D tilt effect based on mouse position
  const updateTilt = () => {
    if (!menuImgContainerRef.current || !imagesRef.current) return;

    // Calculate mouse offset from center
    const dx = mouse.current.x - center.current.x;
    const dy = mouse.current.y - center.current.y;

    // Calculate tilt angles (inverted for natural feel)
    const tiltx = (dy / center.current.y) * 20;
    const tilty = (dx / center.current.x) * 20;

    // Apply 3D rotation to image container
    gsap.to(menuImgContainerRef.current, {
      duration: 2,
      transform: `rotate3d(${tiltx}, ${tilty}, 0, 15deg)`,
      ease: "power3.out",
    });

    // Apply parallax effect to individual images
    imagesRef.current.forEach((img, index) => {
      if (!img) return;
      
      // Calculate parallax offset (each image moves slightly different amount)
      const parallaxX = -(dx * (index + 1)) / 100;
      const parallaxY = -(dy * (index + 1)) / 100;

      // Apply transform with parallax and scale
      const transformStyles = `translate(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px)) scale(${scales[index]})`;
      gsap.to(img, {
        duration: 2,
        transform: transformStyles,
        ease: "power3.out",
      });
    });
  };

  // Open menu animation
  const openMenu = () => {
    // Expand menu overlay using clip-path
    gsap.to(".menu", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      pointerEvents: "all",
      duration: 1.25,
      ease: defaultEase,
    });

    // Hide hero section
    gsap.to(".hero", {
      top: "-50%",
      opacity: 0,
      duration: 1.25,
      ease: defaultEase,
    });

    // Change button text during animation
    gsap.to({}, {
      duration: 0.5,
      delay: 0.3,
      onComplete: () => {
        setButtonText('Close');
      }
    });

    // Animate menu logo appearance
    gsap.to(".menu-logo img", {
      y: 0,
      duration: 1,
      delay: 0.75,
      ease: "power3.out",
    });

    // Animate menu links with stagger effect
    gsap.to(".menu-link p", {
      y: 0,
      duration: 1,
      stagger: 0.075, // Each link animates 0.075s after the previous
      delay: 1,
      ease: "power3.out",
    });

    // Animate menu sub-items
    gsap.to(".menu-sub-item p", {
      y: 0,
      duration: 0.75,
      stagger: 0.05,
      delay: 1,
      ease: "power3.out",
    });

    // Animate images 2, 3, 4 based on screen size
    if (isMobile) {
      // Mobile: Images slide in from bottom
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
    } else {
      // Desktop: Images slide up from bottom
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
    }
  };

  // Close menu animation
  const closeMenu = () => {
    // Collapse menu overlay using clip-path
    gsap.to(".menu", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      pointerEvents: "none",
      duration: 1.25,
      ease: defaultEase,
    });

    // Hide menu items
    gsap.to(".menu-items", {
      top: "-300px",
      opacity: 0,
      duration: 1.25,
      ease: defaultEase,
    });

    // Change button text back during animation
    gsap.to({}, {
      duration: 0.5,
      delay: 0.3,
      onComplete: () => {
        setButtonText('Menu');
      }
    });

    // Show hero section
    gsap.to(".hero", {
      top: "0%",
      opacity: 1,
      duration: 1.25,
      ease: defaultEase,
      onComplete: () => {
        // Reset menu state after animation completes
        gsap.set(".menu", {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        });
        
        // Reset element positions for next opening
        gsap.set(".menu-logo img", { y: 50 });
        gsap.set(".menu-link p", { y: 40 });
        gsap.set(".menu-sub-item p", { y: 12 });
        gsap.set(".menu-items", { opacity: 1, top: "0px" });
        
        // Reset image positions based on screen size
        if (isMobile) {
          gsap.set(["#img-2, #img-3, #img-4"], { right: "auto", top: "150%" });
        } else {
          gsap.set(["#img-2, #img-3, #img-4"], { right: "auto", top: "150%" });
        }

        setIsOpen(false);
      },
    });
  };

  // Handle menu open button click
  const handleMenuOpen = () => {
    if (isOpen) return; // Prevent multiple opens
    openMenu();
  };

  // Handle menu close button click
  const handleMenuClose = () => {
    if (!isOpen) return; // Prevent multiple closes
    closeMenu();
  };

  // Helper function to set image refs for GSAP animations
  const setImageRef = (index: number) => (el: HTMLImageElement | null) => {
    if (imagesRef.current) {
      imagesRef.current[index] = el;
    }
  };

  return (
    <div className={`bytes-menu-container ${className}`}>
      {/* Navigation bar */}
      <nav className="bytes-nav">
        <div className="logo">
          <img src={logoImage} alt="Bytes Platform Logo" />
        </div>
        <p className="menu-toggle" onClick={isOpen ? handleMenuClose : handleMenuOpen}>
          {buttonText}
        </p>
      </nav>

      {/* Hero section - visible when menu is closed */}
      <section className="hero" ref={heroRef}>
        <div className="header">
          <h1>Bytes Platform</h1>
          <sup>&copy;</sup>
        </div>
      </section>

      {/* Full-screen menu overlay */}
      <div className="menu" ref={menuRef}>
        {/* Menu navigation with close button */}
        <div className="menu-nav">
          <p className="menu-toggle" onClick={handleMenuClose}>
            Close
          </p>
        </div>

        {/* Image container with layered images and 3D tilt effect */}
        <div className="menu-col menu-img" ref={menuImgContainerRef}>
          {/* Main hero image - always visible */}
          <img
            id="img-1"
            src={heroImage}
            alt=""
            ref={setImageRef(0)}
          />
          {/* Additional layered images that animate in */}
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

        {/* Menu content - navigation links and footer */}
        <div className="menu-col menu-items">
          {/* Menu logo */}
          <div className="menu-logo">
            <img src={logoImage} alt="Bytes Platform Logo" />
          </div>

          {/* Main navigation links */}
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

          {/* Menu footer with contact info and social links */}
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