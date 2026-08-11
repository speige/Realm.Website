(function () {
  var tabs = document.querySelectorAll(".forum-channel-tab");
  var threads = document.querySelectorAll(".forum-thread");

  if (!tabs.length || !threads.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var filter = tab.getAttribute("data-filter") || "all";

      tabs.forEach(function (t) {
        var active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", active ? "true" : "false");
      });

      threads.forEach(function (thread) {
        var channel = thread.getAttribute("data-channel");
        var show = filter === "all" || channel === filter;
        thread.classList.toggle("is-hidden", !show);
      });
    });
  });
})();
