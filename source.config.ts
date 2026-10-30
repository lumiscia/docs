import { defineConfig, defineDocs } from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      // One theme built from the website's `code` tokens; code blocks stay dark in both site themes.
      themes: {
        dark: {
          name: "lumiscia",
          type: "dark",
          settings: [
            { settings: { background: "#000000", foreground: "#e9e8ec" } },
            {
              scope: ["comment", "punctuation.definition.comment"],
              settings: { foreground: "#7b7984", fontStyle: "italic" },
            },
            {
              scope: ["string", "string.template", "markup.inline.raw"],
              settings: { foreground: "#8fd3ff" },
            },
            {
              scope: ["keyword", "storage", "keyword.operator.new", "constant.language"],
              settings: { foreground: "#a9c4ff" },
            },
            {
              scope: ["constant.numeric", "constant.character", "constant.other"],
              settings: { foreground: "#ffc9a8" },
            },
            {
              scope: [
                "entity.name.type",
                "entity.name.class",
                "entity.name.tag",
                "entity.other.attribute-name",
                "support.type",
                "support.class",
                "meta.object-literal.key",
                "variable.other.property",
              ],
              settings: { foreground: "#e3f2ff" },
            },
            {
              scope: ["entity.name.function", "support.function"],
              settings: { foreground: "#ffffff" },
            },
            {
              scope: ["punctuation", "meta.brace", "keyword.operator"],
              settings: { foreground: "#a3a1ab" },
            },
            { scope: ["markup.deleted"], settings: { foreground: "#ff7a66" } },
            { scope: ["markup.inserted"], settings: { foreground: "#7ed4a0" } },
          ],
        },
      },
      defaultColor: "dark",
      icon: false,
    },
  },
});
