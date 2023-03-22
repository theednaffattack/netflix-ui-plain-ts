import "./style.css";

document.addEventListener("click", function (this, evt) {
  let handle;
  // If our target is an HTML Element
  if (evt.target instanceof Element) {
    // If our target is the handle button great,
    // if not we've clicked  a child of the
    // handle button
    if (evt.target.matches(".handle")) {
      handle = evt.target;
    } else {
      handle = evt.target.closest(".handle");
    }
    // If handle has been assigned a value, pass
    // it to our handleClick function
    if (handle != null) {
      onHandleClick(handle);
    }
  }
});

const throttledProgressBar = throttle(() => {
  document.querySelectorAll(".progress-bar").forEach((item) => {
    calculateProgressBar(item);
  });
}, 250);

window.addEventListener("resize", throttledProgressBar);

document.querySelectorAll(".progress-bar").forEach((item) => {
  calculateProgressBar(item);
});

function onHandleClick(handle: Element) {
  const progressBar = handle
    .closest(".movie-grouping")
    ?.querySelector(".progress-bar");
  const container = handle.closest(".container");
  // Confirm that container is not null
  if (container && progressBar) {
    const slider = container.querySelector<HTMLElement>(".slider");
    console.log("VIEW SLIDER", slider);

    // Left handler button
    if (slider && handle.classList.contains("left-handle")) {
      const sliderIndex = parseInt(
        getComputedStyle(slider).getPropertyValue("--slider-index")
      );
      // Only move the carousel left if there are elements
      if (sliderIndex > 0) {
        slider.style.setProperty(
          "--slider-index",
          (sliderIndex - 1).toString()
        );
        // Change the active progress bar item
        progressBar.children[sliderIndex].classList.remove("active");
        progressBar.children[sliderIndex - 1].classList.add("active");
      }
    }
    // Right handler button
    if (slider && handle.classList.contains("right-handle")) {
      const sliderChildrenCount = slider.children.length;
      const itemsPerScreen = parseInt(
        getComputedStyle(slider).getPropertyValue("--items-per-screen")
      );

      const sliderIndex = parseInt(
        getComputedStyle(slider).getPropertyValue("--slider-index")
      );
      // Only move right if there are more elements
      if (sliderIndex < Math.ceil(sliderChildrenCount / itemsPerScreen)) {
        slider.style.setProperty(
          "--slider-index",
          (sliderIndex + 1).toString()
        );

        // Change the active progess bar item
        progressBar.children[sliderIndex].classList.remove("active");
        progressBar.children[sliderIndex + 1].classList.add("active");
      }
    }
  }
}

function calculateProgressBar(progressBar: Element) {
  progressBar.innerHTML = "";

  const grouping = progressBar.closest(".movie-grouping");

  if (!grouping) {
    return;
  }
  const slider = grouping.querySelector<HTMLDivElement>(".slider");
  if (!slider) {
    return;
  }
  const sliderIndex = parseInt(
    getComputedStyle(slider).getPropertyValue("--slider-index")
  );
  const itemCount = slider.children.length;
  const itemsPerScreen = parseInt(
    getComputedStyle(slider).getPropertyValue("--items-per-screen")
  );
  const progressBarItemsCount = Math.ceil(itemCount / itemsPerScreen);

  // Add a progress tab for each item
  for (let index = 0; index < progressBarItemsCount; index++) {
    const barItem = document.createElement("div");
    barItem.classList.add("progress-item");
    if (index === sliderIndex) {
      barItem.classList.add("active");
    }
    progressBar.append(barItem);
  }
}

// Adapted from: https://decipher.dev/30-seconds-of-typescript/docs/throttle/
function throttle(fn: Function, delay: number = 300) {
  let shouldWait = false;
  let lastFn: ReturnType<typeof setTimeout>;
  let lastTime: number;
  return function (this: any) {
    const context = this;
    const args = arguments;
    // If it's our first run, don't throttle
    if (!shouldWait) {
      fn.apply(context, args);
      lastTime = Date.now();
      shouldWait = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= delay) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(delay - (Date.now() - lastTime), 0));
    }
  };
}
