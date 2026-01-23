document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll("[data-popup]");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const popupId = trigger.getAttribute("data-popup");
      const targetPopup = document.getElementById(popupId);
      if (targetPopup) targetPopup.showModal();
    });
  });

  const closeButtons = document.querySelectorAll(".close-btn");

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.closest("dialog").close();
    });
  });

  const allDialogs = document.querySelectorAll("dialog");
  allDialogs.forEach((dialog) => {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
  });
});
