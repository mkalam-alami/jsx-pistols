import * as React from "preact";
import { TestContext } from "./index";

export default function render({ name }: TestContext) {
  return <div>Hello {name}!</div>;
}
