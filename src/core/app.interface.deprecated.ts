/*
 * DEPRECATED
 *
 * Replaced by:
 * - RuntimeApp
 * - RuntimeContext
 *
 * Old action-based runtime architecture.
 */

import { AppContext } from './app-context.interface.deprecated';

export interface StateflowApp {

  name: string;

  init(
    ctx: AppContext,
  ): void;

  actions:
    Record<
      string,
      (
        ctx: AppContext,
        payload?: any,
      ) => any
    >;
}