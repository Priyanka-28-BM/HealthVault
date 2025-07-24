import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

const PageTransitionWrapper = ({ children }) => {
  const wrapper = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.set(wrapper.current, {
        opacity: 0,
        rotateX: -95,
        scaleY: 0.85,
        skewY: 4,
        transformOrigin: "top center",
        boxShadow: "0 0 0 rgba(0,0,0,0)",
      });

      tl.to(wrapper.current, {
        opacity: 1,
        rotateX: 0,
        scaleY: 1,
        skewY: 0,
        duration: 1.4, // slower
        ease: "power3.out",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      });
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapper}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1600px",
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default PageTransitionWrapper;
