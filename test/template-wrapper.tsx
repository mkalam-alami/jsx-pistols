import * as React from "preact";

declare module "preact" {
  namespace JSX {
    interface IntrinsicElements {
      ["jsx-wrapper"]: HTMLAttributes<HTMLElement>;
    }
  }
}

export default function render() {
  return <div><jsx-wrapper>Hello world!</jsx-wrapper></div>;
}
