// ==========================================
// HORIZONTAL VIDEO RAIL NAVIGATION
// ==========================================

document.querySelectorAll("[data-rail]").forEach(rail => {

  // Mouse wheel horizontal scrolling
  rail.addEventListener("wheel", e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      rail.scrollLeft += e.deltaY;
    }
  }, { passive: false });


  // Click + drag scrolling
  let down = false;
  let startX = 0;
  let startScroll = 0;

  rail.addEventListener("pointerdown", e => {
    down = true;
    startX = e.clientX;
    startScroll = rail.scrollLeft;
    rail.classList.add("dragging");
  });

  rail.addEventListener("pointermove", e => {
    if (down) {
      rail.scrollLeft = startScroll - (e.clientX - startX);
    }
  });

  const stopDragging = () => {
    down = false;
    rail.classList.remove("dragging");
  };

  rail.addEventListener("pointerup", stopDragging);
  rail.addEventListener("pointercancel", stopDragging);
  rail.addEventListener("pointerleave", stopDragging);


  // Arrow buttons
  const block = rail.closest(".railblock");

  if (block) {
    block.querySelectorAll("button[data-dir]").forEach(btn => {

      btn.addEventListener("click", () => {

        rail.scrollBy({
          left:
            Number(btn.dataset.dir) *
            Math.min(window.innerWidth * 0.7, 650),

          behavior: "smooth"
        });

      });

    });
  }

});


// ==========================================
// CLICK VIDEO → PLAY INSIDE SAME CARD
// ==========================================

document.querySelectorAll(".media").forEach(media => {

  media.style.cursor = "pointer";

  media.addEventListener("click", () => {

    // If the video player is already loaded,
    // don't create another iframe.
    if (media.classList.contains("playing")) {
      return;
    }

    const id = media.dataset.id;

    if (!id) {
      console.error("Google Drive video ID missing.");
      return;
    }


    // Mark this card as playing
    media.classList.add("playing");


    // Create Google Drive video player
    const iframe = document.createElement("iframe");

    iframe.src =
      `https://drive.google.com/file/d/${id}/preview?autoplay=1`;

    iframe.allow = "autoplay; fullscreen";

    iframe.setAttribute("allowfullscreen", "");

    iframe.style.position = "absolute";
    iframe.style.inset = "0";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    iframe.style.zIndex = "10";


    // Put video inside the existing card
    media.appendChild(iframe);

  });

});