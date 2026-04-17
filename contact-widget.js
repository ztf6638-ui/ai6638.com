(function () {
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      document.body.removeChild(textarea);
    }
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-copy]");
    if (!button) return;

    var value = button.getAttribute("data-copy");
    var label = button.getAttribute("data-copy-label") || "联系方式";
    var widget = button.closest(".floating-contact");
    var status = widget && widget.querySelector(".floating-contact__copy-status");

    copyText(value).then(function () {
      if (!status) return;
      status.textContent = label + "已复制";
      window.clearTimeout(status._copyTimer);
      status._copyTimer = window.setTimeout(function () {
        status.textContent = "";
      }, 1800);
    }).catch(function () {
      if (!status) return;
      status.textContent = "复制失败，请手动复制";
    });
  });
})();
