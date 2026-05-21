// export interface Protocol {
//   addMethod(
//     route: string,
//     handler: Function
//   ): void;
// }
export interface Protocol {
  addMethod(route: string, handler: Function): void;
  receive(payload: unknown): Promise<unknown>;
}
