
import Image from "@tiptap/extension-image";

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      width: {
        default: "100%",
        parseHTML: (element) =>
          element.getAttribute("data-width") || "100%",
        renderHTML: (attributes) => ({
          "data-width": attributes.width,
        }),
      },

      alignment: {
        default: "center",
        parseHTML: (element) =>
          element.getAttribute("data-alignment") || "center",
        renderHTML: (attributes) => ({
          "data-alignment": attributes.alignment,
        }),
      },

      caption: {
        default: "",
        parseHTML: (element) =>
          element.getAttribute("data-caption") || "",
        renderHTML: (attributes) =>
          attributes.caption
            ? { "data-caption": attributes.caption }
            : {},
      },
    };
  },
});
