
import * as ts from 'typescript';
import * as fs from 'fs-extra';
import requireFromString from 'require-from-string';
import render from 'preact-render-to-string';

export async function renderTSX(absolutePath: string, context: object & any): Promise<string> {
  const sources = (await fs.readFile(absolutePath)).toString();
  const transpiledSources = ts.transpileModule(sources, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React
    }
  });
  const module = requireFromString(transpiledSources.outputText);
  if (typeof module.default !== 'function') {
    throw new Error(`Module's default export is missing or not a function: ${absolutePath}`);
  }

  const jsxOutput = module.default(context);
  return render(jsxOutput);
}
