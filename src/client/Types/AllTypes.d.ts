// TS does not support sass imports, workaround by declared this module
declare module '*.scss' {
  // This adds support for css modules
  const content: {[className: string]: string};
  export = content;
}
declare module "*.svg" {
  // This adds support for svg modules
  const content: any;
  export default content;
}
