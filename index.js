function givePgpKey() {
  fetch("VWilk_0x3871C00A9A787DB8_public.asc")
    .then((res) => res.text())
    .then((text) => {
      navigator.clipboard.writeText(text);
      alert("Copied the text: " + text);
    })
    .catch((e) => console.error(e));
}
