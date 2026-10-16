import React from "react";

/**
 * Splits text into words for GSAP.
 *  - "\n" starts a new line.
 *  - a word prefixed with "~" gets the pink→blue accent gradient.
 *  - variant "mask"  → each word sits in an overflow mask (class .wi animates up)
 *  - variant "scrub" → each word is a .sw span (opacity scrubbed on scroll)
 * The full sentence is exposed once as visually-hidden text and the animated
 * word spans are aria-hidden, so screen readers never read word fragments.
 */
export default function SplitText({
  text,
  as: Tag = "span",
  variant = "mask",
  className = "",
  ...rest
}) {
  const plain = text.replace(/~/g, "").replace(/\n/g, " ");
  const lines = text.split("\n");

  return (
    <Tag className={className} {...rest}>
      <span className="sr-only">{plain}</span>
      {lines.map((line, li) => (
        <span className="ln" aria-hidden="true" key={li}>
          {line.split(" ").map((raw, wi) => {
            const accent = raw.startsWith("~");
            const word = accent ? raw.slice(1) : raw;
            if (variant === "scrub") {
              return (
                <React.Fragment key={wi}>
                  <span className={`sw${accent ? " grad" : ""}`}>{word}</span>{" "}
                </React.Fragment>
              );
            }
            return (
              <React.Fragment key={wi}>
                <span className="w">
                  <span className={`wi${accent ? " grad" : ""}`}>{word}</span>
                </span>{" "}
              </React.Fragment>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
