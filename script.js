
/* ==========================================
   RIZWAN EDITS — PORTFOLIO SCRIPT
   Video Grid + Lightbox + Floating Particles
   ========================================== */


/* ==========================================
   VIDEO LIGHTBOX
   ========================================== */

const lightbox = document.getElementById("lightbox");
const lbVideo = document.getElementById("lb-video");
const lbTitle = document.getElementById("lb-title");

function openLightbox(media) {
  if (!lightbox || !lbVideo) return;

  const id = media.dataset.id;
  if (!id) return;

  const card = media.closest(".card");
  const title =
    card?.querySelector("h3")?.textContent || "PROJECT";

  if (lbTitle) lbTitle.textContent = title;

  // Remove the previous player
  lbVideo.innerHTML = "";

  const iframe = document.createElement("iframe");

  iframe.src =
    `https://drive.google.com/file/d/${id}/preview`;

  iframe.title = title;
  iframe.allow = "autoplay; fullscreen";
  iframe.allowFullscreen = true;

  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "0";

  lbVideo.appendChild(iframe);

  // Adjust modal for portrait videos
  const shell = lightbox.querySelector(".lb-shell");

  if (shell) {
    shell.classList.toggle(
      "portrait",
      card?.classList.contains("vertical") || false
    );
  }

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeLightbox() {
  if (!lightbox || !lbVideo) return;

  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  // Stop playback when closing
  lbVideo.innerHTML = "";
}

// Click a thumbnail to watch
document.querySelectorAll(".media").forEach(media => {
  media.style.cursor = "pointer";

  media.addEventListener("click", () => {
    openLightbox(media);
  });

  media.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(media);
    }
  });
});

// Close button
document.querySelector(".lb-close")
  ?.addEventListener("click", closeLightbox);

// Click outside the player to close
lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Press Escape to close
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});


/* ==========================================
   CINEMATIC FLOATING DUST PARTICLES
   ========================================== */

(() => {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (reduceMotion.matches) return;

  let particles = [];
  let width = 0;
  let height = 0;
  let animationId = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(
      65,
      Math.floor((width * height) / 17000)
    );

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.4,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -(Math.random() * 0.22 + 0.06),
      alpha: Math.random() * 0.35 + 0.08,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() < 0.12
        ? "216, 255, 62"
        : Math.random() < 0.35
          ? "230, 198, 142"
          : "235, 239, 245"
    }));
  }

  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const flicker =
        0.75 + Math.sin(time * 0.0008 + p.phase) * 0.25;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle =
        `rgba(${p.color}, ${p.alpha * flicker})`;
      ctx.fill();
    });

    animationId = requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener("resize", resize);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(animate);
    }
  });

  animationId = requestAnimationFrame(animate);
})();

/* ==========================================
   MUTED HOVER VIDEO PREVIEWS
   ========================================== */

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {

  document.querySelectorAll(".media[data-preview]").forEach(media => {

    let preview = null;
    let hoverTimer = null;

    media.addEventListener("mouseenter", () => {

      hoverTimer = setTimeout(() => {

        if (preview) return;

        preview = document.createElement("video");

        preview.src = media.dataset.preview;
        preview.muted = true;
        preview.defaultMuted = true;
        preview.autoplay = true;
        preview.loop = true;
        preview.playsInline = true;
        preview.preload = "metadata";

        preview.className = "hover-preview";

        media.appendChild(preview);

        preview.play().catch(() => {
          preview.remove();
          preview = null;
        });

      }, 250);

    });

    media.addEventListener("mouseleave", () => {

      clearTimeout(hoverTimer);

      if (preview) {
        preview.pause();
        preview.removeAttribute("src");
        preview.load();
        preview.remove();
        preview = null;
      }

    });

  });

}

