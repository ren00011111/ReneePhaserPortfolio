document.addEventListener("DOMContentLoaded", () => {
  // Open dialogs from any element with data-popup="dialogId"
  const triggers = document.querySelectorAll("[data-popup]");
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const popupId = trigger.getAttribute("data-popup");
      const targetPopup = document.getElementById(popupId);
      if (targetPopup && typeof targetPopup.showModal === "function") {
        targetPopup.showModal();
        targetPopup.focus(); // helps ensure keyboard focus is on the dialog
      }
    });
  });

  // Close buttons inside dialogs
  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest("dialog")?.close();
    });
  });

  // Click outside (on backdrop) closes
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });

    // Optional: if something cancels the native cancel event, still close
    dialog.addEventListener("cancel", (e) => {
      // If another script prevents default cancel, we still want it closed:
      // (If you WANT to allow preventing ESC close sometimes, remove this.)
      e.preventDefault();
      dialog.close();
    });
  });

  // HARDENED: Close on ESC even if Phaser/other code intercepts it
  // Capture phase runs before bubble listeners.
  window.addEventListener(
    "keydown",
    (e) => {
      if (e.key !== "Escape") return;

      // Close the topmost open dialog if any
      const openDialogs = Array.from(document.querySelectorAll("dialog[open]"));
      if (openDialogs.length) {
        const top = openDialogs[openDialogs.length - 1];
        top.close();
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true // capture!
  );
});
