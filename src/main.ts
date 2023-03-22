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

function onHandleClick(handle: Element) {
  const container = handle.closest(".container");
  // Confirm that container is not null
  if (container) {
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
      }
    }
  }
}
